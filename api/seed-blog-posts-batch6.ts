import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

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
  console.error("Postgres pool init error (seed-blog-posts-batch6):", err);
}

// 1 post: condensation guide, grounded in Semrush data ("how to stop
// condensation in bedroom" 210/mo, "condensation on windows solutions"
// 70/mo). Deliberately scoped to condensation/ventilation advice and
// diagnosis, not broader damp compliance/regulatory content - Awaab's Law
// content was explicitly ruled out as outside what Tamesis offers.
const POSTS: {
  slug: string; title: string; excerpt: string; category: string; coverPhoto: string;
  relatedServiceSlug: string | null; publishDate: string; content: string;
}[] = [
  {
    "slug": "how-to-stop-condensation-in-your-home",
    "title": "How to Stop Condensation in Your Home (And When It's More Than a Ventilation Problem)",
    "excerpt": "Practical, room-by-room advice for reducing condensation on windows and walls — and how to tell when it's crossed into a damp problem worth calling a specialist for.",
    "category": "Handyman",
    "coverPhoto": "photo-1517646287270-a5a9ca602e5c",
    "relatedServiceSlug": "damp-mould",
    "publishDate": "2026-09-04",
    "content": "Condensation is the most common form of damp in UK homes, and also the most misunderstood. It's often written off as \"just condensation\" — something to wipe off the windowsill and forget about — right up until it's produced enough black mould on a wall or window frame that it's clearly become something more.\n\nHere's what actually causes it, what genuinely helps, and how to tell the difference between a ventilation habit worth changing and a problem worth calling someone about.\n\n## Why Condensation Happens\n\nThe mechanism itself is simple: warm air holds more moisture than cold air. When warm, moist air inside your home meets a cold surface — a window pane, an external wall, a cold spot behind furniture — it cools rapidly and can't hold onto that moisture anymore, so it deposits as liquid water. That's condensation.\n\nEvery home produces moisture constantly, more than people usually realise. Cooking, showering, drying laundry indoors, and even just breathing overnight all release water vapour into the air. In a well-ventilated home, that moisture escapes. In a home where it can't escape easily — often for genuinely sensible reasons, like keeping heating costs down by sealing up draughts — it accumulates and looks for the coldest surface to condense on.\n\nLondon's older housing stock makes this more common than it might be elsewhere. Victorian and Edwardian properties often have solid walls with no cavity, single-glazed or poorly sealed original windows in period conversions, and layouts where bathrooms and kitchens don't always have external walls for effective extraction. All of this adds up to more cold surfaces and less natural airflow than a modern, well-insulated new build.\n\n## Where It Shows Up, and Why\n\n**Windows**, especially in bedrooms overnight, are the classic case — glass is a poor insulator, so it's often the coldest surface in a room, and a closed bedroom door overnight traps the moisture from breathing with nowhere to go.\n\n**External walls**, particularly in corners and behind wardrobes or beds pushed against an external wall. These spots get less airflow, so the wall surface stays colder and moisture has less chance to disperse before it condenses.\n\n**Bathrooms and kitchens**, for the obvious reason that they produce the most moisture in the shortest bursts — a hot shower or a pan of boiling water raises humidity in the room dramatically and quickly.\n\n**Behind furniture and inside built-in wardrobes**, which is often the least visible and most surprising place people find it, since there's minimal airflow and the wall surface behind large furniture tends to stay cooler than an exposed wall.\n\n## What Actually Helps\n\n**Ventilate at the source, not just generally.** Extractor fans in bathrooms and kitchens exist specifically to remove moisture before it spreads to the rest of the home — using them during and for a while after cooking or showering matters more than people think, and it's worth checking yours is actually working effectively rather than just switched on.\n\n**Open a window, even briefly, after activities that produce moisture.** A few minutes of airflow after a shower or while cooking does more than people expect, even in cold weather — it's a genuine trade-off between heat loss and moisture control, but a short burst is usually worth it.\n\n**Dry laundry outside or in a ventilated space where possible.** Drying clothes on radiators indoors is one of the biggest contributors to indoor humidity, releasing a surprising volume of water vapour directly into living space with nowhere to go.\n\n**Leave a small gap between furniture and external walls.** A few centimetres is often enough to let air circulate behind a wardrobe or bed and stop that spot becoming a permanent cold, damp patch.\n\n**Keep a low, consistent background heat rather than heating rooms intensely then letting them go cold.** Consistent warmth keeps wall surfaces above the temperature where moisture condenses; a room that swings from cold to hot and back tends to produce more condensation than one kept steadily warm.\n\n**Wipe down windows and sills in the morning if condensation has formed overnight.** This doesn't solve the underlying cause, but it stops standing water sitting on a windowsill or frame for hours, which is exactly the condition mould needs to establish.\n\n## When It's Crossed Into a Bigger Problem\n\nOccasional condensation on a cold morning is normal in most homes and isn't a sign anything's wrong. It's worth taking more seriously when:\n\n- **Mould starts appearing**, particularly black mould on window frames, sealant, or wall surfaces — a sign moisture has been present long enough for it to establish, not a one-off.\n- **A musty smell develops** in a room, bathroom, or built-in storage, even without visible mould yet.\n- **The same spot keeps recurring** despite genuinely changing ventilation habits — wiping windows every morning for weeks without improvement suggests the underlying moisture level in the home needs addressing, not just the symptom.\n- **Wallpaper or paint starts peeling or bubbling**, which indicates moisture getting into the wall structure itself, not just condensing on the surface.\n- **It's affecting a wider area than one window** — condensation spreading across multiple rooms often points to a ventilation or heating issue across the whole property rather than one unlucky spot.\n\n## Condensation vs. Other Types of Damp\n\nWorth knowing the difference, since the fix is different for each. **Condensation damp** is caused by moisture in the air meeting a cold surface — it's what this article covers, and it's genuinely the most common type. **Rising damp** is caused by groundwater moving up through a wall from below, usually where a damp-proof course has failed or is missing, and tends to show as damage concentrated near floor level. **Penetrating damp** comes from water getting in from outside — a leaking gutter, a defective roof, failed pointing, or a crack in render — and shows wherever that entry point is, regardless of height.\n\nAll three can look broadly similar to an untrained eye — a damp patch is a damp patch — but treating condensation-driven damp with a course of ventilation changes won't fix a failed damp-proof course, and treating rising damp with a chemical injection won't help if the real cause is a family of four showering daily with no extraction. Getting the diagnosis right matters more than the treatment itself, which is really the case for proper professional assessment when it's not resolving on its own.\n\n## A Note on \"Lifestyle\" Damp\n\nIt's worth saying plainly: condensation is not simply a matter of a household not cleaning enough or living \"the wrong way.\" Every home produces moisture through completely normal daily life, and the amount a property can handle without a condensation problem comes down to its ventilation, insulation, and heating — factors that are substantially about the building, not just the people living in it. A period conversion with poor extraction and single-glazed windows will show condensation far more readily than a modern flat with the same household habits.\n\n## What We Offer\n\nIf ventilation changes haven't resolved a recurring condensation problem, or you're seeing mould that keeps coming back despite treating it, our [damp and mould service](/services/damp-mould) starts with proper diagnosis — identifying whether it's genuinely condensation, or whether rising or penetrating damp is involved — rather than assuming and treating the wrong cause. At [Tamesis Development Ltd](/), our directly employed engineers assess the property honestly, and we'll tell you if better ventilation habits are likely to solve it before recommending anything more involved.\n\nIf you'd like a proper assessment, [get in touch](/contact) — it's part of our wider [handyman and property maintenance work](/services/handyman) across London."
  }
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
    return res.status(500).json({ success: false, error: "Database not configured" });
  }

  try {
    await pool.query(`
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
    await pool.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS related_service_slug TEXT;`);

    let inserted = 0;
    for (const post of POSTS) {
      const { rows: existing } = await pool.query(`SELECT id FROM blog_posts WHERE slug = $1;`, [post.slug]);
      if (existing.length > 0) continue;
      await pool.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, category, cover_photo, related_service_slug, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'published', $8::date);`,
        [post.slug, post.title, post.excerpt, post.content, post.category, post.coverPhoto, post.relatedServiceSlug, post.publishDate]
      );
      inserted++;
    }

    return res.status(200).json({ success: true, inserted, skipped: POSTS.length - inserted });
  } catch (err) {
    console.error("Seed blog posts batch 6 error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
