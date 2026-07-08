import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

// Admin-only CRUD for blog posts. See api/admin-login.ts for why auth and
// connection logic is duplicated across api/ functions instead of shared.

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

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
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
      const { rows } = await pool.query(
        `SELECT id, slug, title, excerpt, content, category, cover_photo, related_service_slug, status, created_at, updated_at, published_at
         FROM blog_posts ORDER BY created_at DESC;`
      );
      return res.status(200).json({ success: true, posts: rows });
    }

    if (req.method === "POST") {
      const { title, excerpt, content, category, coverPhoto, relatedServiceSlug, status } = req.body as {
        title?: string;
        excerpt?: string;
        content?: string;
        category?: string;
        coverPhoto?: string;
        relatedServiceSlug?: string;
        status?: string;
      };
      if (!title || !excerpt || !content) {
        return res.status(400).json({ success: false, error: "Title, excerpt and content are required" });
      }

      let slug = slugify(title);
      // Ensure uniqueness — append -2, -3, etc. if the slug already exists.
      const { rows: existing } = await pool.query(`SELECT slug FROM blog_posts WHERE slug LIKE $1;`, [`${slug}%`]);
      if (existing.some((r) => r.slug === slug)) {
        let i = 2;
        while (existing.some((r) => r.slug === `${slug}-${i}`)) i++;
        slug = `${slug}-${i}`;
      }

      const finalStatus = status === "published" ? "published" : "draft";
      const { rows } = await pool.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, category, cover_photo, related_service_slug, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, ${finalStatus === "published" ? "now()" : "NULL"})
         RETURNING id, slug;`,
        [slug, title, excerpt, content, category || "General", coverPhoto || null, relatedServiceSlug || null, finalStatus]
      );
      return res.status(200).json({ success: true, id: rows[0].id, slug: rows[0].slug });
    }

    if (req.method === "PATCH") {
      const { id, title, excerpt, content, category, coverPhoto, relatedServiceSlug, status } = req.body as {
        id?: number;
        title?: string;
        excerpt?: string;
        content?: string;
        category?: string;
        coverPhoto?: string;
        relatedServiceSlug?: string;
        status?: string;
      };
      if (!id) return res.status(400).json({ success: false, error: "Post id required" });

      // Check current status so we only set published_at the first time a
      // post transitions into "published", not on every subsequent edit.
      const { rows: currentRows } = await pool.query(`SELECT status, published_at FROM blog_posts WHERE id = $1;`, [id]);
      if (currentRows.length === 0) {
        return res.status(404).json({ success: false, error: "Post not found" });
      }
      const wasPublished = currentRows[0].status === "published";
      const nowPublishing = status === "published" && !wasPublished;

      await pool.query(
        `UPDATE blog_posts SET
           title = COALESCE($1, title),
           excerpt = COALESCE($2, excerpt),
           content = COALESCE($3, content),
           category = COALESCE($4, category),
           cover_photo = COALESCE($5, cover_photo),
           related_service_slug = COALESCE($9, related_service_slug),
           status = COALESCE($6, status),
           updated_at = now(),
           published_at = CASE WHEN $7 THEN now() ELSE published_at END
         WHERE id = $8;`,
        [title, excerpt, content, category, coverPhoto, status, nowPublishing, id, relatedServiceSlug]
      );
      return res.status(200).json({ success: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.body as { id?: number };
      if (!id) return res.status(400).json({ success: false, error: "Post id required" });
      await pool.query(`DELETE FROM blog_posts WHERE id = $1;`, [id]);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: "Method not allowed" });
  } catch (err) {
    console.error("Admin blog posts error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
