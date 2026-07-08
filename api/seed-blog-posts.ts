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

A slow-draining sink can usually wait for a scheduled visit. A drain that's backing up — water coming back up through a different fixture, or sewage smells inside the property — is a different matter, both for hygiene and for potential damage. Our [drain unblocking](/services/plumbing) team treats backed-up drainage as a priority job.

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
    relatedServiceSlug: "general-building-maintenance",
    coverPhoto: "photo-1516216628859-9bccecab13ca",
    content: `Every housing association eventually faces the same question: is it better to fix things as they break, or to plan the work in advance? The honest answer is that a purely reactive approach almost always costs more over time — it just doesn't always look that way on a month-by-month budget.

## The Hidden Cost of "Wait Until It Breaks"

A reactive repair almost always costs more than the same job done as planned maintenance, for a few consistent reasons: emergency callout rates, the knock-on damage that happens while a problem goes unnoticed (a small roof leak becomes a ceiling replacement), and the disruption of an unplanned visit compared to a scheduled one that residents were told about in advance.

Multiply that across hundreds or thousands of units, and the difference between a reactive-only approach and a proper [planned maintenance](/services/general-building-maintenance) programme becomes a genuinely large number over a financial year — not just a theoretical one.

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
    relatedServiceSlug: "bathroom-refurbishment",
    coverPhoto: "photo-1620626011761-996317b8d101",
    content: `A bathroom is one of the smallest rooms in most London homes, but refurbishing one properly touches almost every trade — plumbing, electrics, tiling, carpentry, sometimes structural work if you're moving anything. Getting the planning right up front makes a real difference to how smoothly it goes.

## Start With What's Actually Wrong

Before thinking about tile colours, it's worth being honest about what's actually driving the refurbishment. Is it purely cosmetic — dated tiles, an old suite that still works fine? Or is there an underlying problem — poor water pressure, a leak, damp, inadequate ventilation? A [bathroom refurbishment](/services/bathroom-refurbishment) that only addresses the cosmetic layer while leaving an underlying damp or ventilation issue in place tends to look tired again within a couple of years.

## Decide: Refresh, Refit, or Reconfigure

Broadly, most bathroom projects fall into one of three categories:

- **A refresh** — new tiles, a repainted ceiling, updated fittings, keeping the existing layout and suite. Fastest and least disruptive.
- **A full refit** — new suite, new tiling, same basic layout (bath where the bath was, toilet where the toilet was). This is where most [bathroom installation](/services/bathroom-refurbishment) work sits.
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
  {
    slug: "awaabs-law-what-housing-associations-need-to-do-now",
    title: "Awaab's Law: What Housing Associations and Local Authorities Need to Do Now",
    excerpt:
      "Since October 2025, social landlords in England face strict legal timeframes for damp, mould and emergency hazards — with more hazard types added through 2026 and 2027. Here's what's actually required.",
    category: "Housing Associations & Local Authorities",
    coverPhoto: "photo-1517646287270-a5a9ca602e5c",
    content: `Named after two-year-old Awaab Ishak, who died in 2020 after prolonged exposure to mould in his family's housing association home, Awaab's Law came into force for the social rented sector in England on 27 October 2025. It sets out, for the first time, fixed legal timeframes within which social landlords must investigate and fix damp, mould, and emergency hazards — and the requirements are already being expanded.

## What the Law Actually Requires (Phase 1)

Under the current phase, when a social landlord becomes aware of a potential damp or mould hazard, they must investigate within **10 working days** to establish whether a hazard actually exists. Once the investigation concludes, tenants must receive a **written summary of the findings within 3 working days**. If the investigation confirms a significant risk to health or safety, the landlord must make the property safe — using temporary measures if needed — within **5 working days** of that finding.

Emergency hazards are treated even more urgently: anything posing an immediate and significant risk of harm (a dangerous electrical fault, a major leak, a failed external door) must be investigated and made safe within **24 hours** of the landlord being notified.

If a property genuinely can't be made safe within these timeframes, the landlord must arrange suitable alternative accommodation, at their own expense, until it's safe for residents to return.

## Documentation Is Not Optional

Landlords are required to keep clear records of every stage — correspondence with the resident, communication with contractors, and (where relevant) evidence of why a timeframe couldn't be met for reasons outside the landlord's control. This is a meaningful shift from informal repair logs to something closer to an audit trail, and it changes what a maintenance contractor needs to deliver alongside the physical work itself: dated reports, clear written findings, and a paper trail that would hold up if a case were escalated to the Housing Ombudsman.

## The Law Is Getting Wider, Not Staying Still

Phase 1 covers damp, mould, and emergency hazards specifically. From 2026, the government has confirmed the scope will expand to include excess cold and excess heat, falls, structural collapse and explosions, fire and electrical hazards, and domestic hygiene and food safety issues. A further phase in 2027 is expected to bring in the remaining hazard categories under the Housing Health and Safety Rating System (HHSRS). In practical terms, this means the fixed-timeframe approach that currently applies to damp and mould will soon apply across most of what a [planned maintenance](/services/general-building-maintenance) programme already covers — so the assessment and reporting processes being built now are worth building properly the first time.

## What This Means for Contracting Relationships

A repair logged in a spreadsheet and actioned "when a slot comes free" doesn't fit this framework. What does fit: a contractor who can commit to genuinely fast response for anything flagged as urgent, who documents findings in writing as a matter of course, and who reports back to the housing association or local authority in a format that can be handed to a regulator or ombudsman without extra work. This is the operating model we already use for [housing associations](/sectors/housing-associations) and [local authorities](/sectors/local-authorities) — not something we'd need to bolt on to comply with a new law, since fast, well-documented response has always been part of how we work.

## Getting Ready for the Next Phase

If your current repairs process was built around older, softer timeframes, now is the point to review it — before the 2026 expansion brings more hazard categories into the same strict-deadline framework. [Get in touch](/contact) if you'd like to talk through what your stock and current contractor arrangements would need to look like to meet these requirements comfortably rather than reactively.`,
  },
  {
    slug: "mees-2030-energy-efficiency-rules-london-landlords",
    title: "MEES 2030: What the New Energy Efficiency Rules Mean for London Landlords",
    excerpt:
      "The government has confirmed EPC C will be required for all private rented tenancies from October 2030 — with a completely new dual-metric standard. Here's what's actually changing.",
    category: "Landlords",
    coverPhoto: "photo-1621983209352-c2880ac507b2",
    content: `After a lengthy consultation process, the government confirmed its final position on Minimum Energy Efficiency Standards (MEES) for the private rented sector in January 2026. If you let property in London, this is worth understanding now rather than in 2029 — the improvement work involved often isn't quick to schedule.

## Where the Standard Stands Today

Right now, the rule is straightforward: since April 2020, landlords cannot let or continue letting a property with an EPC rating of F or G, unless a valid exemption is registered. The current cost cap for required improvements is £3,500 (including VAT), and non-compliance can carry a penalty of up to £5,000.

## What's Changing, and When

The confirmed new requirement is an **EPC C rating for all tenancies — new and existing — from a single date: 1 October 2030.** This is a change from the government's original proposal of a phased approach (new tenancies by 2028, existing by 2030) — landlords now have one deadline to work towards rather than two.

The bigger shift is in how compliance will actually be measured. Rather than a single EPC band, the new standard uses a **dual-metric approach**: a fabric performance metric (how thermally efficient the building envelope itself is) as the primary measure, followed by a second metric — either a smart-readiness metric or a heating-system metric, landlord's choice — once the fabric standard is met. You won't be forced into a heating system upgrade if smart-technology improvements aren't practical for the property, which matters for older or harder-to-treat buildings common across London.

Enforcement is also getting sharper teeth: the maximum fine per breach is being increased to £30,000, and a new Private Rented Sector Database (being introduced separately, under the Renters' Rights Act) is expected to make it considerably easier for local authorities to identify non-compliant properties.

## What Actually Counts as "Fabric Performance"

In practice, fabric performance improvements are things like loft and cavity wall insulation, floor insulation, and — for solid-wall properties common in period London housing — internal or external wall insulation, though a specific exemption route exists where solid wall insulation genuinely isn't suitable. This is where the work tends to be more disruptive and take longer to plan than, say, a boiler swap, which is exactly why landlords with older housing stock benefit from starting the assessment conversation years rather than months ahead of 2030.

## Transitional Protection for Existing Ratings

If your property already holds a valid EPC showing a C rating (under the current methodology) before the new EPC framework comes in, the government has confirmed this will be recognised as compliant until that certificate expires — you won't be forced to immediately requalify under the new metrics. New EPCs issued between 2026 and 2030 will show both the old and new methodology side by side, specifically so no landlord is caught out by the transition.

## Where This Overlaps With Other Compliance Work

Energy efficiency improvements rarely happen in isolation — insulation work often coincides with damp investigations (poor insulation is a common contributing factor to condensation and mould), and both tie into wider [planned maintenance](/services/general-building-maintenance) scheduling across a portfolio. If you're a [landlord](/sectors/landlords) with EPC D, E, F, or G rated property in London, it's worth getting a realistic assessment of what fabric performance work would actually involve well before 2030 pressure sets in on contractor availability.

[Get a free quote](/quote) for an initial assessment, or [contact us](/contact) to talk through a whole portfolio rather than a single property.`,
  },
  {
    slug: "renters-rights-act-what-london-landlords-need-to-know",
    title: "The Renters' Rights Act Is Now in Force: What Every London Landlord Needs to Know",
    excerpt:
      "Section 21 'no-fault' evictions ended on 1 May 2026. Here's what actually changed for landlords, and where property condition and maintenance now matter more than ever.",
    category: "Landlords",
    coverPhoto: "photo-1702441831852-669adb6e762f",
    content: `The Renters' Rights Act 2025 received Royal Assent in October 2025, and its central reforms took effect on 1 May 2026 — meaning the biggest change to the private rented sector since the late 1980s is no longer coming, it's here. If you let residential property in London, here's what's actually changed in practice.

## Section 21 Is Gone

From 1 May 2026, landlords can no longer serve new Section 21 "no-fault" eviction notices. Any Section 21 notice served before that date remains usable, but only if court proceedings were started by 31 July 2026 — after that cut-off, an unused notice is simply void. Going forward, ending a tenancy requires a Section 8 notice citing one of the legal grounds for possession, with the specific grounds having been expanded and, in several cases, given longer required notice periods than before.

## Fixed-Term Tenancies Have Effectively Ended

Assured Shorthold Tenancies have converted to open-ended **Assured Periodic Tenancies**. There's no fixed term to renew or negotiate at expiry — tenants can stay indefinitely, subject to rent being paid and no grounds for possession arising, and can themselves leave at any point by giving two months' notice. Existing tenancy agreements didn't need to be reissued, but every landlord with a tenancy that predates 1 May 2026 was required to give tenants a copy of the government's official Information Sheet by 31 May 2026 — a straightforward step, but one that carries a civil penalty of up to £7,000 if missed.

## Rent Increases Now Follow a Formal Process

Rent can only be increased once every 12 months, and only via a Section 13 notice, which gives tenants a defined route to challenge an increase they consider excessive. The days of an informal rent conversation followed by an updated figure on the next invoice are over — the process now needs to be followed correctly to hold up.

## What's Still to Come

This is phase one. Local authorities already gained expanded investigatory powers — the ability to inspect properties, demand documents, and access third-party data — from December 2025. A mandatory Private Rented Sector Database is rolling out from late 2026, which registered landlords will need to be on to use certain Section 8 possession grounds. A new PRS Ombudsman service is expected around 2028, and a Decent Homes Standard for the private rented sector — plus a possible future extension of Awaab's Law beyond social housing — are both still working through consultation.

## Why Property Condition Now Carries More Weight

With no-fault eviction off the table and the sector heading toward mandatory minimum standards and a landlord database, the practical reality is that a well-maintained property is doing more work for a landlord than it used to. Grounds for possession, rent challenges, and future Ombudsman complaints are all situations where a documented history of prompt, professional repairs is a genuine asset — not just a compliance checkbox. This connects directly to the other major change in the pipeline: [Minimum Energy Efficiency Standards](/blog/mees-2030-energy-efficiency-rules-london-landlords) are tightening on broadly the same timeline, and a Decent Homes Standard for the private rented sector is very likely on its way after that.

## Getting Your Portfolio in Good Shape

If you manage rental property across London and want a realistic picture of what condition your stock is actually in — before a tenant dispute, a database registration, or a future Decent Homes Standard forces the question — [get in touch](/contact) for a straightforward conversation, or [request a free quote](/quote) for specific work you already know is needed. We work with [landlords](/sectors/landlords) across every London borough, from single properties to larger portfolios.`,
  },
  {
    slug: "what-counts-as-a-responsive-repair",
    title: "What Counts as a Responsive Repair? A Practical Guide",
    excerpt:
      "Not every repair needs the same urgency. Here's how a well-run responsive repairs service actually triages and handles reported issues.",
    category: "Repairs & Maintenance",
    relatedServiceSlug: "responsive-repairs",
    coverPhoto: "photo-1621905252507-b35492cc74b4",
    content: `"Responsive repairs" is the term used across property management for work carried out in reaction to a reported issue, as opposed to planned or preventative maintenance. In practice, it covers everything from a sticking door to a failed light fitting — and how well it's handled depends on decent triage, not just fast vans.

## Triage Comes First

A good [responsive repairs](/services/responsive-repairs) service starts by properly categorising what's been reported: is it urgent (a safety issue, a security failure, something actively getting worse) or routine (cosmetic, minor, can be scheduled)? Getting this right matters — treating everything as urgent burns resource on low-priority jobs and slows down genuinely urgent ones, while treating everything as routine risks small issues becoming bigger, more expensive ones.

## What Should Happen After a Repair Is Reported

A clear acknowledgment, a realistic timeframe based on the triage category, and — critically — a single engineer visit that actually resolves the issue rather than requiring a second visit to "actually fix it now." Repeat visits are the single biggest driver of tenant and resident dissatisfaction with repairs services, and usually point to either poor initial diagnosis or engineers without the right materials on the first visit.

## Why This Matters for Housing Associations and Landlords

Responsive repairs performance is one of the most visible measures of contractor quality to residents and tenants — far more visible than a planned maintenance schedule most people never see directly. It's also increasingly tied to formal compliance, particularly for [housing associations](/sectors/housing-associations) working within Awaab's Law timeframes.

If your current repairs process is generating repeat visits or slow first response, [get a free quote](/quote) or [contact us](/contact) to talk through what a properly triaged responsive repairs service should look like for your properties.`,
  },
  {
    slug: "what-does-a-property-maintenance-contract-actually-include",
    title: "What Does a Property Maintenance Contract Actually Include?",
    excerpt:
      "\"Property maintenance\" gets used as a catch-all term. Here's what a genuinely comprehensive contract should cover, and what to check before signing one.",
    category: "Repairs & Maintenance",
    relatedServiceSlug: "general-building-maintenance",
    coverPhoto: "photo-1690473768476-44b5cebb7d80",
    content: `Ask five contractors what "property maintenance" includes and you'll likely get five different answers. For anyone managing property — whether it's a single let or a large portfolio — knowing what should genuinely be covered makes comparing quotes far easier.

## The Core Trades

A proper [property maintenance](/services/general-building-maintenance) service should cover the trades that come up repeatedly across any property: basic plumbing, electrical fault-finding, carpentry, general building repairs, and painting and decorating touch-ups. If a contract only covers one or two of these, you'll end up managing multiple separate contractors for the rest — which defeats much of the point of having a maintenance contract in the first place.

## Response Times Should Be Specified, Not Implied

A genuinely useful contract states response time commitments by category (emergency, urgent, routine) rather than a vague "we'll get to it promptly." Vague commitments are the first thing to slip once a contractor is stretched across multiple clients.

## Reporting Is Part of the Service, Not an Extra

For any managed portfolio — [housing associations](/sectors/housing-associations), [local authorities](/sectors/local-authorities), or [property management companies](/sectors/property-management-companies) — you should expect job-by-job reporting as standard: what was found, what was done, and photographic evidence where relevant. If this isn't included by default, it's worth asking why before signing.

## Single Contractor vs. Multiple Specialists

There's a genuine trade-off here. Multiple specialist contractors can mean deeper expertise per trade, but it also means more contracts to manage, more invoices to reconcile, and more inconsistency in reporting standards. A single contractor with directly employed, multi-skilled engineers avoids that fragmentation — which is the model we work to.

[Get a free quote](/quote) for your property or portfolio, or [contact us](/contact) to talk through what should realistically be included for your specific situation.`,
  },
  {
    slug: "void-property-refurbishment-reducing-relet-times",
    title: "Void Property Refurbishment: How to Reduce Re-Let Times Without Cutting Corners",
    excerpt:
      "Every extra day a property sits empty is lost rent. Here's how a well-run void refurbishment process balances speed against genuine quality.",
    category: "Housing Associations & Landlords",
    relatedServiceSlug: "void-refurbishment",
    coverPhoto: "photo-1587582423116-ec07293f0395",
    content: `A void property — one that's empty between tenancies — costs money every single day it stays empty. For housing associations and landlords alike, [void property refurbishment](/services/void-refurbishment) speed is a genuine financial metric, not just an operational nicety. The challenge is cutting turnaround time without cutting the standard of work.

## Start With an Honest Inspection, Not an Assumption

The biggest cause of void refurbishment delays is discovering additional problems partway through the job — damp behind a unit that wasn't visible until it was removed, wiring that doesn't meet current standards once inspected properly. A thorough initial inspection, done properly rather than rushed, actually speeds up the overall process by avoiding these mid-job surprises.

## Sequence the Work to Avoid Waiting

Void refurbishments that run long are usually ones where trades aren't properly sequenced — painters waiting on electricians, electricians waiting on plasterers. A well-managed void job runs multiple trades in a planned sequence with minimal dead time between them, which is where having one contractor managing directly employed multi-trade teams (rather than juggling separate subcontractors) makes a genuine difference to turnaround time.

## Decide What "Ready to Let" Actually Means Upfront

Is the target a fully refreshed property, or the minimum standard needed to legally and reasonably re-let? Being clear about this before work starts — rather than mid-job — avoids scope creep that extends the timeline. For [housing associations](/sectors/housing-associations) managing many voids simultaneously, having a consistent, agreed standard across the whole portfolio also makes budgeting far more predictable.

## Compliance Checks Shouldn't Be an Afterthought

Gas safety, electrical certification, and any required fire safety checks should be built into the void process as standard steps, not squeezed in at the end when a new tenant is already waiting to move in.

[Request a free quote](/quote) for void turnaround work, or [contact us](/contact) to discuss a standing arrangement across a wider portfolio.`,
  },
  {
    slug: "common-plumbing-problems-in-older-london-properties",
    title: "Common Plumbing Problems in Older London Properties (And What Actually Fixes Them)",
    excerpt:
      "London's period housing stock brings specific plumbing quirks. Here's what comes up most often, and what a proper fix looks like versus a temporary patch.",
    category: "Plumbing",
    relatedServiceSlug: "plumbing",
    coverPhoto: "photo-1749532125405-70950966b0e5",
    content: `London's mix of Victorian terraces, converted flats, and post-war housing means [plumbing](/services/plumbing) issues here often differ from newer-build housing stock elsewhere. Knowing what's actually causing a problem — rather than just treating the symptom — makes a real difference to whether a fix lasts.

## Low Water Pressure in Converted Flats

Properties split into multiple flats often share original pipework never designed for multiple independent water systems. Low pressure on upper floors is frequently a pipework sizing or shared-supply issue rather than something a new tap or shower head will meaningfully fix — worth diagnosing properly before spending money on fixtures that won't solve the actual problem.

## Noisy Pipes ("Water Hammer")

That banging sound when a tap shuts off is usually air in the system or a loose pipe run, and while it's not usually dangerous, it can indicate pipework that's not properly secured and is wearing at contact points over time.

## Old Lead or Galvanised Pipework

Many older London properties still have sections of original lead or galvanised steel pipework, which degrades from the inside and gradually restricts flow — this shows up as pressure that gradually drops over months or years, easily written off as "just how the building is" when it's actually a specific, fixable issue.

## Boiler and Heating System Age Mismatches

It's common to find a modern combi boiler connected to old radiator pipework sized for a very different heating system — this often shows up as some rooms heating properly and others staying cold, which isn't a boiler fault but a compatibility issue between old and new parts of the system.

## When a Patch Isn't Enough

A quick fix can be the right call for a genuine emergency, but repeated patch jobs on the same recurring issue usually cost more over a few years than one proper repair. If something's been "fixed" more than once, it's worth a proper diagnostic visit rather than another patch.

[Get a free quote](/quote) for a proper diagnosis, or read about our [leak detection service](/services/leak-detection) if you suspect a hidden leak specifically.`,
  },
  {
    slug: "how-professional-leak-detection-actually-works",
    title: "How Professional Leak Detection Actually Works (Without Ripping Up Your Floors)",
    excerpt:
      "A hidden leak doesn't have to mean guesswork and unnecessary damage. Here's what proper leak detection equipment actually does differently.",
    category: "Plumbing",
    relatedServiceSlug: "leak-detection",
    coverPhoto: "photo-1669920282730-ab422e592f97",
    content: `A damp patch with no obvious source, an unexplained rise in your water bill, a musty smell that won't go away — these are all classic signs of a hidden leak, and the instinct is often to start opening up walls or floors to find it. Proper [leak detection](/services/leak-detection) avoids most of that guesswork entirely.

## Why Guessing Is Expensive

Opening up a wall or lifting flooring to search for a leak is disruptive and, if you guess wrong about the location, needs repeating — sometimes more than once. Beyond the direct cost of unnecessary repair work, incorrect diagnosis means the actual leak keeps causing damage the whole time it goes unaddressed.

## What Actual Diagnostic Equipment Does

Acoustic listening devices can pick up the specific sound signature of water escaping under pressure through pipework, even through walls and floors, narrowing the search area significantly before any invasive work happens. Thermal imaging can reveal temperature differences caused by damp or by hot water pipes, which often shows the path of a leak across a surface rather than just a single point. For trickier cases, tracer gas can be introduced into a pipe system and detected at the point where it escapes — useful where acoustic and thermal methods don't give a clear enough picture on their own.

## What Happens After the Leak Is Found

Proper leak detection identifies the source, not just "somewhere in this general area" — meaning any opening-up work that follows is targeted and minimal, rather than exploratory. This matters as much for cost as it does for disruption, particularly in occupied properties where minimising damage to finishes is a real priority.

## Signs Worth Getting Checked

A water bill that's crept up with no change in usage, a damp patch that reappears after redecorating, a persistent musty smell, or damp reappearing after a previous "repair" are all worth a proper diagnostic visit rather than continued guessing.

[Get a free quote](/quote) for a leak detection visit, or read more about [signs you need an emergency plumber](/blog/signs-you-need-an-emergency-plumber-in-london) if the situation feels urgent.`,
  },
  {
    slug: "why-drains-keep-blocking-and-how-to-actually-stop-it",
    title: "Why Your Drains Keep Blocking (And How to Actually Stop It Happening Again)",
    excerpt:
      "A drain that blocks repeatedly usually has a specific, fixable cause. Here's how to tell a one-off blockage from a recurring structural issue.",
    category: "Plumbing",
    relatedServiceSlug: "plumbing",
    coverPhoto: "photo-1521207418485-99c705420785",
    content: `A single blocked drain is usually just bad luck — fat, wipes, hair, or tree roots doing what they do. A drain that blocks repeatedly, though, almost always has an underlying cause that a one-off clearance won't fix.

## The Usual Suspects for a One-Off Blockage

Cooking fat poured down a sink and solidifying further along the pipe, wipes and sanitary products flushed despite not being genuinely flushable, and hair building up in bathroom drains are the most common causes of an isolated blockage. [Drain unblocking](/services/plumbing) for these is usually straightforward and the drain runs clear afterwards with no further issue.

## When It's Actually a Structural Problem

If the same drain blocks repeatedly despite normal use, common underlying causes include a partial collapse in the pipe run (creating a ledge where debris catches), tree root ingress at a joint (very common in older London properties with mature trees nearby), or a section of pipe with the wrong fall — meaning it doesn't slope correctly to let water flow away properly, allowing solids to settle rather than clear each time.

## Why a CCTV Drain Survey Is Worth It for Recurring Problems

For a drain that blocks more than once with no obvious cause (like a one-off disposal mistake), a camera survey down the drain line will usually show exactly what's happening — root ingress, a cracked section, a misaligned joint — rather than continuing to clear the symptom every few months without addressing the cause.

## Prevention That Actually Works

For kitchens: no fat down the sink, ever, even small amounts add up. For bathrooms: a simple drain guard catches hair before it becomes a problem. For anything else: if a drain has blocked more than twice in a year, it's worth investigating rather than just calling for another clearance each time.

[Get a free quote](/quote) for drain unblocking, or read about our [drain repairs service](/services/plumbing) if you suspect there's an underlying structural issue.`,
  },
  {
    slug: "drain-repairs-cctv-surveys-relining-explained",
    title: "Drain Repairs Explained: CCTV Surveys, Relining, and When You Actually Need Excavation",
    excerpt:
      "Modern drain repair often doesn't require digging up your garden or driveway. Here's what the options actually are, and when each one applies.",
    category: "Plumbing",
    relatedServiceSlug: "plumbing",
    coverPhoto: "photo-1530124566582-a618bc2615dc",
    content: `Drain problems have a reputation for meaning disruptive, expensive excavation work — and sometimes that's genuinely necessary, but modern [drain repair](/services/plumbing) techniques mean it's often not the first option, or even needed at all.

## Step One Is Always a Proper Survey

A CCTV drain survey — a camera run through the pipe on a flexible rod — shows exactly what's wrong: a cracked section, root ingress, a misaligned joint, or a partial collapse. This is the single most useful step before agreeing to any repair method, since it tells you precisely what you're actually dealing with rather than guessing from symptoms alone.

## Relining: Fixing a Pipe Without Digging It Up

For cracks, small root intrusions, and joint misalignment, relining — inserting a resin-coated liner into the existing pipe that cures in place to form a new internal pipe wall — can fix the problem without any excavation at all. This is usually faster, less disruptive, and often more cost-effective than digging up a driveway, garden, or floor to access the pipe directly.

## When Excavation Genuinely Is Necessary

A full pipe collapse, severe structural damage, or a section that's shifted significantly out of alignment usually can't be fixed by relining and does need direct access. In these cases, a proper survey beforehand at least means the excavation is targeted to the specific section that needs it, rather than guesswork digging along the whole run.

## Root Ingress Specifically

Established trees near drain runs — common across London's older residential streets — are a frequent cause of root ingress at pipe joints. Depending on severity, this can sometimes be treated with a root cutting and relining combination rather than full excavation, though a survey is needed to confirm this is viable for the specific situation.

If you've had a recurring drain issue or a survey has flagged a problem, [get a free quote](/quote) for the right repair approach, or [contact us](/contact) to talk through the options before committing to a method.`,
  },
  {
    slug: "bathroom-repairs-worth-fixing-vs-refurbishment",
    title: "Bathroom Repairs: What's Worth Fixing vs. When It's Time for a Refurbishment",
    excerpt:
      "Not every bathroom issue needs a full refurbishment. Here's how to tell the difference, and what a straightforward repair can realistically achieve.",
    category: "Bathrooms",
    relatedServiceSlug: "bathroom-refurbishment",
    coverPhoto: "photo-1631889993959-41b4e9c6e3c5",
    content: `A cracked tile, a leaking seal, a toilet that won't stop running — these are all genuine [bathroom repair](/services/bathroom-refurbishment) jobs, and none of them require pulling the whole room apart. Knowing where the line sits between "repair" and "refurbishment" saves both money and unnecessary disruption.

## Repairs That Are Usually Straightforward

Re-sealing around a bath or shower tray, replacing a cracked tile or two (assuming matching tiles are available), fixing a running or leaking toilet, replacing a tap or shower valve, and addressing minor grout deterioration are all jobs that can typically be handled as standalone repairs without touching the rest of the room.

## When a "Repair" Signals a Bigger Issue

Recurring seal failure around the same bath or shower often points to movement in the structure beneath — worth investigating rather than just resealing again. Tiles cracking in a pattern (rather than a single impact-damaged tile) can indicate movement in the wall or floor behind them. Persistent mould despite cleaning, especially if it returns quickly, usually means a ventilation problem rather than a cleaning problem.

## The Genuine Cost Difference

A standalone repair is, unsurprisingly, far cheaper than a full [bathroom refurbishment](/services/bathroom-refurbishment) — but repairing around an underlying issue repeatedly (the reseal-and-recrack cycle) can end up costing more over a couple of years than addressing the actual cause once.

## Getting an Honest Assessment

A good repair visit should tell you clearly if what looks like a simple fix is actually a symptom of something bigger — not just complete the visible repair and leave the underlying cause for you to discover again in six months.

[Get a free quote](/quote) for a bathroom repair, and we'll be straightforward with you about whether it's a standalone fix or something that points to a bigger job.`,
  },
  {
    slug: "bathroom-installation-what-to-check-before-you-commit",
    title: "Bathroom Installation: What to Check Before You Commit to a Suite",
    excerpt:
      "Choosing bathroom fittings is the fun part. Here's what actually matters for installation quality that you won't see once the room is finished.",
    category: "Bathrooms",
    relatedServiceSlug: "bathroom-refurbishment",
    coverPhoto: "photo-1695002817411-203c7f19dfa3",
    content: `Picking taps, tiles, and a suite is the enjoyable part of a [bathroom installation](/services/bathroom-refurbishment) — but the things that determine whether it still looks and works well in five years mostly happen before any of that's visible.

## Check the Waste and Supply Positions First

Before committing to a specific suite layout, confirm where the existing waste pipes and water supplies actually run. Moving them is entirely possible, but it adds cost and time — knowing this upfront means the layout decision is made with full information, not as a surprise once installation starts.

## Not All "Standard" Sizes Are Actually Standard

Toilet pan-to-wall dimensions, bath lengths, and shower tray sizes vary more between manufacturers than people expect. If you've already chosen fittings, it's worth confirming compatibility with the existing room dimensions and waste positions before they're ordered, rather than after delivery.

## Tap and Valve Quality Matters More Than It Looks

Two taps can look almost identical while having very different internal mechanisms — cheaper cartridge valves tend to wear and drip within a few years, while better-quality valves last considerably longer. This is genuinely one area where spending a bit more upfront avoids a repeat repair job later.

## Ventilation Should Be Part of the Installation Conversation

An extractor fan's specification and ducting route are far easier to sort out during installation planning than retrofitted afterward. A beautifully installed suite in a poorly ventilated room will develop condensation and mould issues regardless of fitting quality.

## Getting It Installed Properly the First Time

A rushed installation shows up later as movement, minor leaks at joints, or uneven fittings — problems that are avoidable with careful, unhurried installation work rather than a race to finish.

[Request a free quote](/quote) for a new bathroom installation, and see [some of our recent bathroom projects](/projects) for a sense of finished quality.`,
  },
  {
    slug: "flooring-repairs-what-causes-most-floor-problems",
    title: "Flooring Repairs: What Actually Causes Most Floor Problems in London Homes",
    excerpt:
      "Squeaky boards, uneven floors, and lifting flooring usually have a specific cause. Here's what to look for before deciding on a fix.",
    category: "Interiors & Finishing",
    relatedServiceSlug: "flooring-repairs",
    coverPhoto: "photo-1659930087003-2d64e33181f7",
    content: `A squeaking floorboard is annoying but rarely serious. Uneven or lifting flooring, on the other hand, is often a sign of something worth investigating properly rather than just patching over. [Flooring repairs](/services/flooring-repairs) work best when they address the actual cause.

## Squeaking and Creaking

Usually caused by boards that have loosened from their joists over time, or friction between boards that have dried and shrunk slightly. A straightforward, targeted fix — refixing the board properly rather than just adding more nails on top of the problem — usually resolves this permanently.

## Uneven or Sloping Floors

In older London properties, some settlement is normal and not necessarily a structural concern — but a sudden change, or a slope that's got noticeably worse recently, is worth having assessed rather than assumed to be "just an old house."

## Lifting or Bubbling Laminate and Vinyl

Almost always caused by moisture getting underneath the flooring, either from a spill that's worked its way under an edge, or from moisture rising through a concrete subfloor without adequate damp-proofing. Replacing the visible flooring without addressing the moisture source means the same problem returns.

## Damaged Sections of Solid or Engineered Wood

A localised repair — replacing individual damaged boards while matching the existing finish — is usually possible and considerably less disruptive than replacing an entire floor, provided matching material is available.

## When to Repair vs. Replace

If the damage or wear is localised and the rest of the floor is in good condition, a repair is usually the sensible option. If problems are appearing across multiple areas, it's often more cost-effective to address the whole floor properly in one job rather than repeatedly patching individual sections.

[Get a free quote](/quote) for flooring repairs, and we'll give you an honest view on repair versus replacement for your specific situation.`,
  },
  {
    slug: "wall-and-floor-tiling-what-good-tiling-actually-looks-like",
    title: "Wall & Floor Tiling: What Separates a Good Job From a Bad One",
    excerpt:
      "Tiling looks straightforward until it's done badly. Here's what to check for, and why the prep work matters more than the tiles themselves.",
    category: "Interiors & Finishing",
    relatedServiceSlug: "tiling",
    coverPhoto: "photo-1629079447777-1e605162dc8d",
    content: `Tiling is one of those jobs that looks deceptively simple when done well, and becomes obviously wrong fairly quickly when it isn't. Most of what separates good [wall and floor tiling](/services/tiling) from bad happens before a single tile is actually laid.

## Surface Preparation Is Most of the Job

Tiles laid directly onto an uneven or poorly prepared surface will show every imperfection underneath — lippage (uneven edges between adjacent tiles), inconsistent grout lines, and tiles that don't sit flush. Proper preparation, including levelling where needed, takes time that's easy to underestimate when quoting a job, which is often where corners get cut.

## Waterproofing Behind Tiles (Tanking) Isn't Optional in Wet Areas

In bathrooms and other wet areas, waterproof membrane behind the tiles — not just grout and sealant on the surface — is what actually stops water getting into the structure behind. This is invisible once finished, which is exactly why it's the step most likely to be skipped by a contractor cutting corners.

## Grout Lines Should Be Consistent

Uneven grout line widths are one of the clearest visual signs of rushed or careless tiling work, usually caused by not using spacers properly or not checking alignment as the work progresses rather than only at the end.

## Cutting Around Fixtures Properly

Neat cuts around pipes, sockets, and fittings — rather than large gaps covered by excessive sealant — are a genuine marker of a careful tiler versus one rushing to finish.

## What to Check Before Accepting a Finished Job

Run a hand across the surface feeling for lippage, check grout line consistency across the whole area (not just the most visible section), and confirm waterproofing was actually included in wet areas rather than assumed.

[Get a free quote](/quote) for tiling work, whether it's a full bathroom or a kitchen splashback.`,
  },
  {
    slug: "carpentry-and-joinery-repair-vs-replace",
    title: "Carpentry & Joinery: When to Repair Original Features vs. When to Replace Them",
    excerpt:
      "Original doors, skirting, and staircases in period London properties are often worth repairing rather than replacing. Here's how to tell.",
    category: "Interiors & Finishing",
    relatedServiceSlug: "carpentry-joinery",
    coverPhoto: "photo-1561297331-a9c00b9c2c44",
    content: `Period London properties often have original doors, skirting, staircases, and other joinery that's genuinely worth preserving — both for character and, frequently, for the quality of timber used compared to modern equivalents. Good [carpentry and joinery](/services/carpentry-joinery) work knows when to repair rather than automatically replace.

## Original Doors Are Usually Repairable

Sticking doors are often a hinge or slight swelling issue, not a sign the door needs replacing. Even genuine damage — a cracked panel, a damaged frame — can usually be repaired by a skilled joiner working with matching timber, preserving the original character rather than fitting a modern replacement that won't match the rest of the property.

## Skirting and Architrave

Damaged sections can usually be spliced in and matched to existing profiles, rather than requiring an entire room's skirting to be replaced for one damaged length. This is both more cost-effective and better for keeping a consistent look throughout a property.

## Staircases Need a Careful Assessment

A creaking or slightly loose staircase is often fixable by addressing specific loose joints or worn treads, rather than requiring full replacement — genuine structural issues are less common than general wear, though any staircase with real movement or instability should be properly assessed rather than assumed to be cosmetic.

## When Replacement Genuinely Makes Sense

Severe rot, genuine structural failure, or damage beyond what timber matching can reasonably address are the situations where replacement is the sensible call rather than repair. A good joiner will tell you honestly when this is the case rather than defaulting to the more expensive option.

## Matching New Work to Old

Where new joinery is needed alongside original features — an extension, a replaced section — matching profiles, timber type, and finish properly is what makes new work blend in rather than visibly clash.

[Get a free quote](/quote) for carpentry and joinery work, whether it's a repair or a considered replacement.`,
  },
  {
    slug: "painting-and-decorating-what-actually-makes-paint-last",
    title: "Painting & Decorating: What Actually Makes a Paint Job Last (It's Not the Paint)",
    excerpt:
      "Two identical paints can perform very differently depending on what happens before the roller comes out. Here's what actually matters.",
    category: "Interiors & Finishing",
    relatedServiceSlug: "painting-decorating",
    coverPhoto: "photo-1632918572888-7a975f4b67b6",
    content: `It's a common assumption that paint quality is what determines how long a paint job lasts. In practice, preparation matters more than the paint itself — a premium paint over poor prep will fail faster than a mid-range paint over properly prepared surfaces. Good [painting and decorating](/services/painting-decorating) is mostly about the steps before painting starts.

## Preparation Is Most of the Work

Filling cracks and holes properly (not just skimming over them), sanding surfaces to give paint something to key into, and removing flaking or loose old paint before applying new coats are all essential — and all invisible once the job's finished, which is exactly why they're the steps most likely to be rushed by less careful decorators.

## Priming Isn't Always Optional

Bare plaster, particularly on new plasterwork, needs a proper mist coat (a diluted first coat) to seal it before full-strength paint is applied — skipping this typically means uneven absorption and a patchy finish. Similarly, painting over a stain (water damage, nicotine, marker) without a stain-blocking primer usually means the stain reappears through the new paint within weeks.

## Number of Coats Matters More Than People Expect

Two coats is standard for a reason — one coat, even of good paint, rarely gives even, durable coverage. If a quote seems significantly cheaper than others, it's worth checking whether it's actually specifying two full coats or just one.

## Ventilation and Drying Time

Rushing drying time between coats, or painting in poor ventilation, both lead to a less durable finish. This is one of the more common ways a job gets compressed to save time at the expense of the result lasting well.

## What a Well-Prepared Job Looks Like When Finished

Even coverage with no patchiness, clean sharp lines at edges and corners, and a finish that doesn't show brush or roller marks under normal lighting — these are the visible signs that the invisible preparation work was actually done properly.

[Get a free quote](/quote) for painting and decorating, whether it's a single room or a full property.`,
  },
  {
    slug: "electrical-services-warning-signs-not-to-ignore",
    title: "Electrical Services: Warning Signs in Your Property You Shouldn't Ignore",
    excerpt:
      "Some electrical issues are cosmetic. Others are genuine safety risks. Here's how to tell the difference and when to get something checked urgently.",
    category: "Electrical",
    relatedServiceSlug: "electrical",
    coverPhoto: "photo-1621905251189-08b45d6a269e",
    content: `Electrical problems range from a minor nuisance to a genuine safety hazard, and it's not always obvious which category a given symptom falls into. Knowing the warning signs worth acting on quickly is worth understanding before you need [electrical services](/services/electrical) urgently.

## Signs Worth Getting Checked Promptly

A burning smell near sockets or the fuse box, sockets or switches that feel warm to the touch, frequent tripping of the same circuit breaker, flickering lights that aren't just a loose bulb, and visible scorch marks around any socket or switch are all signs that warrant a professional visit soon rather than being monitored and hoped to resolve on their own.

## What Frequent Tripping Actually Means

A circuit breaker tripping repeatedly is doing its job — protecting you from a fault — but the underlying cause (an overloaded circuit, a faulty appliance, deteriorating wiring) needs identifying rather than just resetting the breaker each time and moving on.

## Old Fuse Boxes and Consumer Units

Properties with an older fuse box (rather than a modern consumer unit with RCD protection) lack some of the safety protections built into current wiring regulations. This isn't automatically dangerous, but it's worth having assessed, particularly ahead of any other electrical work being carried out in the property.

## Rented Property Compliance

Landlords are required to have electrical installations inspected periodically and hold a valid Electrical Installation Condition Report (EICR). If you're a [landlord](/sectors/landlords) and aren't sure when your last EICR was carried out or when it expires, this is worth checking — it's both a legal requirement and a genuine safety matter.

## When It's Genuinely an Emergency

No power at all, a burning smell that's strong or getting worse, or visible sparking should be treated as urgent — turn off the supply at the consumer unit if you can safely do so, and get it looked at immediately rather than waiting for a scheduled visit.

[Get a free quote](/quote) for electrical work, or [report an urgent issue](/report-repair) if something needs prompt attention.`,
  },
  {
    slug: "damp-and-mould-treatment-what-actually-works",
    title: "Damp & Mould Treatment: What Actually Works (And What's Just a Temporary Fix)",
    excerpt:
      "Bleach and a fresh coat of paint will hide mould temporarily. Here's what actually stops it coming back, and why identifying the type of damp matters.",
    category: "Damp & Mould",
    relatedServiceSlug: "damp-mould",
    coverPhoto: "photo-1517646287270-a5a9ca602e5c",
    content: `Mould that keeps coming back despite regular cleaning is one of the most common — and most frustrating — property issues, precisely because surface cleaning treats the symptom without addressing why the mould is growing in the first place. Effective [damp and mould treatment](/services/damp-mould) starts with identifying which type of damp is actually present.

## Condensation Damp

By far the most common type in occupied properties, caused by warm moist air (from cooking, showering, drying laundry indoors) meeting cold surfaces and condensing. This shows up typically on external walls, in corners, and around windows, and is fundamentally a ventilation and heating issue rather than a structural one — extractor fans, trickle vents, and consistent heating are the actual fix, not just cleaning the visible mould.

## Rising Damp

Genuinely less common than people assume, but does occur where a damp-proof course has failed or was never properly installed, allowing ground moisture to rise through walls. This typically shows as damp patches low on walls, often with a "tide mark," and needs a different treatment approach entirely from condensation.

## Penetrating Damp

Caused by water getting in from outside — a damaged roof, defective guttering, cracked render, or a failed seal around a window — and showing up as damp patches that often correlate with rainfall. This requires finding and fixing the actual point of water entry, since treating the internal symptom without fixing the external cause means it simply returns.

## Why Awaab's Law Makes This More Urgent for Social Housing

Since October 2025, [housing associations and local authorities](/blog/awaabs-law-what-housing-associations-need-to-do-now) face strict legal timeframes for investigating and resolving damp and mould hazards — which makes correctly identifying the damp type on the first visit more important than ever, since misdiagnosis leads to repeat visits within an already tight compliance window.

## Getting a Proper Diagnosis

A good damp treatment starts with correctly identifying which type (or combination) is present — this isn't always obvious from the visible symptom alone, and treating the wrong type means the problem returns regardless of how thoroughly the visible mould was cleaned.

[Get a free quote](/quote) for a proper damp assessment, or [contact us](/contact) if you're managing a portfolio with recurring damp issues.`,
  },
  {
    slug: "insurance-reinstatement-what-to-expect-after-a-claim",
    title: "Insurance Reinstatement: What to Expect After a Property Damage Claim",
    excerpt:
      "Fire, flood, or storm damage is stressful enough without confusing reinstatement work. Here's how the process typically works from claim to completion.",
    category: "Insurance & Restoration",
    relatedServiceSlug: "insurance-reinstatement",
    coverPhoto: "photo-1558227691-41ea78d1f631",
    content: `Dealing with significant property damage — from a burst pipe, fire, or storm — is stressful enough without also navigating an unfamiliar reinstatement process. Understanding roughly how [insurance reinstatement](/services/insurance-reinstatement) work actually proceeds can make a difficult situation more manageable.

## The Process Usually Starts With a Loss Adjuster

After a claim is submitted, your insurer will typically appoint a loss adjuster to assess the damage and agree the scope of work with you. A reinstatement contractor's role is to carry out the agreed scope properly — which is why clear communication between contractor, loss adjuster, and property owner matters throughout, rather than just at the start.

## Scope Can Change Once Work Begins

It's genuinely common for the true extent of damage to become clearer once work starts — water damage behind a wall that wasn't visible until it was opened up, for instance. A good reinstatement contractor documents this properly and communicates with the loss adjuster promptly, rather than either quietly expanding the job or ignoring damage that should be included in the claim.

## Matching, Not Just Replacing

Reinstatement isn't simply "put it back" — it's putting it back to match the pre-loss condition as closely as reasonably possible, which sometimes means sourcing matching materials, replicating period details, or coordinating multiple trades to restore a finish that took the original build considerable time to achieve.

## Documentation Matters Throughout

Photographs before, during, and after work, clear records of what was found and what was done, and organised communication with your insurer's process all make claims settle more smoothly — this is worth confirming a contractor does as standard, not as an optional extra.

## Timeframes Are Often Longer Than Expected

Between assessment, scope agreement, materials sourcing (particularly for period properties), and the work itself, reinstatement timelines are often longer than people initially expect. A contractor who gives you a realistic timeline upfront, rather than an optimistic one, makes the process considerably less stressful.

[Contact us](/contact) if you're dealing with an active insurance claim, or [get a free quote](/quote) for reinstatement work already scoped with your insurer.`,
  },
  {
    slug: "commercial-refurbishment-minimising-disruption-to-trading",
    title: "Commercial Refurbishment: How to Minimise Disruption While You're Still Trading",
    excerpt:
      "Closing entirely for a refurbishment isn't always an option. Here's how a well-planned commercial refurbishment works around an operating business.",
    category: "Commercial",
    relatedServiceSlug: "commercial-refurbishment",
    coverPhoto: "photo-1694521787193-9293daeddbaa",
    content: `Refurbishing a commercial space while it's still trading is a genuinely different challenge from refurbishing an empty property — every day of disruption has a direct cost, and the work needs to be planned around the business's operating hours, not just the trades' preferences. Good [commercial refurbishment](/services/commercial-refurbishment) is built around this constraint from the start.

## Phasing Is Usually the Answer

Rather than closing an entire space, a phased approach — completing one section while the rest remains operational, then moving to the next — is usually how commercial refurbishments avoid a full shutdown. This takes more careful planning than a single continuous job, but it keeps revenue flowing throughout.

## Working Outside Operating Hours

For noisier or more disruptive work, out-of-hours working (evenings, overnight, weekends) is often the practical solution, even though it typically costs more than standard daytime hours — the trade-off against lost trading time usually makes this worthwhile for active businesses.

## Dust and Noise Containment

Proper containment — temporary partitions, dust screens, controlled access points — matters more in a trading environment than an empty one, both for customer experience and for compliance with health and safety obligations to staff and visitors during the works.

## Planning Around Deliveries and Access

Refurbishment work needs to coexist with a business's normal deliveries, customer access, and staff movement — this needs discussing properly upfront rather than assumed, since a refurbishment that blocks a business's normal operations defeats the purpose of trying to stay open during it.

## Communication Throughout the Job

Regular updates on progress and any changes to the plan matter more in a live commercial environment, where a business needs to plan staffing, marketing, and customer communication around the works.

[Get a free quote](/quote) for a commercial refurbishment, and we'll talk through a phased plan that works around your trading hours from the outset.`,
  },
  {
    slug: "general-construction-what-actually-needs-building-control",
    title: "General Construction: What Actually Needs Building Control Sign-Off (And What Doesn't)",
    excerpt:
      "Not every building project needs formal building control approval, but getting this wrong can cause real problems later. Here's a practical guide.",
    category: "Construction",
    relatedServiceSlug: "construction",
    coverPhoto: "photo-1574757987642-5755f0839101",
    content: `One of the most common points of confusion in [general construction](/services/construction) work is whether a given project needs formal Building Control approval. Getting this wrong — either assuming approval isn't needed when it is, or over-engineering a simple project unnecessarily — causes real problems, so it's worth understanding the basics.

## Work That Usually Needs Building Control

Structural alterations (removing or altering load-bearing walls), extensions, loft conversions, and significant changes to drainage or structural waterproofing typically require Building Control sign-off, either through your local authority or an approved private inspector. This isn't optional paperwork — it protects you when selling the property later, since a lack of proper certification for structural work is a common cause of delays or complications in property sales.

## Work That Usually Doesn't

Like-for-like repairs, most internal non-structural work (a stud partition that isn't load-bearing), and cosmetic refurbishment generally fall outside Building Control requirements — though it's always worth confirming for your specific situation rather than assuming, since the line isn't always obvious from the outside.

## Why This Matters Even If You're Not Selling Soon

Unauthorised structural work discovered later — during a survey ahead of a sale, or by a mortgage lender's valuer — can hold up or even derail a transaction, sometimes years after the work was actually done. Getting proper sign-off at the time avoids this becoming a problem down the line.

## Party Wall Considerations

If work affects a shared wall with a neighbouring property (common in London's terraced and semi-detached housing), the Party Wall Act may apply, requiring formal notice to neighbours before work begins — a separate process from Building Control, and one that's easy to overlook until a neighbour raises it.

## Getting It Right From the Start

A contractor who raises Building Control and Party Wall questions proactively, before work begins rather than after a neighbour or inspector flags it, saves considerable stress later.

[Get a free quote](/quote) for construction work, and we'll talk through what approvals your specific project actually needs.`,
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
    await pool.query(`ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS related_service_slug TEXT;`);

    let inserted = 0;
    for (const post of POSTS) {
      const { rows: existing } = await pool.query(`SELECT id FROM blog_posts WHERE slug = $1;`, [post.slug]);
      if (existing.length > 0) continue;
      await pool.query(
        `INSERT INTO blog_posts (slug, title, excerpt, content, category, cover_photo, related_service_slug, status, published_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, 'published', now());`,
        [post.slug, post.title, post.excerpt, post.content, post.category, post.coverPhoto, post.relatedServiceSlug || null]
      );
      inserted++;
    }

    return res.status(200).json({ success: true, inserted, skipped: POSTS.length - inserted });
  } catch (err) {
    console.error("Seed blog posts error:", err);
    return res.status(500).json({ success: false, error: "Unexpected server error" });
  }
}
