import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Pool } from "pg";
import { createHmac, timingSafeEqual } from "crypto";

// One-time (but safe to re-run — checks slugs first) seeder for the 3
// starter blog posts. See api/admin-login.ts for why auth/connection logic
// is duplicated across api/ functions instead of shared.

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
  console.error("Postgres pool init error (seed-blog-posts):", err);
}

const POSTS = [
  {
    slug: "signs-you-need-an-emergency-plumber-in-london",
    title: "5 Signs You Need an Emergency Plumber in London (And When It Can Wait)",
    excerpt:
      "Not every plumbing problem is a genuine emergency — but some can't wait until morning. Here's how to tell the difference, and what to do next.",
    category: "Emergency & Repairs",
    coverPhoto: "photo-1669920282730-ab422e592f97",
    content: `A dripping tap is annoying. A burst pipe flooding your kitchen at 11pm is a different problem entirely. Knowing which is which — and acting accordingly — can be the difference between a quick fix and a much bigger repair bill.

## 1. Water You Can't Stop

If water is actively flooding a room and you can't stop it by turning off the isolation valve under the sink or the stopcock at the mains, that's a genuine emergency. Every extra hour of standing water raises the risk of damage to flooring, plasterboard, and anything electrical nearby. Don't wait — this is exactly what our [emergency callout service](/emergency) exists for.

## 2. No Heating or Hot Water in Winter

A cold shower is uncomfortable. No heating at all during a cold snap — particularly for elderly residents, young children, or anyone with health conditions — is a genuine safety concern, not just an inconvenience. If your boiler has completely stopped and it's genuinely cold outside, this counts as urgent.

## 3. A Smell of Gas

If you smell gas, this isn't a "book an appointment" situation. Turn off the gas supply at the meter if it's safe to do so, open windows, don't use any electrical switches or naked flames, and leave the property. Then call the National Gas Emergency Service on 0800 111 999, in addition to arranging a Gas Safe registered engineer to inspect once it's safe.

## 4. A Blocked Drain That's Backing Up

A slow-draining sink can usually wait for a scheduled visit. A drain that's backing up — water coming back up through a different fixture, or sewage smells inside the property — is a different matter, both for hygiene and for potential damage. Our [drain unblocking](/services/drain-unblocking) team treats backed-up drainage as a priority job.

## 5. A Leak You Can't Locate

Sometimes the problem isn't obvious — a damp patch on a ceiling, a musty smell, an unexplained rise in your water bill. These can point to a hidden leak inside a wall or under a floor, which tends to get worse (and more expensive to repair) the longer it goes unaddressed. Our [leak detection service](/services/leak-detection) uses proper diagnostic equipment to find the source without unnecessary damage to your property, rather than guessing and opening up walls unnecessarily.

## When It Can Actually Wait

Not everything needs a same-day callout. A slightly dripping tap, a toilet that runs a bit longer than it should, or a radiator that's cooler at the bottom than the top are all real issues worth fixing — but they're not emergencies. For these, a scheduled visit through our [report a repair](/report-repair) form is the more sensible, usually cheaper route, and you can pick a time that suits you.

## Our Advice: When in Doubt, Call

If you're genuinely not sure which category your problem falls into, it's always worth a quick call rather than guessing. We'd rather talk you through it and confirm it can wait than have you sit with a worsening problem overnight. We cover [most of London](/coverage), with directly employed engineers — not a network of subcontractors — so response times stay consistent no matter which borough you're in.

Whatever the issue, if you'd rather just get a straightforward quote for non-urgent work, [request a free quote](/quote) and we'll come back to you with a clear answer, usually within one working day.`,
  },
  {
    slug: "why-planned-maintenance-contracts-save-housing-associations-money",
    title: "Why Planned Maintenance Contracts Save Housing Associations Money in the Long Run",
    excerpt:
      "Reactive repairs feel cheaper in the moment. Over a full year of stock, planned maintenance almost always works out less expensive — here's why.",
    category: "Housing Associations & Planned Maintenance",
    coverPhoto: "photo-1516216628859-9bccecab13ca",
    content: `Every housing association eventually faces the same question: is it better to fix things as they break, or to plan the work in advance? The honest answer is that a purely reactive approach almost always costs more over time — it just doesn't always look that way on a month-by-month budget.

## The Hidden Cost of "Wait Until It Breaks"

A reactive repair almost always costs more than the same job done as planned maintenance, for a few consistent reasons: emergency callout rates, the knock-on damage that happens while a problem goes unnoticed (a small roof leak becomes a ceiling replacement), and the disruption of an unplanned visit compared to a scheduled one that residents were told about in advance.

Multiply that across hundreds or thousands of units, and the difference between a reactive-only approach and a proper [planned maintenance](/services/planned-maintenance) programme becomes a genuinely large number over a financial year — not just a theoretical one.

## Compliance Is Easier to Demonstrate

Housing associations answer to regulators, boards, and residents. A documented planned maintenance schedule — with records of what was inspected, when, and what was done — is far easier to produce as evidence of a well-run asset management function than a pile of one-off invoices from reactive jobs. When something does go wrong despite a proper maintenance schedule, having that paper trail matters.

## Void Turnaround Times Improve

Planned maintenance and [void property refurbishment](/services/void-refurbishment) are closely linked. Properties that have been properly maintained throughout a tenancy typically need less work to bring back to a lettable standard when they become vacant, which means shorter void periods and less lost rent — a direct financial benefit that's easy to overlook when planned maintenance is budgeted as a pure cost line rather than as something that protects income elsewhere.

## One Contractor, Consistent Standards

A common frustration we hear from asset managers is inconsistency — different contractors, different standards, different reporting formats, making it hard to get a clear picture of the condition of the stock as a whole. Working with a single contractor across both planned and responsive work — the same directly employed engineers, the same reporting standard — removes that inconsistency. It's one of the reasons we work the way we do: not a loose network of subcontractors, but our own teams, accountable to the same standard whether it's a single reported repair or a five-year planned programme.

## What Good Planned Maintenance Actually Looks Like

In practice, a proper planned maintenance contract means: a documented inspection schedule appropriate to the age and type of stock, clear reporting after every visit (not just "job done"), a genuine point of contact rather than a call centre, and pricing agreed upfront rather than negotiated job by job. We work this way for [housing associations](/sectors/housing-associations) and [local authorities](/sectors/local-authorities) across London, and the same standard applies whether it's ten units or ten thousand.

## Getting Started

If you're currently managing stock reactively and want to understand what a planned approach would actually cost and deliver, [get in touch](/contact) and we'll talk through your portfolio specifically — no generic sales pitch, just a straightforward conversation about what would genuinely help. You can also read more about [who we are and how we work](/about) if you'd like the fuller picture before that first call.`,
  },
  {
    slug: "how-to-plan-a-bathroom-refurbishment",
    title: "How to Plan a Bathroom Refurbishment: A Step-by-Step Guide for London Homeowners",
    excerpt:
      "A bathroom refurbishment is one of the most disruptive jobs to get wrong and one of the most satisfying to get right. Here's how to plan it properly.",
    category: "Home Improvement",
    coverPhoto: "photo-1620626011761-996317b8d101",
    content: `A bathroom is one of the smallest rooms in most London homes, but refurbishing one properly touches almost every trade — plumbing, electrics, tiling, carpentry, sometimes structural work if you're moving anything. Getting the planning right up front makes a real difference to how smoothly it goes.

## Start With What's Actually Wrong

Before thinking about tile colours, it's worth being honest about what's actually driving the refurbishment. Is it purely cosmetic — dated tiles, an old suite that still works fine? Or is there an underlying problem — poor water pressure, a leak, damp, inadequate ventilation? A [bathroom refurbishment](/services/bathroom-refurbishment) that only addresses the cosmetic layer while leaving an underlying damp or ventilation issue in place tends to look tired again within a couple of years.

## Decide: Refresh, Refit, or Reconfigure

Broadly, most bathroom projects fall into one of three categories:

- **A refresh** — new tiles, a repainted ceiling, updated fittings, keeping the existing layout and suite. Fastest and least disruptive.
- **A full refit** — new suite, new tiling, same basic layout (bath where the bath was, toilet where the toilet was). This is where most [bathroom installation](/services/bathroom-installation) work sits.
- **A reconfiguration** — moving the toilet, converting a bath to a walk-in shower, sometimes borrowing space from an adjacent room. This is the most involved option, since it usually means moving waste pipes and can involve building control depending on what's changing.

Being clear on which of these you actually want before getting quotes will make the quotes far more comparable — a refresh quote and a full reconfiguration quote aren't the same job, even if both get called "bathroom refurbishment."

## Get the Waterproofing Right — It's Not Optional

Tanking (waterproofing the walls and floor before tiling) is the single most important part of a bathroom refurbishment that nobody sees once it's finished — and the most expensive thing to fix later if it's skipped or done poorly. If a quote seems unusually low compared to others, it's worth asking specifically what waterproofing is included before assuming it's simply a good price.

## Think About Ventilation Early, Not at the End

Extractor fan specification and ducting routes are much easier to sort out before tiling starts than after. A bathroom without adequate ventilation will develop condensation and eventually mould, regardless of how good the tiling and fittings are — this is worth raising with whoever's doing the work at the planning stage, not as an afterthought.

## Sequencing Matters More Than People Expect

A well-run bathroom job generally follows: strip-out, first-fix plumbing and electrics, waterproofing, [tiling](/services/tiling), second-fix (fitting the actual suite, taps, and shower), then finishing (sealant, painting, extractor commissioning). Jobs that go wrong are very often ones where this order gets compressed to save time — tiling started before waterproofing has properly cured, for instance.

## How Long Should It Actually Take

For context: a straightforward refresh might take 3-5 days. A full refit is typically 1-2 weeks. A reconfiguration involving moved plumbing can run 2-3 weeks or more, depending on whether any structural work or building control sign-off is needed. Anyone promising a full reconfiguration in a couple of days is either not doing the waterproofing properly or not being straightforward about the real timeline.

## Getting a Quote That's Actually Comparable

When comparing quotes, make sure each one covers the same scope — same category (refresh/refit/reconfiguration), same fittings specification, and confirmation that waterproofing and ventilation are included rather than assumed. [Request a free quote](/quote) from our team and we'll talk you through exactly what's included before any work begins, and you're welcome to browse [some of our recent bathroom projects](/projects) for a sense of the standard of finish.`,
  },
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

    let inserted = 0;
    for (const post of POSTS) {
      const { rows: existing } = await pool.query(`SELECT id FROM blog_posts WHERE slug = $1;`, [post.slug]);
      if (existing.length > 0) continue;
      await pool.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, category, cover_photo, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, 'published', now());`,
        [post.slug, post.title, post.excerpt, post.content, post.category, post.coverPhoto]
      );
      inserted++;
    }

    return res.status(200).json({ success: true, inserted, skipped: POSTS.length - inserted });
  } catch (err) {
    console.error("Seed blog posts error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
