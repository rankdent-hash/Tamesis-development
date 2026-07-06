import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { Resend } from "resend";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: auth + connection logic duplicated across api/ functions rather than
// imported from a shared file — see the comment in api/admin-login.ts for why.

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expectedSignature = createHmac("sha256", getSecret()).update(payload).digest("hex");
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expectedSignature);
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return false;
  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const expires = Number(decoded.split(":").pop());
    return Number.isFinite(expires) && Date.now() < expires;
  } catch {
    return false;
  }
}

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
  throw new Error("No Postgres connection string or host/database/user/password env vars found");
}

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
  console.error("Postgres pool init error (test-email):", err);
}

const NOTIFY_FALLBACK = process.env.NOTIFY_EMAIL || "info@tamesisdevelopment.co.uk";
// tamesisdevelopment.co.uk is verified with Resend - see the matching
// comment in api/submit-form.ts.
const FROM = "Tamesis Development Ltd <notifications@tamesisdevelopment.co.uk>";

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
    console.error("Could not read email settings (test-email):", err);
    return defaults;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!verifyToken(token)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  const settings = await getEmailSettings();
  const results: { provider: string; success: boolean; detail: string }[] = [];

  const useResend = settings.provider === "resend" || settings.provider === "both";
  const useWeb3Forms = settings.provider === "web3forms" || settings.provider === "both";

  if (useResend) {
    if (!settings.resendApiKey) {
      results.push({ provider: "Resend", success: false, detail: "No Resend API key configured" });
    } else {
      try {
        const resend = new Resend(settings.resendApiKey);
        const { error } = await resend.emails.send({
          from: FROM,
          to: settings.notifyEmail,
          subject: "Tamesis Website — Test Email",
          html: `<p>This is a test email from the Tamesis Development Ltd website admin panel.</p><p>Sent via <strong>Resend</strong> to: ${settings.notifyEmail}</p><p>If you received this, email notifications are working correctly.</p>`,
        });
        if (error) {
          results.push({ provider: "Resend", success: false, detail: JSON.stringify(error) });
        } else {
          results.push({ provider: "Resend", success: true, detail: `Sent to ${settings.notifyEmail}` });
        }
      } catch (err) {
        results.push({ provider: "Resend", success: false, detail: err instanceof Error ? err.message : "Unknown error" });
      }
    }
  }

  if (useWeb3Forms) {
    if (!settings.web3formsApiKey) {
      results.push({ provider: "Web3Forms", success: false, detail: "No Web3Forms API key configured" });
    } else {
      try {
        const formData = new FormData();
        formData.append("access_key", settings.web3formsApiKey);
        formData.append("subject", "Tamesis Website — Test Email");
        formData.append("from_name", "Tamesis Development Ltd Website");
        formData.append("message", `This is a test email sent via Web3Forms to: ${settings.notifyEmail}`);

        const webRes = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData,
        });
        const contentType = webRes.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await webRes.text();
          results.push({
            provider: "Web3Forms",
            success: false,
            detail: `Non-JSON response (status ${webRes.status}): ${text.slice(0, 150)}`,
          });
        } else {
          const data = await webRes.json();
          results.push({ provider: "Web3Forms", success: !!data.success, detail: JSON.stringify(data) });
        }
      } catch (err) {
        results.push({ provider: "Web3Forms", success: false, detail: err instanceof Error ? err.message : "Unknown error" });
      }
    }
  }

  const anySuccess = results.some((r) => r.success);
  return res.status(anySuccess ? 200 : 502).json({ success: anySuccess, notifyEmail: settings.notifyEmail, results });
}
