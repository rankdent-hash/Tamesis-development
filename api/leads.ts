import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
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

// Vercel's Supabase marketplace integration prefixes every env var with the
// storage resource's name (e.g. "tamesisstorage_") instead of the plain
// POSTGRES_URL some tooling looks for automatically. This tries a handful of
// likely full-connection-string variable names first, then falls back to
// building one from the individual host/database/user/password variables,
// which the integration does expose with a consistent prefix.
//
// IMPORTANT: uses the standard `pg` driver, not @vercel/postgres — that
// package is built on Neon's serverless driver, which is specifically wired
// for Neon-hosted databases and silently rewrites the connection host when
// pointed at a non-Neon Postgres instance (confirmed via diagnostic logging:
// it substituted a hardcoded Neon-internal host even when given a correct,
// working Supabase connection string). `pg` makes a normal TCP connection to
// whatever host you give it, which works correctly with Supabase.
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
let poolInitError: string | null = null;
try {
  pool = buildPool(getConnectionString());
} catch (err) {
  poolInitError = err instanceof Error ? err.message : "Unknown database configuration error";
}

const VALID_STATUSES = ["new", "contacted", "quoted", "won", "lost"];

async function ensureSchema() {
  await pool!.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id SERIAL PRIMARY KEY,
      form_type TEXT NOT NULL,
      fields JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  await pool!.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new';`);
  await pool!.query(`ALTER TABLE leads ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';`);
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

  if (!pool) {
    console.error("Postgres pool init error:", poolInitError);
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    await ensureSchema();

    if (req.method === "GET") {
      const { rows } = await pool.query(`
        SELECT id, form_type, fields, status, notes, created_at
        FROM leads
        ORDER BY created_at DESC
        LIMIT 500;
      `);
      return res.status(200).json({ success: true, leads: rows });
    }

    if (req.method === "PATCH") {
      const { id, status, notes } = req.body as { id?: number; status?: string; notes?: string };
      if (!id) return res.status(400).json({ success: false, error: "Lead id required" });

      if (status !== undefined && !VALID_STATUSES.includes(status)) {
        return res.status(400).json({ success: false, error: "Invalid status" });
      }

      if (status !== undefined) {
        await pool.query(`UPDATE leads SET status = $1 WHERE id = $2;`, [status, id]);
      }
      if (notes !== undefined) {
        await pool.query(`UPDATE leads SET notes = $1 WHERE id = $2;`, [notes, id]);
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("Leads error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
