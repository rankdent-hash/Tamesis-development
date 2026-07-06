import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { Pool } from "pg";

// Vercel's Supabase marketplace integration prefixes every env var with the
// storage resource's name (e.g. "tamesisstorage_") instead of the plain
// POSTGRES_URL some tooling looks for automatically. This tries a handful of
// likely full-connection-string variable names first, then falls back to
// building one from the individual host/database/user/password variables.
//
// IMPORTANT: uses the standard `pg` driver, not @vercel/postgres — see the
// longer explanation in api/leads.ts. Short version: @vercel/postgres is
// built on Neon's serverless driver, which doesn't actually work correctly
// against a non-Neon host like Supabase.
function getConnectionString(): string {
  const candidateUrlVars = [
    "POSTGRES_URL",
    "tamesisstorage_POSTGRES_URL",
    "tamesisstorage_POSTGRES_URL_NON_POOLING",
    "tamesisstorage_DATABASE_URL",
    "tamesisstorage_POSTGRES_PRISMA_URL",
  ];
  for (const key of candidateUrlVars) {
    if (process.env[key]) return process.env[key] as string;
  }

  const host = process.env.tamesisstorage_POSTGRES_HOST;
  const database = process.env.tamesisstorage_POSTGRES_DATABASE;
  const password = process.env.tamesisstorage_POSTGRES_PASSWORD;
  const user = process.env.tamesisstorage_POSTGRES_USER || "postgres";

  if (host && database && password) {
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  throw new Error(
    "No Postgres connection string or host/database/user/password env vars found (checked tamesisstorage_ prefixed variables)"
  );
}

// The connection string from Supabase/Vercel includes "?sslmode=require",
// which newer versions of pg-connection-string treat as an alias for
// "verify-full" (strict certificate chain + hostname verification) —
// overriding any explicit `ssl` option passed separately, and causing a
// SELF_SIGNED_CERT_IN_CHAIN error against Supabase's cert chain. Stripping
// sslmode from the URL and relying purely on the explicit ssl object below
// avoids that.
function buildPool(connectionString: string): Pool {
  let cleaned = connectionString;
  try {
    const url = new URL(connectionString);
    url.searchParams.delete("sslmode");
    cleaned = url.toString();
  } catch {
    // Leave as-is if it doesn't parse as a standard URL.
  }
  return new Pool({ connectionString: cleaned, ssl: { rejectUnauthorized: false } });
}

let pool: Pool | null = null;
try {
  pool = buildPool(getConnectionString());
} catch (err) {
  console.error("Postgres pool init error (lead storage will be skipped):", err);
}

// Fallback notification email if no setting has been saved in the admin panel yet.
const NOTIFY_FALLBACK = process.env.NOTIFY_EMAIL || "contact@tamesisdevelopment.co.uk";

interface EmailSettings {
  notifyEmail: string;
  resendApiKey: string | null;
  web3formsApiKey: string | null;
  provider: "resend" | "web3forms" | "both";
}

async function getEmailSettings(): Promise<EmailSettings> {
  const defaults: EmailSettings = {
    notifyEmail: NOTIFY_FALLBACK,
    resendApiKey: process.env.RESEND_API_KEY || null,
    web3formsApiKey: process.env.WEB3FORMS_API_KEY || null,
    provider: "resend",
  };
  if (!pool) return defaults;
  try {
    await pool.query(`CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);`);
    const { rows } = await pool.query(
      `SELECT key, value FROM settings WHERE key IN ('notify_email', 'resend_api_key', 'web3forms_api_key', 'email_provider');`
    );
    const map: Record<string, string> = {};
    for (const row of rows) map[row.key] = row.value;
    return {
      notifyEmail: map.notify_email || defaults.notifyEmail,
      resendApiKey: map.resend_api_key || defaults.resendApiKey,
      web3formsApiKey: map.web3forms_api_key || defaults.web3formsApiKey,
      provider: (map.email_provider as EmailSettings["provider"]) || defaults.provider,
    };
  } catch (err) {
    console.error("Could not read email settings (using fallback):", err);
    return defaults;
  }
}

async function sendViaWeb3Forms(
  apiKey: string,
  label: string,
  fields: Record<string, string>,
  recipients: string[]
): Promise<boolean> {
  try {
    const formData = new FormData();
    formData.append("access_key", apiKey);
    formData.append("subject", `New ${label} — ${fields.name || fields.fullName || "Website Visitor"}`);
    formData.append("from_name", "Tamesis Development Ltd Website");
    // Web3Forms always sends to the address registered with the access key;
    // additional addresses are cc'd. If only one address is configured, cc
    // is simply omitted.
    if (recipients.length > 1) {
      formData.append("cc", recipients.slice(1).join(","));
    }
    for (const [key, value] of Object.entries(fields)) {
      if (value) formData.append(key, String(value));
    }

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formData,
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      const text = await res.text();
      console.error(
        `Web3Forms returned non-JSON response (status ${res.status}, content-type "${contentType}"). First 200 chars:`,
        text.slice(0, 200)
      );
      return false;
    }

    const data = await res.json();
    if (!data.success) {
      console.error("Web3Forms error (non-fatal):", data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Web3Forms send error (non-fatal):", err);
    return false;
  }
}

// Resend's shared sandbox sender — works immediately with no setup, but reads
// as generic. Once a real domain is verified with Resend, change this to
// something like "Tamesis Development <notifications@tamesisdevelopment.co.uk>".
const FROM = "Tamesis Website <onboarding@resend.dev>";

const FORM_LABELS: Record<string, string> = {
  "hero-quote": "Hero Quote Form",
  quote: "Quote Request",
  contact: "Contact Form",
  "report-repair": "Report a Repair",
  emergency: "Emergency Callout",
  careers: "Careers Application",
  callback: "Callback Request",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Basic CORS (same-origin in production, but harmless to allow)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const { formType, fields: rawFields } = req.body as {
      formType?: string;
      fields?: Record<string, string>;
    };

    if (!formType || !rawFields || typeof rawFields !== "object") {
      return res.status(400).json({ success: false, error: "Missing form data" });
    }

    // The client nests the honeypot inside `fields` — pull it out and strip
    // it before storing/emailing so it never shows up as a real field.
    const { honeypot, ...fields } = rawFields;

    // Simple spam trap — a hidden field that real users never fill in.
    if (honeypot) {
      return res.status(200).json({ success: true });
    }

    const label = FORM_LABELS[formType] || formType;

    // Saving the lead and emailing a notification are independent — one
    // failing (e.g. Resend not configured yet) should never stop the other,
    // and the submission only counts as failed if BOTH fail. That way a
    // customer's enquiry is never silently lost just because, say, the email
    // service has a hiccup.
    let dbSaved = false;
    try {
      if (!pool) throw new Error("Postgres pool not initialized");
      await pool.query(`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          form_type TEXT NOT NULL,
          fields JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `);
      await pool.query(`INSERT INTO leads (form_type, fields) VALUES ($1, $2);`, [formType, JSON.stringify(fields)]);
      dbSaved = true;
    } catch (dbErr) {
      console.error("Lead storage error (non-fatal):", dbErr);
    }

    let emailSent = false;
    const emailSettings = await getEmailSettings();
    const useResend = emailSettings.provider === "resend" || emailSettings.provider === "both";
    const useWeb3Forms = emailSettings.provider === "web3forms" || emailSettings.provider === "both";

    if (useResend) {
      if (!emailSettings.resendApiKey) {
        console.error("No Resend API key configured — skipping Resend notification (non-fatal)");
      } else {
        try {
          const rows = Object.entries(fields)
            .filter(([, value]) => value)
            .map(
              ([key, value]) =>
                `<tr><td style="padding:8px 12px;border-bottom:1px solid #E6EAE7;color:#565F58;font-size:13px;text-transform:capitalize;white-space:nowrap;">${escapeHtml(
                  key
                )}</td><td style="padding:8px 12px;border-bottom:1px solid #E6EAE7;color:#16201A;font-size:14px;">${escapeHtml(
                  String(value)
                )}</td></tr>`
            )
            .join("");

          const html = `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
              <div style="background:#0E1611;padding:20px 24px;border-radius:8px 8px 0 0;">
                <span style="color:#C6A15B;font-weight:bold;font-size:16px;">Tamesis Development Ltd</span>
              </div>
              <div style="border:1px solid #E6EAE7;border-top:none;border-radius:0 0 8px 8px;padding:24px;">
                <h2 style="margin:0 0 16px;color:#16201A;font-size:18px;">New ${escapeHtml(label)}</h2>
                <table style="width:100%;border-collapse:collapse;">${rows}</table>
              </div>
            </div>
          `;

          const resend = new Resend(emailSettings.resendApiKey);
          const recipients = emailSettings.notifyEmail
            .split(",")
            .map((e) => e.trim())
            .filter(Boolean);
          const { error } = await resend.emails.send({
            from: FROM,
            to: recipients,
            replyTo: fields.email || undefined,
            subject: `New ${label} — ${fields.name || "Website Visitor"}`,
            html,
          });

          if (error) {
            console.error("Resend error (non-fatal):", error);
          } else {
            emailSent = true;
          }
        } catch (emailErr) {
          console.error("Resend send error (non-fatal):", emailErr);
        }
      }
    }

    if (useWeb3Forms) {
      if (!emailSettings.web3formsApiKey) {
        console.error("No Web3Forms API key configured — skipping Web3Forms notification (non-fatal)");
      } else {
        const recipients = emailSettings.notifyEmail
          .split(",")
          .map((e) => e.trim())
          .filter(Boolean);
        const sent = await sendViaWeb3Forms(emailSettings.web3formsApiKey, label, fields, recipients);
        if (sent) emailSent = true;
      }
    }

    if (!dbSaved && !emailSent) {
      return res.status(500).json({ success: false, error: "Unable to process submission" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Form submission error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
