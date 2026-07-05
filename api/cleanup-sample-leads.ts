import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: this auth logic is duplicated in api/admin-login.ts rather than
// imported from a shared file — see the comment there for why.
// See the comment in api/leads.ts about why this uses `pg` rather than
// @vercel/postgres (that package doesn't actually work with Supabase).

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
let poolInitError: string | null = null;
try {
  pool = buildPool(getConnectionString());
} catch (err) {
  poolInitError = err instanceof Error ? err.message : "Unknown database configuration error";
}

// The exact fake phone numbers used in api/seed-leads.ts's SAMPLE_LEADS.
// Deleting by these specific values (rather than by name or date range)
// means this can never touch a real customer's lead, even coincidentally.
const SAMPLE_PHONE_NUMBERS = [
  "07700 900123",
  "07700 900456",
  "020 7946 0958",
  "07700 900789",
  "07700 900321",
  "07700 900654",
  "020 3488 1122",
  "07700 900987",
  "07700 900234",
  "020 3488 7766",
  "07700 900567",
  "07700 900345",
];

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

  if (!pool) {
    console.error("Postgres pool init error:", poolInitError);
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    const { rowCount } = await pool.query(
      `DELETE FROM leads WHERE fields->>'phone' = ANY($1::text[]);`,
      [SAMPLE_PHONE_NUMBERS]
    );
    return res.status(200).json({ success: true, deleted: rowCount });
  } catch (err) {
    console.error("Cleanup error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
