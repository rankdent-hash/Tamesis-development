import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";
import { sql } from "@vercel/postgres";

// Where notification emails are sent. Update once a real inbox is confirmed.
const NOTIFY_TO = process.env.NOTIFY_EMAIL || "contact@tamesisdevelopment.co.uk";

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

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return res.status(500).json({ success: false, error: "Email service not configured" });
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

    // Store the lead first — this should succeed even if email delivery has
    // an issue, so a submission is never silently lost.
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS leads (
          id SERIAL PRIMARY KEY,
          form_type TEXT NOT NULL,
          fields JSONB NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        );
      `;
      await sql`
        INSERT INTO leads (form_type, fields) VALUES (${formType}, ${JSON.stringify(fields)});
      `;
    } catch (dbErr) {
      // Don't fail the whole submission just because the database isn't
      // configured yet (e.g. Postgres storage not attached in Vercel) — the
      // email notification below still works either way.
      console.error("Lead storage error (non-fatal):", dbErr);
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: FROM,
      to: NOTIFY_TO,
      replyTo: fields.email || undefined,
      subject: `New ${label} — ${fields.name || "Website Visitor"}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(502).json({ success: false, error: "Failed to send notification" });
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
