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
  console.error("Postgres pool init error (seed-blog-posts-batch4):", err);
}

// 1 post: a comprehensive "ikea assembly service" buyer's guide, distinct
// from the batch-3 IKEA posts (cost guide, PAX-specific, returns policy,
// wall fixing, common mistakes) - this one covers choosing/vetting a
// service, what's included, product-category breakdown, and booking
// logistics. Links "ikea assembly service" as anchor text once to home (/)
// and once to /services/ikea-installation, as requested.
const POSTS: {
  slug: string; title: string; excerpt: string; category: string; coverPhoto: string;
  relatedServiceSlug: string | null; publishDate: string; content: string;
}[] = [
  {
    "slug": "ikea-assembly-service-what-to-expect",
    "title": "IKEA Assembly Service: What to Expect, What to Ask, and How to Choose One",
    "excerpt": "A complete buyer's guide to hiring an IKEA assembly service in London — what's actually included, how to vet one properly, and what a good visit looks like from booking to finish.",
    "category": "Handyman",
    "coverPhoto": "photo-1772338537689-056082f100a9",
    "relatedServiceSlug": "ikea-installation",
    "publishDate": "2026-08-14",
    "content": "Somewhere between \"I'll build it myself this weekend\" and \"I've been staring at eleven bags of screws for two hours,\" most people arrive at the same question: is it actually worth paying someone to do this? And if it is, what does that even look like — who turns up, what do they do, and how do you tell a good service from a bad one before you've handed over your address and a delivery date?\n\nThis is a genuinely practical guide to hiring an [ikea assembly service](/), written from the perspective of someone who's never used one before and wants to know what they're actually signing up for.\n\n## What an IKEA Assembly Service Actually Is\n\nStrip away the marketing language and it's straightforward: a tradesperson, or a small team, who comes to your home, builds the flat-pack furniture you've bought, secures it where needed, and takes the packaging away. That's the core of it.\n\nWhere services genuinely differ is in the details around that core — what's included as standard, what counts as an extra, how they price the work, and how they handle the parts of the job that aren't glamorous but matter enormously: wall fixing, levelling, packaging disposal, and what happens if something's wrong with the furniture itself rather than the assembly.\n\nIt's worth being clear that this is a distinct thing from IKEA's own in-house options. IKEA offers its own delivery and assembly add-ons at checkout for some products, and separately partners with third-party platforms for on-demand assembly. Independent handyman and property maintenance companies — like the one behind this article — are a separate route entirely: not affiliated with IKEA, but often more flexible on scheduling, better placed to combine an IKEA job with other jobs in the same visit, and, in our experience, more consistent on things like wall-fixing as standard rather than an upsell.\n\n## What's Typically Included — and What Often Isn't\n\nThis is the single most useful thing to understand before booking anything, because it's where most disappointment comes from — not bad workmanship, but a mismatch between what someone assumed was included and what actually was.\n\n**Usually included as standard:**\n- Assembly of the item(s) according to the manufacturer's instructions\n- Basic tools and consumables (the right screwdriver bits, spirit level, and so on)\n- Positioning the finished item in the room\n\n**Varies significantly by provider, so always ask directly:**\n- **Wall fixing.** Tall furniture — wardrobes, bookcases, chests of drawers — should be secured to the wall to prevent tipping. Some services include this as standard; others treat it as an add-on, or worse, skip it entirely unless specifically asked. This is genuinely a safety matter, not just a finishing touch, and it's worth treating any provider who's vague about it as a warning sign.\n- **Packaging removal.** A single PAX wardrobe can generate a startling volume of cardboard. Some services take it all away; others leave it for you to deal with, which is a reasonable thing to know in advance rather than discover afterward.\n- **Old furniture removal.** If you're replacing something, ask specifically whether the old piece is taken away, and whether that's charged separately.\n- **Multiple-item discounts.** If you've got several pieces arriving, ask whether pricing improves per item — it very often does, since the travel and setup cost is paid once regardless of how many items are built.\n\n## How Pricing Actually Works\n\nMost services price one of three ways: an hourly rate (often with a one-hour minimum), a fixed price per item for predictable products, or a half/full-day rate for larger jobs. None of these is inherently better — the right one depends on what you're having built. A single bookcase suits hourly or fixed pricing; a room's worth of furniture after a move is usually better value as a day rate.\n\nThe honest range for London in 2026 sits roughly between £35-60 per hour for handyman-type assembly work, with a single item like a chest of drawers typically £50-90 all in, and a full PAX wardrobe run anywhere from £120-300+ depending on how many frames and how complex the interior fittings and doors are. If a quote comes in dramatically below that range, it's worth asking what's not included, since the gap usually shows up somewhere.\n\n## How to Actually Vet a Service Before Booking\n\nA few direct questions tell you more than a star rating ever will:\n\n**\"Is wall fixing included?\"** The single most useful question you can ask, for the safety reason above.\n\n**\"Is your team directly employed, or subcontracted for the day?\"** Not a judgement on subcontractors, who can absolutely do good work — but a directly employed team tends to mean more consistent standards and clearer accountability if something's wrong afterward, since they're answerable to the same company you originally booked.\n\n**\"Can I get a fixed price before you start?\"** For anything beyond a single small item, a provider who won't commit to a number in writing is worth being cautious about.\n\n**\"What happens if something's missing from the flat-pack, not from your side?\"** A good provider will tell you honestly that this is between you and the retailer's spare parts service, rather than either overpromising a fix or leaving you stuck.\n\n**\"Are you insured?\"** For anyone drilling into your walls, a completely reasonable thing to ask, and a confident provider won't hesitate to answer.\n\n**Read a handful of actual reviews, not just the star average.** A 4.8 average from twelve reviews tells you far less than a 4.5 average from five hundred. Look specifically for mentions of punctuality, communication if something ran long, and whether wall fixing was actually done — these details tell you more about how a company really operates than the headline number.\n\n## What a Good Booking Process Looks Like\n\n**Before the visit**, a good service will ask what's actually being built — not just \"IKEA furniture\" but which items, roughly how many boxes, and whether there's anything unusual about access (stairs, a narrow doorway, a lift that's out of service). This isn't box-ticking; it genuinely affects how long the job takes and what tools might be needed.\n\n**On arrival**, expect a quick walkthrough of what's being built and where it's going, particularly if the list has grown or changed since booking. A good tradesperson confirms this rather than assuming the original message covers everything.\n\n**During the build**, if something's missing or damaged from the factory, a good provider tells you immediately rather than working around it quietly — this affects whether the job can be finished that day and what your options are with the retailer's spare parts service.\n\n**At the end**, the visit isn't really finished until wall fixing is done (where relevant), doors and drawers have been checked and adjusted so they sit properly, and packaging has been dealt with according to what was agreed. A rushed finish that skips the fiddly last ten percent — door alignment, drawer adjustment — is the difference between furniture that looks assembled and furniture that looks built-in.\n\n## Which Items Genuinely Benefit From a Professional, and Which Don't\n\nBeing honest about this, since it's more useful than pretending every item needs help: a KALLAX shelving unit, a LACK table, or a single small bookcase is a perfectly reasonable job for most people on a free afternoon, and there's no need to pay for that.\n\nWhere a professional service earns its cost:\n\n- **Multi-frame PAX runs**, where frames need to be level with each other as well as individually, and sliding doors in particular are unforgiving of small errors\n- **Kitchen units (METOD)**, which involve levelling, wall fixing, and coordination with worktops, plumbing, and electrics\n- **Anything needing secure wall fixing** where you're not confident what's behind your walls — a real consideration in London, where Victorian lath-and-plaster, plasterboard-on-dabs, and solid masonry all show up depending on the property\n- **A full room or house's worth of furniture after a move**, where the value isn't really the assembly skill, it's the time compression — a day of proper work instead of three exhausted weekends\n- **Anything you've already started and it's gone wrong**, which is more common than people admit and nothing to be embarrassed about\n\n## What This Looks Like Across Different Product Categories\n\n\"IKEA furniture\" covers a huge range of genuinely different assembly jobs, and it's worth understanding roughly where yours sits before you book.\n\n**Storage — BILLY, KALLAX, PAX.** The most commonly assembled category, and the one with the widest range of difficulty. BILLY and KALLAX are quick, forgiving builds well within reach of most people. PAX is a different proposition entirely — a modular system rather than a single product, where multiple frames need to be individually and mutually level, interior fittings are ordered separately from the frame, and door alignment (particularly sliding doors) is genuinely fiddly to get right. If your job is a PAX run of more than one frame, this is where professional assembly earns its keep most clearly.\n\n**Bedroom — MALM, HEMNES, bed frames.** Chests of drawers reward patience with runner alignment; a few millimetres of difference between the two sides produces a drawer that never quite closes flush. Bed frames are usually straightforward, though larger sizes with integrated storage drawers take longer than the box suggests, and are genuinely easier with two people.\n\n**Kitchens — METOD.** In a different category altogether from furniture assembly. A METOD kitchen involves setting a level baseline for the whole run, fixing cabinets securely to the wall, and coordinating with worktops, plumbing, and electrics — appliance housings need accurate spacing, and plinth and trim work at the end is what makes the finished result look properly fitted rather than assembled. This is a job that benefits from professional installation essentially without exception.\n\n**Sofas and upholstered items.** Increasingly common as flat-pack, and the assembly itself is usually simple — the main risk is cosmetic damage to fabric or frame if it's rushed or forced, so patience matters more than skill here.\n\n**Office and desks.** Generally straightforward, though cable management and desk height relative to how it'll actually be used are worth thinking about at the assembly stage rather than adjusting afterward.\n\n## Timing: When to Book Relative to Delivery\n\nA detail that's easy to overlook: booking assembly for the same day as delivery sounds efficient, but it only works if delivery is genuinely reliable, since a late or partial delivery leaves the assembly slot wasted. For anything time-sensitive — moving day, a nursery being prepared for a specific date — it's generally safer to book assembly for a day or two after the expected delivery window, giving a buffer in case delivery slips or the order arrives incomplete.\n\nIf you're coordinating multiple items from different orders, it's worth confirming everything has actually arrived before the assembly visit, rather than assuming a delivery date on a confirmation email is guaranteed. A quick check the day before saves an awkward conversation on the day itself if something hasn't turned up.\n\n## What to Prepare Before They Arrive\n\nA little preparation makes the visit faster and reduces the chance of surprises:\n\n- **Clear the room** where furniture is being built, particularly for anything assembled flat on the floor before standing upright — a wardrobe frame needs more floor space than the finished piece occupies\n- **Check delivery has actually arrived and is complete**, ideally the day before rather than the morning of, so a missing box doesn't derail the whole visit\n- **Know where you want things positioned**, especially if it affects wall fixing points\n- **Clear a path from the door**, particularly for larger boxes going up stairs or through tight hallways\n- **Flag anything unusual about the property** in advance — old wiring, a recent renovation, anything that might affect what's behind a wall you need something fixed to\n\n## What Happens if Something's Wrong Afterward\n\nWorth asking about before you need to know: what's the process if a drawer starts sticking a week later, or a door needs re-aligning? A reputable service will stand behind their own workmanship, distinct from a factory fault in the furniture itself, which is a matter for the retailer rather than the assembler. Getting a clear answer to this upfront — even informally — is a reasonable thing to expect before booking.\n\n## A Note on IKEA's Own Returns Policy\n\nIf you're weighing up assembly against the possibility you might return the item, it's worth knowing that IKEA generally accepts returns of assembled furniture in the UK, provided it's in good, resellable condition — assembly damage like stripped fixings or forced-apart panels is the main thing that closes off that option, which is one more reason properly done assembly matters even if you're not certain you'll keep the piece. We've covered this in detail in our guide to [returning assembled IKEA furniture](/blog/can-you-return-assembled-ikea-furniture).\n\n## Quick Answers to Common Questions\n\n**Do I need to be home during assembly?** Generally yes, at least at the start and end — someone needs to let the team in, confirm the item list, and check the finished result before they leave, particularly regarding positioning and wall-fixing points.\n\n**Can assembly happen before delivery?** No — the boxes need to be on site. Some services will hold a provisional slot, but it's genuinely worth confirming delivery first rather than risking a wasted visit.\n\n**What if I only have one small item?** Most services are happy to take on a single item, though be aware of the one-hour minimum that's standard on hourly pricing — for one small, simple item, it's worth honestly asking yourself whether it's worth the minimum charge versus a DIY afternoon.\n\n**Do they bring their own tools?** Yes, a professional service supplies everything needed, including the correct fixings for wall mounting where your walls need something other than what's supplied in the box.\n\n**What if I've changed my mind about where something goes, mid-build?** Reasonable to raise it — most trades would rather adjust early than finish something in the wrong spot, though it's worth deciding on positioning before the visit where possible, since re-positioning a partially built item takes longer than starting in the right place.\n\n## The Honest Summary\n\nAn IKEA assembly service is, at its best, a straightforward trade: your time and weekend for a fixed, known cost, done by someone who's built hundreds of these and won't be caught out by the fiddly bits. At its worst, it's an unclear price, wall fixing quietly skipped, and packaging left for you to sort out.\n\nThe difference between the two isn't luck, it's a handful of direct questions asked before you book: what's included, whether the price is fixed, whether wall fixing is standard, and whether the team is directly employed. Ask those, and you'll know within a few minutes of the conversation which kind of service you're dealing with.\n\n## What We Offer\n\nAt Tamesis Development Ltd, our [ikea assembly service](/services/ikea-installation) is built around the standards above as a baseline, not an upsell: wall fixing included as standard on every tall item, a fixed price confirmed before we start, packaging taken away, and directly employed engineers rather than a subcontractor network. We cover everything from a single BILLY bookcase to a full PAX wardrobe run or METOD kitchen, and we're equally happy to finish a build someone else has started.\n\nIf you've got flat-pack waiting — or already half-built and not cooperating — [get in touch](/contact) for a straightforward quote. Our IKEA work sits within our wider [handyman service](/services/handyman) across London, alongside [furniture assembly for any other brand](/services/furniture-assembly).\n\n*Tamesis Development Ltd is an independent handyman service and is not affiliated with or endorsed by IKEA.*"
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
    console.error("Seed blog posts batch 4 error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
