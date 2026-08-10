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
  console.error("Postgres pool init error (seed-blog-posts-batch8):", err);
}

// 1 post: comprehensive handyman services catalog, requested directly
// rather than from fresh Semrush research this time. Checked against
// existing content first - deliberately distinct from
// "what-does-a-handyman-actually-do" (a conceptual explainer of scope/
// boundaries) and "hiring-a-handyman-in-london-guide" (the hiring/vetting
// process) - this one is an exhaustive, categorised list of every specific
// service type, cross-linking to nearly every handyman-related page built
// so far (furniture assembly, IKEA, TV mounting, gutter cleaning,
// extractor fans, UPVC doors, small jobs round-up).
const POSTS: {
  slug: string; title: string; excerpt: string; category: string; coverPhoto: string;
  relatedServiceSlug: string | null; publishDate: string; content: string;
}[] = [
  {
    "slug": "complete-list-of-handyman-services-london",
    "title": "Every Handyman Service in London: The Complete List",
    "excerpt": "A full, categorised walk-through of everything a professional handyman covers in London — from furniture assembly to gutter cleaning to the small electrical and plumbing jobs in between.",
    "category": "Handyman",
    "coverPhoto": "photo-1690473768476-44b5cebb7d80",
    "relatedServiceSlug": "handyman",
    "publishDate": "2026-09-18",
    "content": "\"Handyman\" is one of those words everyone understands loosely and almost nobody can define precisely. Ask five people what a handyman actually does and you'll get five different, overlapping answers — furniture assembly, hanging a picture, fixing a dripping tap, mounting a TV, none of them wrong, none of them the whole picture.\n\nThis is the complete list — every category of work a professional handyman service genuinely covers in London, organised so you can actually find what you're looking for rather than guess whether it counts.\n\n## Furniture Assembly & Flat-Pack\n\nThe single most requested handyman job, and for good reason — flat-pack furniture is everywhere, and building it properly takes longer and matters more than the instructions suggest.\n\n**What's covered**: wardrobes, chests of drawers, bed frames, bookcases, desks, TV units, shelving units, sofas, office furniture — any brand, not just one retailer.\n\n**[IKEA specifically](/services/ikea-installation)** gets its own mention because it's such a large share of this category — PAX wardrobes, BILLY bookcases, MALM and HEMNES ranges, METOD kitchens, and everything in between. A PAX wardrobe run with sliding doors is genuinely one of the more technical builds a handyman handles, needing careful levelling across multiple frames before the doors will run properly.\n\n**What separates a good build from an average one**: proper wall fixing on anything tall (a genuine safety matter, not a finishing touch), doors and drawers adjusted so they sit flush rather than just \"attached,\" and packaging taken away rather than left for you to deal with.\n\n## TV Mounting & Wall-Fixed Items\n\nAnything that needs to be securely fixed to a wall rather than simply placed — and the wall itself is the part that actually matters here, more than the item being mounted.\n\n**What's covered**: [TV wall mounting](/services/shelving-tv-mounting) (fixed, tilting, and full-motion brackets), floating shelves, mirrors, picture rails, curtain rails and blinds, coat hooks and storage racks, and generally anything where the fixing needs to hold real weight reliably.\n\nThe genuine skill here is reading the wall — London's mix of solid masonry, Victorian lath-and-plaster, and modern dot-and-dab plasterboard all need different fixings, and using the wrong one is the single most common reason something eventually comes away from the wall. A competent handyman finds the studs or solid fixing points before drilling, not after something's already sagging.\n\n## Gutter Cleaning & Exterior Maintenance\n\nEasy to forget entirely, since nobody looks up at their own guttering from the street — but [gutter cleaning](/services/gutter-cleaning) is one of the more consequential small jobs on this list, because a blocked gutter causes slow, expensive damage rather than an obvious, immediate problem.\n\n**What's covered**: clearing leaves and debris from gutters, checking downpipes are flowing freely, inspecting brackets and joints while access is already set up, and fitting gutter guards where they'd genuinely help.\n\nTwice a year is the general guidance for most properties — once after autumn leaf fall, once in spring — more often for properties under mature trees.\n\n## Minor Plumbing Repairs\n\nNot the emergency, burst-pipe kind of plumbing — the smaller, everyday faults that don't need a full plumbing call-out but genuinely need fixing.\n\n**What's covered**: dripping taps, running or slow-filling toilets, minor leaks under sinks, replacing tap washers and cartridges, unblocking slow-draining sinks and basins, fitting new taps, and general small plumbing fixtures.\n\nThe dividing line between \"handyman job\" and \"call a plumber\" is usually about scope rather than difficulty — a dripping tap or a toilet that won't stop filling is squarely handyman territory; anything involving the boiler, gas, or a genuine leak needing pipework opened up moves into dedicated plumbing work.\n\n## Minor Electrical Repairs\n\nSimilarly, the smaller end of electrical work — not rewiring or consumer unit work, which needs a qualified electrician specifically, but the everyday fixtures that come up constantly.\n\n**What's covered**: replacing light fittings and switches, fitting new sockets, [extractor fan repair and installation](/services/extractor-fan-repair-installation), replacing smoke and carbon monoxide alarm batteries or units, fitting outdoor lighting, and general small electrical fixtures.\n\nExtractor fans deserve a specific mention — a bathroom or kitchen fan that's stopped working, or was never properly ducted outside, is a genuinely common and often-overlooked contributor to condensation and mould, and fixing it is more valuable than it looks from the outside.\n\n## Painting & Decorating Touch-Ups\n\nNot a full repaint of a property — the smaller, targeted work that keeps a space looking cared for between bigger decorating jobs.\n\n**What's covered**: scuff and mark touch-ups, small patch repairs before painting, colour-matched touch-up painting, minor filling and sanding, and general small decorating jobs that don't justify booking a full decorating team.\n\nColour matching is the part that actually determines whether this is worth doing — a touch-up that doesn't genuinely match the surrounding paint is often more visible than the mark it was meant to cover, so a good handyman treats getting the match right as the actual job, not an afterthought.\n\n## Doors, Hinges & Adjustments\n\nA surprisingly large and surprisingly satisfying category — doors that stick, drag, won't close, or won't lock properly are rarely as serious as they feel, and are usually a straightforward adjustment rather than a replacement.\n\n**What's covered**: [UPVC door adjustment](/services/upvc-door-adjustment) (hinges and locking mechanisms settle over time and are designed to be re-adjusted), internal door hanging and adjustment, kitchen cabinet hinge adjustment, sticking or misaligned doors generally, and general hardware replacement — handles, hinges, locks.\n\nWorth knowing specifically: a UPVC door that's started dragging on the frame or is hard to lock almost always needs a hinge adjustment rather than a new door — genuinely one of the more common \"I thought this needed replacing\" surprises in this line of work.\n\n## Small Jobs & Odd Fixes\n\nThe genuinely broad category that doesn't fit neatly anywhere else, and the reason a good handyman service is worth having as an ongoing relationship rather than a one-off call.\n\n**What's covered**: [draught-proofing](/blog/small-jobs-round-up-shelves-picture-hanging-draught-proofing) around doors, windows, and loft hatches; floating shelf and picture installation; loft hatch insulation and loft ladder fitting; plasterboard crack repairs; skirting board and architrave fixes; childproofing fixtures; general assembly and installation of anything that arrives in a box.\n\nThis is also where the value of batching genuinely shows. None of these jobs individually justifies a dedicated visit — a loose door hinge, a shelf that's been waiting three months, a draughty letterbox — but a single visit working through a full list is meaningfully better value than several separate call-outs for the same total work.\n\n## What a Handyman Deliberately Won't Do\n\nWorth being direct about this, since it matters for setting expectations correctly. A reputable handyman service draws a clear line around certain categories, not because the work is beneath them, but because it genuinely needs different qualifications:\n\n- **Gas work** — always needs a Gas Safe registered engineer, no exceptions, for boiler work, gas appliance installation, or anything touching a gas supply\n- **Full electrical rewiring or consumer unit work** — needs a qualified electrician, distinct from the small fixture work covered above\n- **Structural work** — load-bearing walls, significant building alterations, anything affecting a property's structure\n- **Anything requiring building control sign-off** — extensions, structural changes, certain types of conversion work\n\nA handyman who says yes to all of this regardless is worth being cautious about — the honest answer, more often than people expect, is \"that's not us, here's who you actually need.\"\n\n## How to Get the Most Out of a Handyman Visit\n\nA few practical habits that make a real difference to value, regardless of which of the categories above you're booking for:\n\n**Keep a running list.** Almost every household accumulates small jobs over weeks and months — batching several into one visit is consistently better value than booking separately each time something comes up.\n\n**Be specific about what's needed.** \"Fix the shelf\" versus \"the bracket has come away from the wall and I think it needs re-fixing into a stud\" gets you a more accurate quote and a faster visit.\n\n**Ask what's included before booking.** Wall fixing, packaging removal, and materials are the three things most commonly assumed-included that sometimes aren't — worth confirming upfront rather than after.\n\n**Don't be embarrassed about a half-finished job.** Picking up where a DIY attempt went sideways is genuinely common, not unusual, and a reasonable handyman will simply carry on from where things are rather than make it awkward.\n\n## Who Actually Uses a Handyman Service\n\nWorth knowing this isn't just an individual-homeowner thing — a large share of handyman work in London comes from:\n\n- **Landlords and letting agents**, handling routine repairs and maintenance across rental properties, often with several jobs batched per property visit\n- **Housing associations**, for planned and reactive maintenance across larger portfolios\n- **People who've just moved**, with a genuinely large list of furniture assembly, fixing, and small jobs to get through before a property feels settled\n- **Anyone simply short on time** rather than short on ability — the honest, most common reason people call a handyman isn't that the job is impossible, it's that a free weekend to do it themselves genuinely isn't there\n\n## Roughly What This Costs\n\nNot a substitute for an actual quote, but a general sense of scale before you book: most handyman work in London is priced hourly (typically £35-60/hour, usually with a one-hour minimum) or as a half or full-day rate once you've got a genuine list rather than one small task. A single small job — a shelf, a tap washer, a light fitting — often falls within that one-hour minimum. A room's worth of furniture assembly after a move, or a longer list of small jobs, is usually better value as a half or full day booked in advance. We've covered this in more detail in our guide to [hiring a handyman in London](/blog/hiring-a-handyman-in-london-guide), including what's typically included versus quoted separately.\n\n## Quick Answers\n\n**Is there a job too small to book?** Not really, though a single very quick task (a picture hook, a tightened handle) may cost more per minute than it feels like it should, given the one-hour minimum most services charge. It's usually better value to hold off and add it to your next batch of jobs.\n\n**Can one visit cover several different categories from this list?** Yes — this is genuinely the point of a general handyman service rather than booking separate specialist trades for each item. A single visit assembling furniture, mounting a TV, and fixing a dripping tap is entirely normal.\n\n**What if I'm not sure whether something is \"handyman work\" or needs a specialist?** Ask before booking. A good service will tell you honestly if something needs a Gas Safe engineer, a qualified electrician, or a structural specialist instead of taking it on regardless.\n\n**Do I need to be home for the whole visit?** Generally yes, at least at the start and end, to confirm the job list and check the finished result — particularly for anything involving wall fixing or positioning decisions.\n\n## What We Cover\n\nAt [Tamesis Development Ltd](/), our [handyman service](/services/handyman) spans every category on this list — furniture assembly and IKEA installation, TV mounting and shelving, gutter cleaning, minor plumbing and electrical repairs, painting touch-ups, door adjustments, and general small jobs — handled by directly employed engineers rather than a subcontractor network, with a fixed price agreed before we start.\n\nIf you've got a list building up, or a single job that's been waiting too long, [get in touch](/contact) for a straightforward quote. We're happy to work through a full list in one visit, which is usually the most cost-effective way to get several things done at once."
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
    console.error("Seed blog posts batch 8 error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
