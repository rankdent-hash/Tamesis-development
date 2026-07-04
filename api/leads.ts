import type { VercelRequest, VercelResponse } from "@vercel/node";
import { sql } from "@vercel/postgres";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: this auth logic is duplicated in api/admin-login.ts and
// api/seed-leads.ts rather than imported from a shared file — see the
// comment in api/admin-login.ts for why.

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
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  try {
    const decoded = Buffer.from(payload, "base64url").toString("utf-8");
    const expires = Number(decoded.split(":").pop());
    return Number.isFinite(expires) && Date.now() < expires;
  } catch {
    return false;
  }
}

const VALID_STATUSES = ["new", "contacted", "quoted", "won", "lost"];

async function ensureSchema() {
  await sql`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      form_type TEXT NOT NULL,
      fields JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';`;
  await sql`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!verifyToken(token)) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    await ensureSchema();

    if (req.method === "GET") {
      const { rows } = await sql`
        SELECT id, form_type, fields, status, notes, created_at
        FROM leads
        ORDER BY created_at DESC
        LIMIT 500;
      `;
      return res.status(200).json({ success: true, leads: rows });
    }

    if (req.method === "PATCH") {
      const { id, status, notes } = req.body as { id?: number; status?: string; notes?: string };
      if (!id) return res.status(400).json({ success: false, error: "Lead id required" });

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      if (status !== undefined) {
        await sql`UPDATE leads SET status = ${status} WHERE id = ${id};`;
      }
      if (notes !== undefined) {
        await sql`UPDATE leads SET notes = ${notes} WHERE id = ${id};`;
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("Leads error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
