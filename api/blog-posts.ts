import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";

// Public, read-only endpoint — no auth. Only ever returns published posts.
// See api/admin-blog-posts.ts for the authenticated create/edit/delete API,
// and the comment in api/admin-login.ts for why connection/auth logic is
// duplicated across api/ functions instead of shared.

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

async function ensureSchema() {
  await pool!.query(`
    CREATE TABLE IF NOT EXISTS blog_posts (
      id SERIAL PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'General',
      cover_photo TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      published_at TIMESTAMPTZ
    );
  `);
  await pool!.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS related_service_slug TEXT;`);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ success: false, error: "Method not allowed" });

  if (!pool) {
    console.error("Postgres pool init error:", poolInitError);
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    await ensureSchema();

    const { slug, service } = req.query as { slug?: string; service?: string };

    if (slug) {
      const { rows } = await pool.query(
        `SELECT id, slug, title, excerpt, content, category, cover_photo, related_service_slug, published_at
         FROM blog_posts WHERE slug = $1 AND status = 'published' LIMIT 1;`,
        [slug]
      );
      if (rows.length === 0) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      return res.status(200).json({ success: true, post: rows[0] });
    }

    if (service) {
      const { rows } = await pool.query(
        `SELECT id, slug, title, excerpt, category, cover_photo, related_service_slug, published_at
         FROM blog_posts WHERE status = 'published' AND related_service_slug = $1
         ORDER BY published_at DESC NULLS LAST, created_at DESC LIMIT 1;`,
        [service]
      );
      return res.status(200).json({ success: true, posts: rows });
    }

    const { rows } = await pool.query(
      `SELECT id, slug, title, excerpt, category, cover_photo, related_service_slug, published_at
       FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC NULLS LAST, created_at DESC;`
    );
    return res.status(200).json({ success: true, posts: rows });
  } catch (err) {
    console.error("Blog posts error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
