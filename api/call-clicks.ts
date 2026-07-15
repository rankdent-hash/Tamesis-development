import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: auth + connection logic is duplicated from api/leads.ts and
// api/submit-form.ts rather than imported from a shared file — see the
// comment in api/admin-login.ts for why (kept consistent with the rest of
// the API routes for the same reason).

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
let poolInitError: string | null = null;
try {
  pool = buildPool(getConnectionString());
} catch (err) {
  poolInitError = err instanceof Error ? err.message : "Unknown database configuration error";
}

async function ensureSchema() {
  await pool!.query(`
    CREATE TABLE IF NOT EXISTS call_clicks (
      id SERIAL PRIMARY KEY,
      phone_number TEXT NOT NULL,
      page_path TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (!pool) {
    console.error("Postgres pool init error:", poolInitError);
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    await ensureSchema();

    // POST is public and unauthenticated on purpose — this is fired from
    // ordinary site visitors clicking a "Call Now" link, the same way
    // submit-form.ts is public for form submissions. GET (the admin view of
    // the data) requires the same admin session token as the other admin
    // endpoints.
    if (req.method === "POST") {
      const { phoneNumber, pagePath } = req.body as { phoneNumber?: string; pagePath?: string };
      if (!phoneNumber || !pagePath) {
        return res.status(400).json({ success: false, error: "Missing phoneNumber or pagePath" });
      }
      // Defensive length caps — this is an unauthenticated write endpoint,
      // so it shouldn't be possible to stuff arbitrarily large values in.
      const cleanPhone = String(phoneNumber).slice(0, 40);
      const cleanPath = String(pagePath).slice(0, 300);
      await pool.query(`INSERT INTO call_clicks (phone_number, page_path) VALUES ($1, $2);`, [cleanPhone, cleanPath]);
      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;
      if (!verifyToken(token)) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      const result = await pool.query(
        `SELECT id, phone_number, page_path, created_at FROM call_clicks ORDER BY created_at DESC LIMIT 5000;`
      );
      return res.status(200).json({ success: true, clicks: result.rows });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("call-clicks error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
