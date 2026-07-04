import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createPool } from "@vercel/postgres";
import { createHmac, timingSafeEqual } from "crypto";

// NOTE: this auth logic is duplicated across the api/ functions rather than
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
    if (process.env[key]) {
      const value = process.env[key] as string;
      try {
        const parsedHost = new URL(value.replace(/^postgres(ql)?:/, "http:")).hostname;
        console.error(`[db] Using connection string from ${key}, host=${parsedHost}`);
      } catch {
        console.error(`[db] Using connection string from ${key} (could not parse host for logging)`);
      }
      return value;
    }
  }

  const host = process.env.tamesisstorage_POSTGRES_HOST;
  const database = process.env.tamesisstorage_POSTGRES_DATABASE;
  const password = process.env.tamesisstorage_POSTGRES_PASSWORD;
  const user = process.env.tamesisstorage_POSTGRES_USER || "postgres";

  if (host && database && password) {
    console.error(`[db] Building connection string from parts: host=${host}, database=${database}, user=${user}`);
    return `postgres://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}/${database}?sslmode=require`;
  }

  const relevantKeys = Object.keys(process.env).filter((k) => /postgres|supabase|database/i.test(k));
  console.error("No usable Postgres connection found. Relevant env var names present:", relevantKeys);
  throw new Error(
    "No Postgres connection string or host/database/user/password env vars found (checked tamesisstorage_ prefixed variables)"
  );
}

let pool: ReturnType<typeof createPool> | null = null;
let poolInitError: string | null = null;
try {
  pool = createPool({ connectionString: getConnectionString() });
} catch (err) {
  poolInitError = err instanceof Error ? err.message : "Unknown database configuration error";
}

async function ensureSchema() {
  await pool!.sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `;
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
      const { rows } = await pool.sql`SELECT key, value FROM settings;`;
      const settings: Record<string, string> = {};
      for (const row of rows) settings[row.key] = row.value;
      return res.status(200).json({ success: true, settings });
    }

    if (req.method === "PATCH") {
      const { notifyEmail } = req.body as { notifyEmail?: string };
      if (notifyEmail !== undefined) {
        if (notifyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(notifyEmail)) {
          return res.status(400).json({ success: false, error: "Invalid email address" });
        }
        await pool.sql`
          INSERT INTO settings (key, value) VALUES ('notify_email', ${notifyEmail})
          ON CONFLICT (key) DO UPDATE SET value = ${notifyEmail};
        `;
      }
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("Settings error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
