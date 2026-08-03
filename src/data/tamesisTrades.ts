export interface TamesisTrade {
  slug: string; // used as /tamesis-{slug}
  tradeName: string; // "Plumber", "Handyman", etc.
  mainServiceSlug: string; // links back to the full /services/{slug} page
  mainServiceName: string; // exact service.name for presetService matching
  metaDescription: string;
  heroSubtitle: string;
  scope: string[]; // short bullet list, distinct wording from the main service page
  whyTamesis: { title: string; body: string }[]; // 3 distinct trust points
  faqs: { q: string; a: string }[];
}

export const tamesisTrades: TamesisTrade[] = [
  {
    slug: "plumber",
    tradeName: "Plumber",
    mainServiceSlug: "plumbing",
    mainServiceName: "Plumbing and Drainage",
    metaDescription:
      "Tamesis Plumber — directly employed, Gas Safe registered plumbers across London. Emergency call-outs, blocked drains, leak detection, fixed pricing.",
    heroSubtitle:
      "Directly employed plumbers, not a subcontractor network — emergency call-outs, blocked drains, and general repairs across every London borough.",
    scope: [
      "Emergency call-outs, day or night",
      "Blocked and slow-running drains",
      "Dripping taps, running toilets, low pressure",
      "Landlord gas safety checks and CP12 certificates",
      "Leak detection without unnecessary damage",
    ],
    whyTamesis: [
      { title: "One team, not a directory", body: "When you call Tamesis, a Tamesis engineer turns up — not whoever's free from a subcontractor pool that day. That consistency shows in the standard of work." },
      { title: "Fixed price before we start", body: "No surprises once the van's outside. We confirm the cost, then do the work — the same price whether the job takes forty minutes or two hours." },
      { title: "Landlord and letting agent experience", body: "A large part of our plumbing work is for landlords, letting agents, and housing associations managing multiple properties — we understand compliance deadlines, not just individual repairs." },
    ],
    faqs: [
      { q: "Is Tamesis Gas Safe registered?", a: "Yes — our engineers working on gas appliances and installations are Gas Safe registered, and we can provide documentation on request." },
      { q: "Do you cover emergencies outside normal hours?", a: "Yes, our emergency plumbing line responds to burst pipes, flooding, and no-heat situations outside standard working hours." },
      { q: "Can you manage plumbing across a whole portfolio of rental properties?", a: "Yes — this is a significant part of our work for landlords and letting agents, with a single point of contact across every property rather than a different tradesperson per address." },
    ],
  },
  {
    slug: "handyman",
    tradeName: "Handyman",
    mainServiceSlug: "handyman",
    mainServiceName: "Handyman Services",
    metaDescription:
      "Tamesis Handyman — directly employed handyman services across London. Furniture assembly, IKEA installation, TV mounting, gutter cleaning and general odd jobs.",
    heroSubtitle:
      "One reliable team for the jobs that don't fit anywhere else — furniture assembly, TV mounting, gutter cleaning, and every small job in between.",
    scope: [
      "IKEA and flat-pack furniture assembly",
      "TV mounting and shelving",
      "Gutter cleaning and minor repairs",
      "Small plumbing and electrical fixes",
      "Painting touch-ups and general odd jobs",
    ],
    whyTamesis: [
      { title: "Batch your list into one visit", body: "Most households build up a list of small jobs over time. We work through the whole list in a single visit rather than needing a separate booking for each item." },
      { title: "Honest about scope", body: "If something genuinely needs a Gas Safe engineer or a qualified electrician rather than a handyman, we'll tell you — not take it on regardless." },
      { title: "The same standard on every job, small or large", body: "A shelf gets the same care as a full furniture-assembly day — wall fixings done properly, nothing rushed to move to the next item." },
    ],
    faqs: [
      { q: "What's the minimum job you'll take on?", a: "There's a one-hour minimum charge, but we're happy to take on a single small job — it's just usually better value to batch several together into one visit." },
      { q: "Do you assemble IKEA furniture specifically?", a: "Yes, it's one of our most requested jobs — see our dedicated guide to IKEA and flat-pack assembly for more detail." },
      { q: "Can you fix things to the wall securely, even on older properties?", a: "Yes — we work across London's full mix of wall types, from Victorian lath-and-plaster to modern plasterboard-on-dabs, and use the right fixing for each." },
    ],
  },
  {
    slug: "electrician",
    tradeName: "Electrician",
    mainServiceSlug: "electrical",
    mainServiceName: "Electrical Services",
    metaDescription:
      "Tamesis Electrician — qualified electricians across London for fault finding, rewiring, EICR certificates, and landlord electrical compliance.",
    heroSubtitle:
      "Qualified electricians for fault finding, rewiring, and landlord electrical certificates — directly employed, not subcontracted.",
    scope: [
      "Fault finding and diagnosis",
      "Rewiring and consumer unit upgrades",
      "EICR certificates for landlords",
      "Socket, switch, and light fitting installation",
      "Smoke and carbon monoxide alarm installation",
    ],
    whyTamesis: [
      { title: "Qualified and directly employed", body: "Our electricians are qualified to the standard required for domestic and rental-property work, employed directly by Tamesis rather than sourced per job." },
      { title: "Compliance-focused for landlords", body: "EICR certificates are a legal requirement for private landlords in England, renewed at least every five years — we handle this as routine, scheduled work, not just reactive call-outs." },
      { title: "Clear fault diagnosis before any work starts", body: "We explain what's actually wrong and what it'll cost to fix before starting, rather than an open-ended hourly job with no clear endpoint." },
    ],
    faqs: [
      { q: "Do you provide EICR certificates for rental properties?", a: "Yes — Electrical Installation Condition Reports are one of our most regular jobs for landlords, and we can advise on renewal timing to keep you compliant." },
      { q: "Can you take on a full rewire?", a: "Yes, from a single room to a full property rewire, with a clear scope and price agreed before work starts." },
      { q: "Do you install smoke and carbon monoxide alarms?", a: "Yes — required by law in rental properties, and something we're often asked to check and update as part of a wider compliance visit." },
    ],
  },
  {
    slug: "carpenter",
    tradeName: "Carpenter",
    mainServiceSlug: "carpentry-joinery",
    mainServiceName: "Carpentry and Joinery",
    metaDescription:
      "Tamesis Carpenter — a local carpenter near you across London. Doors, skirting, staircase repairs, fitted furniture, and general woodwork.",
    heroSubtitle:
      "Looking for a carpenter near you? Skilled carpentry and joinery, from a sticking door to fitted storage — directly employed tradespeople, fixed pricing agreed upfront.",
    scope: [
      "Door hanging, adjustment and repair",
      "Skirting boards and architrave",
      "Staircase and floorboard repairs",
      "Fitted wardrobes and bespoke joinery",
      "General woodwork and timber repairs",
    ],
    whyTamesis: [
      { title: "Matched to your property, not generic", body: "London's housing stock varies enormously — Victorian conversions, period terraces, modern builds. We match materials and technique to the actual property rather than a one-size approach." },
      { title: "Finish matters as much as function", body: "A door that closes properly and looks right sitting in its frame — we treat the finishing detail as part of the job, not an optional extra." },
      { title: "One call for the whole job", body: "Carpentry often overlaps with other trades — we coordinate directly rather than leaving you to manage separate bookings for each part of a job." },
    ],
    faqs: [
      { q: "Can you fix a door that's sticking or won't close properly?", a: "Yes — this is one of our most common carpentry call-outs, usually a quick adjustment rather than a full replacement." },
      { q: "Do you build bespoke fitted furniture?", a: "Yes, including fitted wardrobes and alcove shelving, built to the specific dimensions of the room." },
      { q: "Can you repair an old staircase rather than replace it?", a: "In most cases, yes — repair is usually more cost-effective than replacement unless the damage is extensive, and we'll advise honestly on which makes sense." },
    ],
  },
  {
    slug: "tiler",
    tradeName: "Tiler",
    mainServiceSlug: "tiling",
    mainServiceName: "Wall and Floor Tiling",
    metaDescription:
      "Tamesis Tiler — professional wall and floor tiling across London. Bathrooms, wet rooms, kitchen splashbacks, and re-grouting.",
    heroSubtitle:
      "Wall and floor tiling done properly — bathrooms, wet rooms, and kitchens, with waterproofing that's built in, not an afterthought.",
    scope: [
      "Bathroom and wet room tiling",
      "Kitchen splashback tiling",
      "Floor tiling and levelling",
      "Re-grouting and tile repairs",
      "Waterproofing (tanking) for wet areas",
    ],
    whyTamesis: [
      { title: "Waterproofing done properly, every time", body: "Tiling that looks good but leaks behind the wall is a false economy. We tank wet areas properly before a single tile goes up, not as a corner cut to save time." },
      { title: "Straight lines, level floors", body: "Uneven floors and out-of-square walls are common in older London properties — we address the substrate first rather than tiling over a problem that'll show later." },
      { title: "Repairs, not just full re-tiles", body: "A cracked tile or failing grout doesn't always need a full re-tile — we'll tell you honestly when a repair is the sensible option." },
    ],
    faqs: [
      { q: "Do you tile wet rooms specifically?", a: "Yes — wet rooms need proper tanking and falls to the drain, which is a different job from standard bathroom tiling, and something we handle regularly." },
      { q: "Can you match new tiling to an existing pattern?", a: "In most cases yes, though matching an exact discontinued tile isn't always possible — we'll be upfront if a perfect match isn't realistic." },
      { q: "Do you re-grout without removing tiles?", a: "Yes, for tiles that are otherwise sound — re-grouting is usually quicker and more cost-effective than a full re-tile." },
    ],
  },
  {
    slug: "decorator",
    tradeName: "Decorator",
    mainServiceSlug: "painting-decorating",
    mainServiceName: "Painting and Decorating",
    metaDescription:
      "Tamesis Decorator — a local decorator near you across London. Interior and exterior painting and decorating, proper preparation, lasting finish.",
    heroSubtitle:
      "Looking for a decorator near you? Interior and exterior painting and decorating — proper preparation for a finish that lasts, not just looks good on the day.",
    scope: [
      "Interior painting, room by room or whole property",
      "Exterior painting and render",
      "Wallpaper hanging",
      "Ceiling painting and repairs",
      "Landlord redecoration between tenancies",
    ],
    whyTamesis: [
      { title: "Preparation is most of the job", body: "A good paint finish is mostly about what happens before the paint goes on — filling, sanding, and priming properly. We don't skip this to move faster." },
      { title: "Landlord turnaround work", body: "Redecorating between tenancies is a large part of what we do — coordinated efficiently so a property is ready for the next let without unnecessary delay." },
      { title: "Colour matching that actually matches", body: "Touch-ups and partial repaints are only worth doing if the colour genuinely matches — we take this seriously rather than treating it as close enough." },
    ],
    faqs: [
      { q: "Can you match an existing paint colour without the original tin?", a: "In most cases yes, using colour-matching against a sample from the wall — though very old or faded paint can be harder to match exactly." },
      { q: "Do you handle exterior painting on period properties?", a: "Yes, including render and traditional finishes common on Victorian and Edwardian properties across London." },
      { q: "Can you turn around a rental property between tenants quickly?", a: "Yes — this is regular work for us with landlords and letting agents, and we can usually work to a tight turnaround window." },
    ],
  },
  {
    slug: "bathroom-fitter",
    tradeName: "Bathroom Fitter",
    mainServiceSlug: "bathroom-refurbishment",
    mainServiceName: "Bathroom and Kitchen Repairs & Installations",
    metaDescription:
      "Tamesis Bathroom Fitter — bathroom and kitchen fitting, refurbishment and repairs across London. Directly employed engineers, fixed pricing.",
    heroSubtitle:
      "Bathroom and kitchen fitting and refurbishment — coordinated across plumbing, tiling, and electrics, with one team responsible for the whole job.",
    scope: [
      "Full and partial bathroom refurbishment",
      "Kitchen unit and worktop fitting",
      "Shower and wet room installation",
      "Bathroom suite replacement",
      "Coordinated plumbing, tiling and electrics in one project",
    ],
    whyTamesis: [
      { title: "One team across the whole job", body: "Bathroom and kitchen refurbishment touches several trades — plumbing, tiling, electrics. We coordinate this internally rather than you managing separate tradespeople." },
      { title: "Realistic timelines, not optimistic ones", body: "We give a genuine estimate of how long a refurbishment will take, including the parts that aren't visible — first-fix plumbing and electrics before anything looks finished." },
      { title: "Fixed price agreed before work starts", body: "A full refurbishment is a significant cost — we confirm it clearly upfront rather than letting it grow as the job progresses." },
    ],
    faqs: [
      { q: "Can you manage a full bathroom refurbishment from start to finish?", a: "Yes — this is one of our core services, coordinating plumbing, tiling, and electrical work as a single project with one point of contact." },
      { q: "Do you fit kitchens as well as bathrooms?", a: "Yes, including unit and worktop fitting, and coordinating any plumbing or electrical work the kitchen needs." },
      { q: "How long does a typical bathroom refurbishment take?", a: "A full refurbishment typically runs one to two weeks depending on scope — we'll give a realistic timeline specific to your project before work starts." },
    ],
  },
  {
    slug: "flooring-fitter",
    tradeName: "Flooring Fitter",
    mainServiceSlug: "flooring-repairs",
    mainServiceName: "Flooring and Subfloor Repairs",
    metaDescription:
      "Tamesis Flooring Fitter — flooring installation and subfloor repairs across London. Vinyl, laminate, wood flooring and floor levelling.",
    heroSubtitle:
      "Flooring installation and subfloor repairs — the preparation work most fitters skip is the part we won't cut corners on.",
    scope: [
      "Vinyl, laminate and engineered wood flooring",
      "Subfloor repair and levelling",
      "Floorboard repairs",
      "Screed floor preparation",
      "Damp-affected subfloor remediation",
    ],
    whyTamesis: [
      { title: "The subfloor gets checked, not assumed", body: "New flooring over an uneven or damp subfloor fails early, regardless of the flooring quality. We check and prepare the subfloor properly before anything goes down." },
      { title: "Right flooring for the room", body: "Not every flooring type suits every space — we'll advise honestly on what holds up in a bathroom, hallway, or high-traffic area rather than just fitting what's been ordered." },
      { title: "Minimal disruption", body: "Flooring work affects a whole room's usability — we plan the sequence to minimise how long any space is out of action." },
    ],
    faqs: [
      { q: "Can you fit flooring over an uneven subfloor?", a: "Not without levelling it first — an uneven subfloor causes flooring to fail early, so levelling is part of the job rather than an optional extra." },
      { q: "Do you repair floorboards rather than replace the whole floor?", a: "Yes, where the damage is localised — a full replacement isn't always necessary, and we'll advise on the most sensible option." },
      { q: "Can you deal with a subfloor that's been affected by damp?", a: "Yes — this needs the underlying damp issue addressed first, which we can coordinate as part of the same visit where relevant." },
    ],
  },
  {
    slug: "damp-specialist",
    tradeName: "Damp Specialist",
    mainServiceSlug: "damp-mould",
    mainServiceName: "Damp and Mould Remedial Works",
    metaDescription:
      "Tamesis Damp Specialist — damp diagnosis and mould remediation across London. We identify the real cause, not just treat the symptom.",
    heroSubtitle:
      "Damp diagnosis and mould treatment that starts with finding the actual cause — not just painting over the symptom.",
    scope: [
      "Damp diagnosis and cause identification",
      "Rising, penetrating and condensation damp treatment",
      "Mould remediation",
      "Damp proof course installation",
      "Landlord damp compliance and reporting",
    ],
    whyTamesis: [
      { title: "Diagnosis before treatment", body: "Damp has several distinct causes that need different fixes. We identify which one is actually present before recommending treatment, rather than applying a generic solution." },
      { title: "Aware of Awaab's Law and current standards", body: "For social housing and rental properties, damp and mould are increasingly subject to fixed response timeframes — we understand this regulatory context, not just the treatment itself." },
      { title: "Honest about what won't fix it", body: "Some damp is a ventilation or lifestyle issue rather than a structural one — we'll say so rather than recommending unnecessary remedial work." },
    ],
    faqs: [
      { q: "How do you know which type of damp I have?", a: "Through inspection and, where needed, moisture readings — rising, penetrating, and condensation damp look similar but need different treatments, so getting this right matters." },
      { q: "Can you treat mould without addressing the underlying cause?", a: "We can remove existing mould, but treating the cause is the only way to stop it returning — we'll always identify and address both." },
      { q: "Do you work with landlords on damp compliance?", a: "Yes, including reporting and remedial work in line with current expectations around damp and mould response times in rented property." },
    ],
  },
  {
    slug: "fencing-contractor",
    tradeName: "Fencing Contractor",
    mainServiceSlug: "fencing-external-repairs",
    mainServiceName: "Fencing and External Repairs",
    metaDescription:
      "Tamesis Fencing Contractor — garden fencing, gates and external repairs across London. Directly employed engineers, fixed pricing.",
    heroSubtitle:
      "Garden fencing, gates and external repairs — built to handle London weather, not just look right on the day it's installed.",
    scope: [
      "Fence panel and post installation and repair",
      "Gate installation and repair",
      "Retaining and garden wall repairs",
      "Decking-adjacent external repairs",
      "Boundary fencing for landlords and property managers",
    ],
    whyTamesis: [
      { title: "Posts set properly, not just fast", body: "A fence is only as good as its posts. We set them with proper depth and concrete rather than the minimum needed to pass a quick look." },
      { title: "Built for the actual ground conditions", body: "Drainage and soil type affect how a fence holds up over time — we account for the specific garden rather than a generic installation." },
      { title: "Works for landlords managing multiple properties", body: "Boundary and external repairs are a common landlord request — we handle these as part of a wider property maintenance relationship where needed." },
    ],
    faqs: [
      { q: "Do you replace individual fence panels or only full runs?", a: "Either — a single damaged panel doesn't always need the whole fence replaced, and we'll assess honestly which makes sense." },
      { q: "How long should a properly installed fence last?", a: "With posts set correctly and appropriate materials, a well-installed timber fence should reasonably last ten to fifteen years, depending on exposure and ground conditions." },
      { q: "Can you repair a garden wall as well as fencing?", a: "Yes, including retaining walls and general garden wall repairs alongside fencing work." },
    ],
  },
  {
    slug: "leak-detection-specialist",
    tradeName: "Leak Detection Specialist",
    mainServiceSlug: "leak-detection",
    mainServiceName: "Leak Detection and Investigations",
    metaDescription:
      "Tamesis Leak Detection Specialist — non-invasive leak detection across London. Find the source without unnecessary damage to your property.",
    heroSubtitle:
      "Non-invasive leak detection — finding the actual source of a hidden leak without opening up more of your property than necessary.",
    scope: [
      "Hidden pipe leak detection",
      "Unexplained damp patch investigation",
      "Rising water bill diagnosis",
      "Thermal imaging and non-invasive detection methods",
      "Detailed reporting for insurance claims",
    ],
    whyTamesis: [
      { title: "Proper equipment, not guesswork", body: "Non-invasive detection methods find the source without unnecessary damage — a genuinely different approach from opening up walls or floors to search by hand." },
      { title: "Clear reporting", body: "For anything involving an insurance claim, documented findings matter — we provide a clear account of what was found and where." },
      { title: "We fix what we find", body: "Detection and repair are handled by the same team, so there's no gap between diagnosing the problem and actually resolving it." },
    ],
    faqs: [
      { q: "How does non-invasive leak detection actually work?", a: "Using methods such as thermal imaging and acoustic detection to locate a leak's likely source before any opening-up work, minimising unnecessary damage to walls or floors." },
      { q: "My water bill has gone up with no obvious cause — can you help?", a: "Yes, this is one of the more common reasons people contact us — an unexplained bill increase is a classic sign of a hidden leak." },
      { q: "Can you provide a report for an insurance claim?", a: "Yes, we can document findings clearly to support a claim where a leak has caused damage." },
    ],
  },
  {
    slug: "property-maintenance-company",
    tradeName: "Property Maintenance Company",
    mainServiceSlug: "responsive-repairs",
    mainServiceName: "Responsive Property Repairs",
    metaDescription:
      "Tamesis — a directly employed property maintenance company serving London. Responsive repairs for landlords, letting agents and housing associations.",
    heroSubtitle:
      "A single, reliable maintenance contractor across your whole portfolio — responsive repairs handled consistently, property by property.",
    scope: [
      "Reactive repairs across residential portfolios",
      "Single point of contact for multiple properties",
      "Compliance-aware reporting for landlords and agents",
      "Coordinated multi-trade repairs",
      "Consistent response times across a portfolio",
    ],
    whyTamesis: [
      { title: "One contractor, every property", body: "Managing a different local tradesperson per address doesn't scale. We provide one consistent point of contact across an entire portfolio." },
      { title: "Directly employed, not a subcontractor panel", body: "The standard of work stays consistent because the same team is responsible for it, rather than whoever's available from a wider network." },
      { title: "Built for landlords and housing associations", body: "A significant part of our work is with housing associations, letting agents, and landlords managing multiple properties — we understand reporting and compliance needs, not just individual repairs." },
    ],
    faqs: [
      { q: "Do you work with housing associations and letting agents, not just individual landlords?", a: "Yes — this is a core part of our business, including planned and reactive maintenance contracts across residential portfolios." },
      { q: "Can you provide a single point of contact across multiple properties?", a: "Yes, that's specifically how we're structured to work for landlords and agents managing more than one property." },
      { q: "What kind of reporting do you provide for property managers?", a: "Clear documentation of work carried out, useful for both your own records and any compliance reporting a housing association or agent might need." },
    ],
  },
  {
    slug: "building-maintenance-company",
    tradeName: "Building Maintenance Company",
    mainServiceSlug: "general-building-maintenance",
    mainServiceName: "General Building Maintenance",
    metaDescription:
      "Tamesis — a London building maintenance company handling planned and general maintenance contracts for landlords, agents and housing associations.",
    heroSubtitle:
      "Planned and general building maintenance — scheduled work that prevents problems, not just reactive fixes after something's already gone wrong.",
    scope: [
      "Planned preventative maintenance contracts",
      "General building upkeep and inspections",
      "Multi-trade coordination for larger properties",
      "Scheduled maintenance for housing associations",
      "Communal area maintenance for blocks and estates",
    ],
    whyTamesis: [
      { title: "Planned work costs less than reactive work", body: "A scheduled maintenance visit catching a small issue is consistently cheaper than an emergency call-out once it's become a bigger problem — we build maintenance schedules around this principle." },
      { title: "Experience with larger buildings and estates", body: "Communal areas and larger properties bring different considerations than a single home — access, resident communication, and phased work — which we're set up to handle." },
      { title: "Consistent contractor relationship over time", body: "Building maintenance works best as an ongoing relationship, not a series of one-off jobs — we aim to be the same team a property or portfolio calls on year after year." },
    ],
    faqs: [
      { q: "Do you offer planned maintenance contracts, or only reactive work?", a: "Both — planned maintenance contracts are a significant part of our work, particularly for housing associations and managed blocks." },
      { q: "Can you maintain communal areas in a block of flats?", a: "Yes, including communal repairs and general upkeep coordinated with the managing agent or freeholder." },
      { q: "How does planned maintenance actually save money?", a: "Catching issues early through scheduled inspection is consistently cheaper than waiting for an emergency — a small roof repair now versus water damage after it's been left, for example." },
    ],
  },
  {
    slug: "refurbishment-company",
    tradeName: "Refurbishment Company",
    mainServiceSlug: "void-refurbishment",
    mainServiceName: "Void Property Refurbishments",
    metaDescription:
      "Tamesis — a London refurbishment company specialising in void property turnaround for housing associations, landlords and letting agents.",
    heroSubtitle:
      "Void property refurbishment with turnaround speed that matters — every empty day between tenancies is a cost, and we plan around that.",
    scope: [
      "Full void property refurbishment",
      "Fast turnaround between tenancies",
      "Multi-trade coordination in a single project",
      "Compliance checks as part of the refurbishment",
      "Housing association void programmes",
    ],
    whyTamesis: [
      { title: "Turnaround speed is the whole point", body: "A void property earns nothing while it's empty. We plan refurbishment work specifically to minimise that gap, not just to complete the job eventually." },
      { title: "One project, multiple trades, one team", body: "Void refurbishment typically needs several trades — we coordinate this internally so nothing waits on a separate booking." },
      { title: "Experience with housing association void programmes", body: "A significant part of our work is void turnaround for housing associations, where consistent quality and turnaround time across many properties matters as much as any single job." },
    ],
    faqs: [
      { q: "How quickly can you turn around a void property?", a: "It depends on scope, but our whole process is built around minimising void periods — we'll give a realistic timeline specific to the property's condition before starting." },
      { q: "Do you work on housing association void programmes at scale?", a: "Yes, this is a core part of our work, including recurring void refurbishment across a housing association's stock rather than one-off jobs." },
      { q: "What's typically included in a void refurbishment?", a: "It varies by property condition, but commonly includes redecoration, repairs, compliance checks (gas, electrical), and general making-good before re-letting." },
    ],
  },
];
