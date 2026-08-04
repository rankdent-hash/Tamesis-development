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
  console.error("Postgres pool init error (seed-blog-posts-batch7):", err);
}

// 3 posts consolidating 25 low-keyword-difficulty long-tail terms found via
// Semrush (KD mostly 0-21) into themed round-ups, following the same
// successful pattern as the earlier Small Jobs Round-Up post - individually
// low volume, but genuinely low competition, and consolidating related
// terms into one comprehensive piece each avoids creating dozens of thin
// pages. Covers: radiator/heating problems, flooring/worktop/loft/general
// repairs, and small bathroom/garden fixes. The two standout terms with
// real individual volume (bathroom extractor fan not working + extractor
// fan installation cost, upvc door adjustment) got dedicated landing pages
// instead - see ExtractorFanRepair.tsx and UpvcDoorAdjustment.tsx.
const POSTS: {
  slug: string; title: string; excerpt: string; category: string; coverPhoto: string;
  relatedServiceSlug: string | null; publishDate: string; content: string;
}[] = [
  {
    "slug": "common-radiator-problems-london-homes",
    "title": "Common Radiator Problems in London Homes (And How to Tell Which You've Got)",
    "excerpt": "Cold radiators, leaking valves, and stiff stopcocks — the most common heating problems in London properties, what causes each one, and when to call a plumber.",
    "category": "Plumbing",
    "coverPhoto": "photo-1749532125405-70950966b0e5",
    "relatedServiceSlug": "plumbing",
    "publishDate": "2026-09-08",
    "content": "Radiators are one of those things nobody thinks about until one stops working properly, and then it becomes the only thing you think about — particularly if it happens in the middle of a cold snap. Most radiator problems fall into a small number of genuinely common categories, and knowing which one you've got is most of the way to knowing whether it's a five-minute fix or something worth calling a plumber for.\n\n## Radiator Cold at the Top, Warm at the Bottom\n\nAlmost always trapped air. As a heating system runs, small amounts of air can work their way into the radiators, and because air rises, it collects at the top of the radiator and blocks hot water from reaching that section — leaving the top cold while the bottom stays warm.\n\n**The fix**: bleeding the radiator, using a radiator key to briefly open the small valve at the top and release the trapped air until water starts to come through. This is a genuinely reasonable DIY job for most people — the key is inexpensive, the process takes a couple of minutes per radiator, and it's worth doing to all radiators in a property at the start of each heating season as routine maintenance, not just when a problem's already obvious.\n\nWorth knowing: if you're bleeding radiators repeatedly, every few weeks, that points to a different problem — air getting into the system faster than it should, often from a failing expansion vessel or a leak somewhere allowing air in. That's worth a proper look rather than continuing to bleed radiators as a permanent workaround.\n\n## Radiator Cold at the Bottom, Warm at the Top\n\nThe opposite pattern, and a different cause: usually sludge or debris that's settled at the bottom of the radiator over time, restricting water flow through that section. This is more common in older systems that haven't been power-flushed in a long time, or in properties with a mix of old and newer radiators where corrosion products have built up.\n\n**The fix**: a power flush, which clears the accumulated sludge from the whole heating system rather than just one radiator — a bigger job than bleeding, and one that's genuinely worth a professional doing given the equipment involved.\n\n## Leaking Radiator Valve\n\nA valve that's dripping, whether it's the manual valve on one side or the thermostatic radiator valve (TRV) on the other, is one of the most common radiator call-outs. Often it's a worn valve seal or spindle, which develops a slow drip that gets gradually worse rather than appearing suddenly.\n\n**Why this matters more than it might seem**: a slow drip from a radiator valve, left unaddressed, can cause real damage over time — staining to flooring, damage to skirting boards, and in ground-floor or upper-floor properties, potential damage to whatever's below. It's a small leak with a genuinely disproportionate potential cost if ignored.\n\n**The fix**: usually a straightforward valve repair or replacement, though this involves isolating that radiator (or the whole system, depending on the valve type) and dealing with the small amount of water in the pipework — not something to attempt without knowing what you're doing, since getting it wrong can mean draining more of the system than necessary.\n\n## Thermostatic Radiator Valve (TRV) Not Working\n\nTRVs let you control the temperature of individual rooms, and a common complaint is a radiator that either doesn't respond to the TRV setting at all, or is stuck fully on or fully off regardless of the dial.\n\n**Common cause**: the pin inside the valve body can seize, particularly if the TRV has been left in the same position for a long time (over summer, for instance, when heating isn't used). A seized pin means the valve can't open or close properly even though the dial turns.\n\n**The fix**: sometimes a seized pin can be freed with careful manipulation, but a genuinely stuck or worn TRV is usually more reliably fixed with a straightforward valve replacement — modern TRVs aren't expensive, and replacement is often more reliable than repeatedly trying to free an old one.\n\n## Stopcock Won't Turn, or Is Stiff\n\nThe stopcock — the main valve controlling water supply into the property, usually found under the kitchen sink or near where the water main enters the building — is one of those things nobody touches for years and then desperately needs to turn quickly during an emergency, only to find it's seized.\n\n**Why this happens**: stopcocks that are never used can seize through disuse, mineral deposits, or simple age. A stiff or non-functioning stopcock is a genuine problem specifically because it matters most in an emergency — a burst pipe is exactly the moment you need the stopcock to work, and exactly the wrong moment to discover it doesn't.\n\n**The fix**: sometimes a stiff stopcock can be freed carefully, but a stopcock that won't turn at all, or that's leaking around the spindle, is worth having replaced before it's needed in an emergency rather than after. This is genuinely one of those \"check it now, not during a crisis\" maintenance items — testing your stopcock once or twice a year, just turning it off and back on, keeps it functional and tells you early if it needs attention.\n\n## When It's More Than a Single Radiator\n\nIf you're seeing several of these issues at once — multiple radiators needing frequent bleeding, uneven heating across a property, a system that takes a long time to warm up — this often points to a system-wide issue rather than several unrelated small faults: sludge build-up throughout the system, a failing pump, or an aging system generally struggling to circulate water efficiently. Worth a proper assessment rather than treating each radiator as a separate, unconnected problem.\n\n## Should You Ever Bleed a Radiator Yourself?\n\nWorth being direct about this, since it's the one job on this list most people can genuinely do themselves: yes, bleeding a radiator is safe and straightforward for most people, using a standard radiator key available cheaply from any hardware shop. Turn the heating off first, hold a cloth beneath the valve to catch any drips, open the valve slowly with the key until you hear a hiss of escaping air, and close it the moment water starts to appear rather than after. It's one of the few genuinely low-risk plumbing tasks worth doing yourself rather than calling someone out for. Testing this once at the start of each heating season, alongside your radiators, catches most heating problems before they become winter emergencies. It costs nothing but a few minutes and can save a genuinely inconvenient emergency call later.\n\n## A Note for Landlords\n\nRadiator and heating issues are among the most common tenant-reported repairs, and under Section 11 of the Landlord and Tenant Act 1985, the heating installation is explicitly one of the things landlords are legally required to keep in proper working order. A cold radiator reported in winter warrants a prompt response — we've covered landlord repair obligations in more detail in our guide to [landlord repair responsibilities](/blog/landlord-repair-responsibilities-guide-london).\n\n## What We Offer\n\nAt [Tamesis Development Ltd](/), radiator and heating repairs are a routine part of our [plumbing and drainage service](/services/plumbing) — valve repairs and replacements, power flushing, stopcock replacement, and general heating system troubleshooting, handled by directly employed engineers with a fixed price agreed before we start.\n\nIf you've got a radiator that's not behaving, or a stopcock you're not confident would work in an emergency, [get in touch](/contact) for a straightforward quote."
  },
  {
    "slug": "flooring-worktop-loft-general-repairs-guide",
    "title": "Flooring, Worktop, Loft & General Repairs: A London Homeowner's Guide",
    "excerpt": "Gaps in wooden floors, chipped worktops, loft hatches, and hairline cracks — the small repairs that pile up around every home, and which ones are worth doing yourself.",
    "category": "Handyman",
    "coverPhoto": "photo-1690473768476-44b5cebb7d80",
    "relatedServiceSlug": "flooring-repairs",
    "publishDate": "2026-09-11",
    "content": "Every property develops a handful of small, specific faults over time — a gap opening up between floorboards, a chip in the worktop from years of use, a loft hatch that's never been properly insulated. None of them are urgent, which is exactly why they tend to sit unaddressed for months or years. Here's what's actually going on with the most common ones, and what genuinely needs a professional versus what you can reasonably tackle yourself.\n\n## Gaps Appearing Between Wooden Floorboards\n\nWood is a natural material that expands and contracts with humidity and temperature — genuinely normal, and in older properties with original floorboards, some gap is expected rather than a fault. Gaps tend to be more noticeable in winter, when heating dries the air and the wood contracts slightly.\n\n**When it's worth addressing**: if gaps are wide enough to cause draughts (a real issue in older properties with suspended timber floors and an unheated void beneath), or if they're becoming a genuine trip hazard or catching heels and furniture legs.\n\n**The fix** depends on the gap size. Narrow, consistent gaps can often be filled with a flexible wood filler or specialist gap-filling rope designed to move with the timber. Wider or inconsistent gaps sometimes indicate the boards themselves need attention — refitting or, in more significant cases, partial replacement.\n\n## Laminate or Engineered Wood Floor Damage\n\n**Water damage** is the most common serious issue with laminate flooring specifically — laminate's core is essentially compressed wood fibre, and once moisture gets into a seam, the board swells and the damage generally isn't reversible for that section. The affected boards typically need replacing rather than repairing, though this is usually possible without replacing the whole floor if you have spare boards from the original installation, or can source a close match.\n\n**Engineered wood flooring** handles moisture somewhat better than laminate, thanks to its solid wood veneer layer, but is still vulnerable to standing water and can show gapping, cupping, or surface damage over time. Minor surface damage — scratches, small dents — can often be sanded and refinished in the affected area, whereas structural damage from water usually needs board replacement.\n\n**The practical lesson either way**: address any water source (a leak, a spill left too long, condensation from a nearby radiator) before repairing the floor itself, or the same damage will simply recur.\n\n## Chipped or Damaged Worktops\n\nLaminate worktops are durable for everyday use but can chip at edges and corners, particularly around sink cut-outs where the substrate is more exposed to moisture and impact.\n\n**Small chips**: can often be filled and colour-matched reasonably well, particularly on darker worktop colours where a repair is less visible. Getting a genuinely invisible repair on a light or patterned laminate is harder, and it's worth being realistic about that before committing to a repair over replacement.\n\n**Larger damage or damage near the sink cut-out** is more likely to need a section replaced, since the structural integrity of the worktop around a joint is more important than the cosmetic finish elsewhere.\n\n**Solid or engineered stone worktops** handle chips differently — genuinely repairable in most cases with the right filler and polishing, often to a very high standard given the material's consistency.\n\n## Loft Hatches: The Most Overlooked Insulation Gap in the House\n\nAn uninsulated, poorly sealed loft hatch is one of the most common and most overlooked sources of heat loss in a property — it's a hole directly into the loft space sitting right above heated living space, and a huge number of properties still have the original, unsealed hatch that came with the house.\n\n**What a proper loft hatch setup involves**: an insulated hatch cover (either a retrofit insulation kit fitted to the existing hatch, or a dedicated insulated hatch unit), and a seal around the edge to stop warm air escaping around the frame — the same principle as [draught-proofing](/blog/small-jobs-round-up-shelves-picture-hanging-draught-proofing) applied to the one entry point most people never think about.\n\n**Loft ladders** are a related, common upgrade — replacing a freestanding ladder that has to be carried and positioned every time with a fixed, foldaway ladder that's simply pulled down when needed. Worth doing at the same time as sealing the hatch itself, since both jobs need the same access.\n\n## Hairline Cracks in Plaster or Plasterboard\n\nThe most common cause of hairline cracks, particularly around door frames, ceiling corners, and where a plasterboard wall meets a different material, is simple settlement — buildings move very slightly over time, and plaster and plasterboard aren't perfectly flexible, so small cracks appear at the points of greatest movement.\n\n**When it's genuinely nothing to worry about**: fine, hairline cracks that aren't growing, aren't accompanied by doors or windows sticking, and have been there a while without change.\n\n**When it's worth a proper look**: cracks that are widening, appearing suddenly, or accompanied by other signs like doors that have started sticking or gaps opening up around window frames — these can indicate more significant structural movement worth investigating rather than simply filling over.\n\n**The fix for genuine cosmetic cracks** is straightforward — filling, sanding, and repainting — though it's worth using a flexible filler on cracks near junctions between different materials, since a rigid filler in a spot that continues to move slightly will simply crack again.\n\n## Cracked or Damaged Chimney Breasts\n\nCommon in period properties, particularly where a chimney breast has been partially removed on one floor while retained on another (a common historical alteration), which can create structural stress points that show as cracking. Cracking can also come from simple age and settlement in an original, unaltered chimney breast.\n\n**Worth a proper assessment** rather than just filling, since a chimney breast with structural cracking may need more than cosmetic repair, particularly if there's been previous alteration work.\n\n## Fascia Board Damage\n\nThe fascia — the board running along the roofline that gutters are typically fixed to — takes a lot of weather exposure and can rot, crack, or come away from its fixings over time, especially on older timber fascias rather than modern UPVC versions.\n\n**Why it matters beyond appearance**: the fascia supports the guttering, so damage here can affect how securely the gutters are fixed, which connects directly to the kind of overflow and water damage we've covered in our [gutter cleaning guide](/blog/gutter-cleaning-cost-guide-london).\n\n## Kitchen Cupboard Doors Not Closing Properly\n\nA very common, very fixable issue — kitchen cabinet doors that don't sit flush, that swing open on their own, or that are misaligned with neighbouring doors are almost always a hinge adjustment rather than a fault with the door or cabinet itself. Modern cabinet hinges have adjustment screws specifically for this, and a few minutes per door usually resolves it.\n\n## A Quick Guide to What's DIY-Reasonable and What Isn't\n\nBeing straightforward, since not everything here needs a professional: filling small, stable hairline cracks, adjusting kitchen cabinet hinges, and filling narrow floorboard gaps are all reasonable jobs for most people with basic tools and a free afternoon. Loft hatch insulation kits are also genuinely DIY-friendly for most people comfortable working in a loft space.\n\nWorth getting help for: any crack that's actively growing or paired with other structural signs, laminate or engineered flooring water damage (matching replacement boards and getting a level, secure fit is fiddly to do well), worktop repairs where an invisible finish actually matters to you, and fascia board work, which usually means working at height and is worth treating with the same caution as any roofline job.\n\n## What We Offer\n\nAt [Tamesis Development Ltd](/), these small repairs sit across our [flooring and subfloor](/services/flooring-repairs), [carpentry and joinery](/services/carpentry-joinery), and general [handyman](/services/handyman) services — directly employed engineers who'll tell you honestly whether something's a quick fix or needs a more considered repair, rather than defaulting to the most expensive option.\n\nIf you've got a list of these small jobs building up, [get in touch](/contact) — batching several together into one visit is almost always better value than booking separately for each."
  },
  {
    "slug": "small-bathroom-garden-fixes-guide",
    "title": "Small Bathroom & Garden Fixes: Leaking Screens, Stiff Gates, and Everything in Between",
    "excerpt": "The small bathroom and garden jobs that don't feel urgent enough to book on their own — leaking shower screens, failed sealant, stiff gates — covered together in one visit.",
    "category": "Handyman",
    "coverPhoto": "photo-1690473768476-44b5cebb7d80",
    "relatedServiceSlug": "handyman",
    "publishDate": "2026-09-15",
    "content": "Some jobs are too small to think about calling anyone for, right up until you've been mopping up around a leaking shower screen for the fourth week running. This is a genuinely common category of home maintenance — individually minor, collectively worth sorting properly rather than working around indefinitely.\n\n## Leaking Shower Screen\n\nA shower screen that lets water escape onto the bathroom floor is usually one of two things: worn or missing seals along the edge of the screen, or the screen not being properly aligned with the shower tray or bath edge anymore, often because a hinge has loosened slightly over time.\n\n**Why it's worth fixing rather than living with**: water repeatedly escaping onto a bathroom floor isn't just an inconvenience — over time it can affect flooring, skirting, and in ground-floor bathrooms, potentially the subfloor beneath. It's a small problem that produces disproportionate damage if genuinely ignored for a long period.\n\n**The fix** is usually straightforward: replacing worn seals is inexpensive and quick, and re-aligning a hinged screen is often just a matter of adjusting the hinge fixings. Full screen replacement is only usually needed if the glass or frame itself is damaged.\n\n## Failed Bath or Shower Sealant\n\nThe silicone sealant around a bath or shower tray does genuine work — it stops water getting behind the tray or bath panel where it can cause hidden damage over time. Sealant fails through age, movement, or simply not being applied thickly enough originally, and once it's cracked or peeling, it's not doing its job anymore even if it still looks mostly intact.\n\n**Black mould on bathroom sealant** is extremely common and worth addressing properly rather than just cleaning repeatedly — sealant that keeps growing mould, even after cleaning, has usually reached the point where it needs replacing rather than treating, since mould can establish within the silicone itself, not just on the surface.\n\n**The fix**: removing the old sealant completely (this matters — resealing over old, failed sealant doesn't work properly) and applying a fresh, even bead. A straightforward job in principle, though getting a clean, even finish takes more care than it looks like it should.\n\n## Kitchen Tap Not Working\n\n\"Not working\" covers a range of specific problems, each with a different fix. No water at all from the tap, when other taps in the property work fine, usually points to an isolation valve that's been closed (sometimes accidentally, sometimes left off after previous work) rather than a fault with the tap itself. A tap that only trickles is often limescale buildup restricting flow through the internal mechanism, particularly in hard water areas. A tap that's stiff to turn or won't turn off fully usually means the internal cartridge has worn and needs replacing — a very common tap fault, and one that's usually a straightforward part swap rather than a full tap replacement.\n\n## Washing Machine Tap Issues\n\nSimilar principles apply to the taps behind a washing machine, which get far less routine attention than kitchen or bathroom taps simply because they're hidden away. A stiff or seized washing machine tap is common precisely because it's rarely turned, and worth testing occasionally — the same logic as testing your stopcock — so it actually works if you ever need to isolate the machine quickly.\n\n## Outdoor Tap Not Working, or Installing a New One\n\nOutdoor taps face a specific seasonal risk: frost damage. Water left in an outdoor tap or the pipe feeding it can freeze and crack the fitting, which then leaks (or fails entirely) once the weather warms and the ice thaws. Isolating and draining outdoor taps before winter is genuinely worthwhile preventative maintenance, not just a nice-to-have.\n\nFor anyone without an outdoor tap and wanting one fitted — for a hose, general garden use, or simply convenience — this is usually a straightforward job involving a new supply pipe run from the nearest indoor pipework, with an isolation valve fitted so it can be shut off and drained ahead of winter each year.\n\n## Stiff or Sticking Garden Gate Hinges\n\nGarden gates take a lot of weather exposure and, unlike most house hardware, are rarely oiled or maintained as routine. A gate that's become stiff, sags, or scrapes the ground when opened is usually either hinges that need lubricating and tightening, or — in more worn cases — hinges that have simply stretched or corroded and need replacing.\n\n**A sagging gate specifically** (where the far edge from the hinges has dropped) often just needs the hinges tightened or, for a genuinely worn gate, a diagonal support brace added to stop the frame racking out of square.\n\n## Cracks in Retaining or Garden Walls\n\nGarden and retaining walls move slightly with ground conditions, weather, and root growth from nearby planting, so some hairline cracking over time isn't automatically alarming. What's worth a proper look:\n\n- **Cracks that are widening**, rather than old and stable\n- **A wall that's visibly bulging or leaning**, which can indicate the wall isn't adequately holding back the ground behind it\n- **Cracking appearing after heavy rain**, since retaining walls specifically deal with water pressure from behind, and drainage issues are a common cause of retaining wall problems specifically\n\nA retaining wall, in particular, is doing real structural work — holding back a slope or raised bed — so cracking here is worth taking more seriously than an equivalent crack in a simple boundary wall.\n\n## Why These Belong in One Visit\n\nNone of these jobs individually justifies a dedicated call-out, which is exactly why they tend to sit unaddressed — a leaking shower screen for months, a stiff gate for a year, a tap that's just \"always been like that.\" Bundled into a single visit, the combined cost is almost always better value than tackling them one at a time as each becomes annoying enough to finally deal with.\n\n## A Seasonal Checklist for These Small Jobs\n\nWorth thinking about a few of these as seasonal maintenance rather than one-off fixes. Before winter: isolate and drain outdoor taps, check garden gate hinges aren't so stiff they'll be a struggle in icy conditions, and give retaining and garden walls a visual once-over after the year's heaviest rain to catch any new movement early. Spring is a sensible time to check bathroom sealant for any winter deterioration, since the combination of cold and humidity over winter months is when sealant failures tend to show up most.\n\nNone of this needs to be elaborate — a five-minute walk around the property twice a year, checking the items on this list, catches most of these problems while they're still small and inexpensive to fix, rather than after they've been quietly getting worse for a year unnoticed.\n\n## When a \"Small\" Job Turns Out Bigger\n\nOccasionally what looks like one of these small fixes turns out to be something more — a leaking shower screen that's actually revealing water damage to the subfloor beneath, or a cracked retaining wall with a genuine drainage problem behind it. This isn't common, but it's worth knowing that a proper assessment sometimes finds more than the original, minor-looking symptom. A good tradesperson will flag this honestly rather than quietly doing the small fix and leaving the bigger issue for you to discover later.\n\n## What We Offer\n\nAt [Tamesis Development Ltd](/), these jobs sit comfortably within our [handyman service](/services/handyman) and general [plumbing work](/services/plumbing) across London — directly employed engineers happy to work through a full list in one visit rather than needing a separate booking for each item.\n\nIf you've got a few of these building up, [get in touch](/contact) for a straightforward quote covering the whole list."
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
    console.error("Seed blog posts batch 7 error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
