export const company = {
  name: "Tamesis Development Ltd",
  shortName: "Tamesis",
  founded: 2019,
  addressLines: ["Upper Level", "48 Fulham High Street", "London", "SW6 3LQ"],
  phoneManagement: "020 3592 0042",
  phoneJobBooking: "020 3488 3737",
  whatsapp: "07379 021500",
  email: "info@tamesisdevelopment.co.uk",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Sectors", href: "/sectors" },
  { label: "Projects", href: "/projects" },
  { label: "Reviews", href: "/reviews" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 3500, suffix: "+", label: "Completed Repairs" },
  { value: 535, suffix: "+", label: "Verified Reviews" },
  { value: 4.6, suffix: "", label: "Average Rating", decimals: 1 },
  { value: 17, suffix: "", label: "Operational Teams" },
  { value: 7, suffix: "+", label: "Years Serving London" },
];

export const serviceCategories = [
  "Repairs & Maintenance",
  "Plumbing & Drainage",
  "Bathrooms & Interiors",
  "Building & Specialist",
] as const;

export const services = [
  {
    name: "Responsive Property Repairs",
    slug: "responsive-repairs",
    icon: "Wrench",
    category: "Repairs & Maintenance",
    overview:
      "At Tamesis Development Ltd, we provide fast, reliable, and high-quality responsive repair services across London. Our experienced teams attend emergency and routine maintenance issues promptly, ensuring properties are restored safely and efficiently while minimising disruption to residents. We understand the importance of meeting service level agreements (SLAs) and maintaining excellent resident satisfaction.",
    whatWeDo: [
      "Emergency and routine repairs",
      "Internal and external property maintenance",
      "Building fabric repairs",
      "Minor structural repairs",
      "Health and safety remedial works",
      "Planned follow-on repairs",
    ],
  },
  {
    name: "General Building Maintenance",
    slug: "general-building-maintenance",
    icon: "Building2",
    category: "Repairs & Maintenance",
    overview:
      "Tamesis Development Ltd offers complete building maintenance services designed to keep residential properties safe, compliant, and in excellent condition. Our experienced multi-trade teams deliver planned and reactive maintenance across all aspects of building fabric and internal finishes.",
    whatWeDo: [
      "Multi-trade maintenance",
      "Planned preventative maintenance",
      "Building fabric repairs",
      "Minor building works",
      "Internal and external maintenance",
      "Property inspections",
      "General repair works",
    ],
  },
  {
    name: "Void Property Refurbishments",
    slug: "void-refurbishment",
    icon: "KeyRound",
    category: "Repairs & Maintenance",
    overview:
      "We provide comprehensive void property refurbishment services to prepare homes for new tenants quickly and efficiently. Our coordinated approach reduces turnaround times while ensuring properties meet required standards.",
    whatWeDo: [
      "Full property refurbishment",
      "Repairs following tenancy termination",
      "Decorating",
      "Flooring replacement",
      "Kitchen and bathroom repairs",
      "Plumbing and electrical works",
      "Final cleaning and handover preparation",
    ],
  },
  {
    name: "General Construction",
    slug: "construction",
    icon: "HardHat",
    category: "Repairs & Maintenance",
    hideFromMegaMenu: true,
  },
  {
    name: "Handyman Services",
    slug: "handyman",
    icon: "Toolbox",
    category: "Repairs & Maintenance",
    overview:
      "Our handyman service covers the small, practical jobs that build up around any home or property — the kind of list that's too varied for a single specialist but still deserves properly trained, directly employed engineers rather than a one-off tradesperson found online. From furniture assembly to gutter cleaning to small plumbing, electrical, and painting jobs, we bundle your list into a single, efficient visit wherever possible.",
    whatWeDo: [
      "Furniture assembly (flat-pack, wardrobes, TV units)",
      "Shelving, TV mounting, and picture or mirror hanging",
      "Gutter cleaning and maintenance",
      "Minor plumbing repairs (taps, toilets, small leaks)",
      "Minor electrical jobs (light fittings, sockets, switches)",
      "Painting touch-ups and small decorating jobs",
      "Curtain rail and blind fitting",
      "Door and cabinet adjustments, minor carpentry",
      "General odd jobs and property to-do lists",
    ],
  },
  {
    name: "Plumbing and Drainage",
    slug: "plumbing",
    icon: "Droplets",
    category: "Plumbing & Drainage",
    overview:
      "Our qualified plumbers and drainage specialists deliver comprehensive plumbing and drainage solutions for residential and social housing properties. From minor repairs to complete system replacements, we ensure all works are completed to the highest standard with minimal disruption.",
    whatWeDo: [
      "Plumbing repairs and installations",
      "WC, basin, bath and sink repairs",
      "Pipework repairs and replacements",
      "Drain unblocking and cleaning",
      "Waste pipe repairs",
      "Soil stack repairs",
      "Water supply pipe repairs",
    ],
  },
  {
    name: "Leak Detection and Investigations",
    slug: "leak-detection",
    icon: "Search",
    category: "Plumbing & Drainage",
    overview:
      "Water leaks can cause significant damage if left unresolved. Our experienced engineers use proven investigation techniques to accurately identify the source of leaks, allowing effective repairs to be carried out quickly and efficiently.",
    whatWeDo: [
      "Leak investigations",
      "Internal water leak detection",
      "Hidden pipework inspections",
      "Roof and external water ingress investigations",
      "Moisture assessments",
      "Repair recommendations and reporting",
    ],
  },
  {
    name: "Bathroom and Kitchen Repairs & Installations",
    slug: "bathroom-refurbishment",
    icon: "Bath",
    category: "Bathrooms & Interiors",
    overview:
      "We undertake all aspects of bathroom and kitchen repairs, upgrades, and installations. Whether replacing individual components or carrying out complete refurbishments, our skilled tradespeople deliver durable, high-quality finishes.",
    whatWeDo: [
      "Bathroom repairs and refurbishment",
      "Kitchen repairs and upgrades",
      "Bath, shower and sanitaryware replacement",
      "Kitchen sink and worktop replacement",
      "Tap and waste replacements",
      "Silicone sealing and finishing",
    ],
  },
  {
    name: "Flooring and Subfloor Repairs",
    slug: "flooring-repairs",
    icon: "LayoutGrid",
    category: "Bathrooms & Interiors",
    overview:
      "Our flooring specialists install and repair a wide range of floor finishes for residential and commercial properties. We also repair damaged subfloors to ensure a solid, level foundation before new flooring is installed.",
    whatWeDo: [
      "Safety vinyl flooring",
      "Domestic vinyl flooring",
      "Laminate flooring",
      "Floor preparation",
      "Subfloor repairs",
      "Self-levelling compounds",
      "Floor covering replacements",
    ],
  },
  {
    name: "Wall and Floor Tiling",
    slug: "tiling",
    icon: "Grid3x3",
    category: "Bathrooms & Interiors",
    overview:
      "We provide professional wall and floor tiling services for kitchens, bathrooms, wet rooms, and communal areas. From isolated tile repairs to complete retiling projects, we deliver a durable and attractive finish.",
    whatWeDo: [
      "Wall tiling",
      "Floor tiling",
      "Tile replacement",
      "Grouting and regrouting",
      "Silicone sealing",
      "Wet room tiling",
    ],
  },
  {
    name: "Carpentry and Joinery",
    slug: "carpentry-joinery",
    icon: "Hammer",
    category: "Bathrooms & Interiors",
    overview:
      "Our experienced carpenters undertake a wide range of first and second fix carpentry works, delivering high-quality workmanship across responsive repairs, maintenance, and refurbishment projects.",
    whatWeDo: [
      "Door repairs and replacements",
      "Skirting boards and architraves",
      "Kitchen unit repairs",
      "Boxing-in pipework",
      "Shelving installation",
      "Timber repairs",
      "General joinery works",
    ],
  },
  {
    name: "Painting and Decorating",
    slug: "painting-decorating",
    icon: "PaintRoller",
    category: "Bathrooms & Interiors",
    overview:
      "Our decorating teams provide high-quality internal and external painting services for occupied and void properties, helping maintain attractive, durable, and well-presented homes.",
    whatWeDo: [
      "Internal decorating",
      "External painting",
      "Wall and ceiling preparation",
      "Woodwork painting",
      "Staining and varnishing",
      "Making good damaged surfaces",
      "Void property redecoration",
    ],
  },
  {
    name: "Damp and Mould Remedial Works",
    slug: "damp-mould",
    icon: "CloudRain",
    category: "Bathrooms & Interiors",
    overview:
      "We help landlords and housing providers address damp and mould issues by identifying contributing factors and carrying out effective remedial works to improve living conditions and protect properties.",
    whatWeDo: [
      "Damp inspections",
      "Mould treatment",
      "Anti-mould coatings",
      "Plaster repairs",
      "Ventilation improvements",
      "Moisture damage repairs",
      "Internal redecorations following treatment",
    ],
  },
  {
    name: "Fencing and External Repairs",
    slug: "fencing-external-repairs",
    icon: "Fence",
    category: "Building & Specialist",
    overview:
      "We carry out a wide range of external repair works to improve security, safety, and the appearance of residential properties and communal areas.",
    whatWeDo: [
      "Fence repairs and replacement",
      "Gate installation and repairs",
      "Timber fencing",
      "Garden boundary repairs",
      "External timber structures",
      "Minor external maintenance",
      "Path and access repairs",
    ],
  },
  {
    name: "Electrical Services",
    slug: "electrical",
    icon: "Zap",
    category: "Building & Specialist",
  },
  {
    name: "Insurance Reinstatement",
    slug: "insurance-reinstatement",
    icon: "ShieldCheck",
    category: "Building & Specialist",
    hideFromMegaMenu: true,
  },
  {
    name: "Commercial Refurbishment",
    slug: "commercial-refurbishment",
    icon: "Building",
    category: "Building & Specialist",
    hideFromMegaMenu: true,
  },
] as const;

// Old slugs that no longer have their own page after the services
// restructuring — each redirects (client-side) to the new consolidated
// service that now covers it, so old links/bookmarks/search results don't
// just 404.
export const retiredServiceRedirects: Record<string, string> = {
  "property-maintenance": "general-building-maintenance",
  "planned-maintenance": "general-building-maintenance",
  "drain-unblocking": "plumbing",
  "drain-repairs": "plumbing",
  "bathroom-repairs": "bathroom-refurbishment",
  "bathroom-installation": "bathroom-refurbishment",
};

export type Service = (typeof services)[number];

export function getServiceContent(service: Service) {
  const name = service.name;
  const lower = name.toLowerCase();

  // 12 of the 16 services now have real, client-authored overview/whatWeDo
  // copy directly on the service object (see `services` above) rather than
  // the generated boilerplate below — the 4 retained legacy services
  // (Electrical, Insurance Reinstatement, Commercial Refurbishment, General
  // Construction) don't have custom copy yet, so they still fall back to it.
  const custom = service as { overview?: string; whatWeDo?: readonly string[] };

  return {
    overview:
      custom.overview ??
      `Need reliable ${lower} in London? Our directly employed engineers — not a loose network of subcontractors — assess the job, give you a clear fixed-price quote, and get it done properly, first time. From a single reported issue to a portfolio-wide programme of works, we deliver ${lower} to a consistent standard across every London borough.`,
    whatWeDo: custom.whatWeDo ?? [
      `Fast initial assessment and diagnosis of the ${lower} issue or requirement`,
      "A clear, fixed-price quotation before any work begins — no surprise costs",
      "Work carried out by our own directly employed engineers, not subcontractors",
      "Protection of the property and a full clean-up on completion",
      "A quality check and sign-off before we consider the job complete",
      "Follow-up support if anything needs revisiting",
    ],
    commonIssues: [
      `Emergency or urgent ${lower} requirements needing a fast response`,
      `Recurring or previously unresolved ${lower} problems`,
      `${name} required as part of a wider refurbishment or planned maintenance programme`,
      `${name} needed to satisfy an insurance claim or compliance requirement`,
    ],
    faqs: [
      {
        q: `How quickly can you respond for ${lower}?`,
        a: `Response times depend on urgency. Emergency ${lower} requests are prioritised and are typically actioned within hours; non-urgent work is scheduled with you in advance at a time that suits you.`,
      },
      {
        q: `Do you provide a fixed quote before starting ${lower} work?`,
        a: "Yes. We assess the work first and provide a clear, fixed-price quotation before anything begins, so you know the full cost upfront with no surprises.",
      },
      {
        q: "Are your engineers directly employed?",
        a: "Yes — all work is carried out by our own directly employed, experienced teams, not ad-hoc subcontractors, so you get a consistent standard of work every time.",
      },
      {
        q: `Do you work with housing associations and local authorities on ${lower}?`,
        a: `Yes, ${lower} is delivered both as standalone jobs for homeowners and landlords, and as part of larger contracts for housing associations, local authorities and managing agents.`,
      },
    ],
  };
}
export const sectors = [
  {
    name: "Housing Associations",
    slug: "housing-associations",
    icon: "Home",
    description: "Responsive repairs and planned maintenance delivered at scale, with full compliance reporting.",
  },
  {
    name: "Local Authorities",
    slug: "local-authorities",
    icon: "Landmark",
    description: "Framework-ready contracting for council housing stock and public buildings.",
  },
  {
    name: "Property Management Companies",
    slug: "property-management-companies",
    icon: "Building2",
    description: "A single reliable contractor across your entire managed portfolio.",
  },
  {
    name: "Commercial Clients",
    slug: "commercial-clients",
    icon: "Briefcase",
    description: "Refurbishment and maintenance that keeps commercial premises trading.",
  },
  {
    name: "Landlords",
    slug: "landlords",
    icon: "KeySquare",
    description: "Fast turnarounds on void works, repairs and compliance certificates.",
  },
  {
    name: "Residential Homeowners",
    slug: "residential-homeowners",
    icon: "House",
    description: "The same professional standard, brought to individual family homes.",
  },
] as const;

export const whyChoose = [
  { name: "Established Since 2019", icon: "CalendarClock" },
  { name: "Experienced Teams", icon: "Users" },
  { name: "Fast Response Times", icon: "Timer" },
  { name: "Fully Insured", icon: "ShieldCheck" },
  { name: "Health & Safety Focused", icon: "HardHat" },
  { name: "Excellent Customer Satisfaction", icon: "ThumbsUp" },
  { name: "London Wide Coverage", icon: "MapPin" },
  { name: "Reliable Communication", icon: "MessageSquare" },
  { name: "Quality Guaranteed", icon: "BadgeCheck" },
] as const;

export const projects = [
  { title: "Void Turnaround Programme", category: "Maintenance", location: "Hackney, London" },
  { title: "Full Bathroom Refurbishment", category: "Bathrooms", location: "Fulham, London" },
  { title: "Estate-Wide Planned Maintenance", category: "Maintenance", location: "Croydon, London" },
  { title: "Commercial Office Refit", category: "Commercial", location: "Southwark, London" },
  { title: "Insurance Reinstatement Works", category: "Repairs", location: "Wandsworth, London" },
  { title: "Multi-Unit Roof & Leak Repairs", category: "Repairs", location: "Camden, London" },
  { title: "Ensuite Bathroom Installation", category: "Bathrooms", location: "Chelsea, London" },
  { title: "Retail Unit Fit-Out", category: "Commercial", location: "Westminster, London" },
  { title: "Estate Extension & Groundworks", category: "Construction", location: "Greenwich, London" },
  { title: "Emergency Leak Response", category: "Repairs", location: "Islington, London" },
  { title: "Block Communal Area Refurbishment", category: "Maintenance", location: "Lewisham, London" },
  { title: "New-Build Internal Fit-Out", category: "Construction", location: "Barking, London" },
] as const;

export const projectFilters = ["All", "Bathrooms", "Repairs", "Maintenance", "Commercial", "Construction"] as const;

export const projectCategoryIcon: Record<string, string> = {
  Bathrooms: "Bath",
  Repairs: "Wrench",
  Maintenance: "CalendarCheck2",
  Commercial: "Building2",
  Construction: "HardHat",
};

export const process = [
  { step: "1", title: "Contact Us", description: "Call, email or submit a request and speak to our booking team." },
  { step: "2", title: "Survey & Assessment", description: "Our team assesses the work and provides a clear scope and quote." },
  { step: "3", title: "Complete the Work", description: "A dedicated team carries out the work to specification and on schedule." },
  { step: "4", title: "Quality Check & Follow Up", description: "We sign off every job and follow up to confirm satisfaction." },
] as const;

export const reviews = [
  {
    name: "S. Whitfield",
    rating: 5,
    project: "Bathroom Refurbishment",
    review: "Professional from the first call to the final walkthrough. The team kept us informed at every stage and left the property spotless.",
  },
  {
    name: "Riverside Housing Association",
    rating: 5,
    project: "Planned Maintenance Contract",
    review: "Tamesis manage a high volume of works orders for us with consistent quality and clear reporting. A dependable contracting partner.",
  },
  {
    name: "M. Adeyemi",
    rating: 5,
    project: "Emergency Leak Repair",
    review: "Had an emergency leak on a Sunday and an engineer was on site within hours. Fixed properly, not just patched.",
  },
  {
    name: "Grovewood Property Management",
    rating: 4,
    project: "Void Property Works",
    review: "Fast turnaround on void units across our portfolio, which keeps our re-letting times down. Communication is always clear.",
  },
  {
    name: "J. Okonkwo",
    rating: 5,
    project: "Kitchen & Bathroom Repairs",
    review: "Really tidy work and the engineer explained exactly what he was doing throughout. Would use Tamesis again without hesitation.",
  },
  {
    name: "Camden Facilities Team",
    rating: 5,
    project: "Commercial Refurbishment",
    review: "Delivered our office refit on time and around our operating hours with minimal disruption to staff. Excellent project management.",
  },
  {
    name: "R. Patel",
    rating: 4,
    project: "Drain Unblocking",
    review: "Quick response and fair pricing. Engineer arrived within the window given and sorted the blockage properly.",
  },
  {
    name: "Southbank Managing Agents",
    rating: 5,
    project: "Estate Planned Maintenance",
    review: "One of the few contractors who consistently hit their SLA targets across a large portfolio. Reporting is thorough and reliable.",
  },
  {
    name: "H. Fitzgerald",
    rating: 5,
    project: "Boiler & Heating Repair",
    review: "No heating on the coldest week of the year and they had someone out the same afternoon. Sorted it first visit, no drama.",
  },
  {
    name: "D. Nowak",
    rating: 5,
    project: "Painting & Decorating",
    review: "Whole flat repainted in three days, dust sheets everywhere and furniture properly protected. Finish was excellent.",
  },
  {
    name: "Wandsworth Lettings Agency",
    rating: 5,
    project: "Void Turnaround",
    review: "We use Tamesis across most of our managed properties now. Quotes are clear and jobs are rarely delayed.",
  },
  {
    name: "L. Barbosa",
    rating: 4,
    project: "Electrical Repairs",
    review: "Fuse box fault sorted quickly and the electrician talked me through what had actually gone wrong. Good value.",
  },
  {
    name: "T. Reeves-Osei",
    rating: 5,
    project: "Insurance Reinstatement",
    review: "Water damage after a burst pipe — Tamesis handled the whole reinstatement and liaised directly with our insurer, which took a lot off our plate.",
  },
  {
    name: "Islington Block Management",
    rating: 5,
    project: "Communal Area Refurbishment",
    review: "Managed a full communal refurbishment across three blocks with minimal disruption to residents. Would recommend for larger contracts.",
  },
  {
    name: "F. Ahmadi",
    rating: 5,
    project: "General Repairs",
    review: "Small jobs list I'd been putting off for months, all sorted in a single visit. Engineer was on time and easy to deal with.",
  },
] as const;

// All 32 London boroughs + the City of London, grouped by a practical
// north/south/east/west/central split for "areas we cover" content. This is
// an informal, commonly-used marketing grouping (adapted from a published
// London-areas breakdown), not an official government designation — several
// boroughs straddle boundaries and different sources group them differently.
export const londonRegions = [
  {
    region: "Central London",
    boroughs: ["City of London", "Westminster", "Kensington & Chelsea", "Camden", "Islington", "Lambeth", "Southwark"],
  },
  {
    region: "North London",
    boroughs: ["Barnet", "Enfield", "Haringey", "Waltham Forest", "Hackney"],
  },
  {
    region: "East London",
    boroughs: ["Tower Hamlets", "Newham", "Redbridge", "Barking & Dagenham", "Havering", "Bexley"],
  },
  {
    region: "South London",
    boroughs: ["Greenwich", "Lewisham", "Croydon", "Bromley", "Sutton", "Merton", "Kingston upon Thames", "Wandsworth"],
  },
  {
    region: "West London",
    boroughs: ["Hammersmith & Fulham", "Hounslow", "Richmond upon Thames", "Ealing", "Brent", "Harrow", "Hillingdon"],
  },
] as const;

// Boroughs that already have a dedicated area page (from `locations` below)
// — the borough name doesn't always exactly match the location slug (one
// borough can cover two of our existing area pages), so it's mapped
// explicitly rather than guessed.
export const boroughLinkMap: Record<string, string> = {
  Westminster: "westminster",
  Camden: "camden",
  Islington: "islington",
  Wandsworth: "wandsworth",
  "Hammersmith & Fulham": "fulham",
  "Kensington & Chelsea": "kensington",
};

// hasServiceCombos: true only for the original 8 areas, which also have
// dedicated /services/:service/:location combo pages. The newer neighbourhood
// entries deliberately don't get combo pages — a large volume of thin,
// near-identical templated pages (60 areas × 20 services) risks Google
// treating the site as generating "doorway pages" rather than helping it
// rank; these areas still get a full, genuinely useful area page, just
// without the combo-page multiplication.
export const locations = [
  { name: "Fulham", slug: "fulham", borough: "Hammersmith & Fulham", hasServiceCombos: true, note: "Home to our Fulham High Street office, so Fulham is where we can respond fastest." },
  { name: "Chelsea", slug: "chelsea", borough: "Kensington & Chelsea", hasServiceCombos: true, note: "Regular work in Chelsea's period conversions and high-spec residential properties." },
  { name: "Westminster", slug: "westminster", borough: "Westminster", hasServiceCombos: true, note: "Experience with both residential blocks and commercial premises across Westminster." },
  { name: "Kensington", slug: "kensington", borough: "Kensington & Chelsea", hasServiceCombos: true, note: "Repairs and refurbishment for Kensington homeowners, landlords and managing agents." },
  { name: "Hammersmith", slug: "hammersmith", borough: "Hammersmith & Fulham", hasServiceCombos: true, note: "Close to our Fulham base, with fast response times across Hammersmith." },
  { name: "Camden", slug: "camden", borough: "Camden", hasServiceCombos: true, note: "Planned maintenance and repairs for Camden's mix of residential and commercial stock." },
  { name: "Islington", slug: "islington", borough: "Islington", hasServiceCombos: true, note: "Regular work across Islington's period properties and managed developments." },
  { name: "Wandsworth", slug: "wandsworth", borough: "Wandsworth", hasServiceCombos: true, note: "Repairs, refurbishment and planned maintenance across Wandsworth." },

  // City of London
  { name: "Barbican", slug: "barbican", borough: "City of London", hasServiceCombos: false, note: "Maintenance for the Barbican's mix of residential estates and commercial premises." },

  // Westminster (additional)
  { name: "Mayfair", slug: "mayfair", borough: "Westminster", hasServiceCombos: false, note: "High-spec repairs and refurbishment for Mayfair's period townhouses and managed apartments." },
  { name: "Pimlico", slug: "pimlico", borough: "Westminster", hasServiceCombos: false, note: "Regular work across Pimlico's garden squares and period conversions." },

  // Kensington & Chelsea (additional)
  { name: "Notting Hill", slug: "notting-hill", borough: "Kensington & Chelsea", hasServiceCombos: false, note: "Repairs and refurbishment for Notting Hill's period terraces and communal buildings." },

  // Camden (additional)
  { name: "Primrose Hill", slug: "primrose-hill", borough: "Camden", hasServiceCombos: false, note: "Property maintenance for Primrose Hill's period homes and managed blocks." },

  // Islington (additional)
  { name: "Angel", slug: "angel", borough: "Islington", hasServiceCombos: false, note: "Repairs and planned maintenance across Angel's mix of period and modern developments." },

  // Lambeth
  { name: "Brixton", slug: "brixton", borough: "Lambeth", hasServiceCombos: false, note: "Property maintenance across Brixton's mix of Victorian terraces and modern developments." },
  { name: "Clapham", slug: "clapham", borough: "Lambeth", hasServiceCombos: false, note: "Repairs and refurbishment for Clapham's period conversions and family homes." },

  // Southwark
  { name: "Peckham", slug: "peckham", borough: "Southwark", hasServiceCombos: false, note: "Planned maintenance and repairs across Peckham's residential estates and terraces." },
  { name: "London Bridge", slug: "london-bridge", borough: "Southwark", hasServiceCombos: false, note: "Maintenance for London Bridge's mix of commercial premises and residential developments." },

  // Barnet
  { name: "Finchley", slug: "finchley", borough: "Barnet", hasServiceCombos: false, note: "Repairs and maintenance across Finchley's suburban family housing." },
  { name: "Hendon", slug: "hendon", borough: "Barnet", hasServiceCombos: false, note: "Property maintenance for Hendon's mix of houses and managed apartment blocks." },

  // Enfield
  { name: "Enfield Town", slug: "enfield-town", borough: "Enfield", hasServiceCombos: false, note: "Repairs and planned maintenance across Enfield Town's residential streets." },
  { name: "Southgate", slug: "southgate", borough: "Enfield", hasServiceCombos: false, note: "Property maintenance for Southgate's suburban family homes." },

  // Haringey
  { name: "Wood Green", slug: "wood-green", borough: "Haringey", hasServiceCombos: false, note: "Maintenance and repairs across Wood Green's mix of terraces and flats." },
  { name: "Crouch End", slug: "crouch-end", borough: "Haringey", hasServiceCombos: false, note: "Repairs and refurbishment for Crouch End's period conversions and family homes." },

  // Waltham Forest
  { name: "Walthamstow", slug: "walthamstow", borough: "Waltham Forest", hasServiceCombos: false, note: "Property maintenance across Walthamstow's Victorian terraces and new developments." },
  { name: "Chingford", slug: "chingford", borough: "Waltham Forest", hasServiceCombos: false, note: "Repairs and maintenance for Chingford's suburban family housing." },

  // Hackney
  { name: "Hackney Central", slug: "hackney-central", borough: "Hackney", hasServiceCombos: false, note: "Maintenance for Hackney Central's mix of period terraces and modern flats." },
  { name: "Dalston", slug: "dalston", borough: "Hackney", hasServiceCombos: false, note: "Repairs and refurbishment across Dalston's residential and commercial stock." },

  // Tower Hamlets
  { name: "Canary Wharf", slug: "canary-wharf", borough: "Tower Hamlets", hasServiceCombos: false, note: "Maintenance for Canary Wharf's managed apartment towers and commercial premises." },
  { name: "Bethnal Green", slug: "bethnal-green", borough: "Tower Hamlets", hasServiceCombos: false, note: "Repairs and planned maintenance across Bethnal Green's estates and terraces." },

  // Newham
  { name: "Stratford", slug: "stratford", borough: "Newham", hasServiceCombos: false, note: "Property maintenance for Stratford's mix of new developments and older housing stock." },
  { name: "East Ham", slug: "east-ham", borough: "Newham", hasServiceCombos: false, note: "Repairs and maintenance across East Ham's residential terraces." },

  // Redbridge
  { name: "Ilford", slug: "ilford", borough: "Redbridge", hasServiceCombos: false, note: "Property maintenance across Ilford's mix of family housing and managed flats." },
  { name: "Woodford", slug: "woodford", borough: "Redbridge", hasServiceCombos: false, note: "Repairs and refurbishment for Woodford's suburban family homes." },

  // Barking & Dagenham
  { name: "Barking", slug: "barking", borough: "Barking & Dagenham", hasServiceCombos: false, note: "Maintenance and repairs across Barking's residential estates." },
  { name: "Dagenham", slug: "dagenham", borough: "Barking & Dagenham", hasServiceCombos: false, note: "Property maintenance for Dagenham's family housing stock." },

  // Havering
  { name: "Romford", slug: "romford", borough: "Havering", hasServiceCombos: false, note: "Repairs and planned maintenance across Romford's residential streets." },
  { name: "Hornchurch", slug: "hornchurch", borough: "Havering", hasServiceCombos: false, note: "Property maintenance for Hornchurch's suburban family homes." },

  // Bexley
  { name: "Bexleyheath", slug: "bexleyheath", borough: "Bexley", hasServiceCombos: false, note: "Maintenance and repairs across Bexleyheath's residential estates." },
  { name: "Sidcup", slug: "sidcup", borough: "Bexley", hasServiceCombos: false, note: "Property maintenance for Sidcup's suburban family housing." },

  // Greenwich
  { name: "Greenwich", slug: "greenwich", borough: "Greenwich", hasServiceCombos: false, note: "Repairs and refurbishment across Greenwich's period properties and riverside developments." },
  { name: "Blackheath", slug: "blackheath", borough: "Greenwich", hasServiceCombos: false, note: "Property maintenance for Blackheath's period homes and managed buildings." },

  // Lewisham
  { name: "Lewisham", slug: "lewisham", borough: "Lewisham", hasServiceCombos: false, note: "Maintenance and repairs across Lewisham's mix of terraces and estates." },
  { name: "Catford", slug: "catford", borough: "Lewisham", hasServiceCombos: false, note: "Property maintenance for Catford's residential streets." },

  // Croydon
  { name: "Croydon", slug: "croydon", borough: "Croydon", hasServiceCombos: false, note: "Repairs and planned maintenance across Croydon's mix of residential and commercial stock." },
  { name: "Purley", slug: "purley", borough: "Croydon", hasServiceCombos: false, note: "Property maintenance for Purley's suburban family homes." },

  // Bromley
  { name: "Bromley", slug: "bromley", borough: "Bromley", hasServiceCombos: false, note: "Maintenance and repairs across Bromley's residential streets." },
  { name: "Beckenham", slug: "beckenham", borough: "Bromley", hasServiceCombos: false, note: "Property maintenance for Beckenham's period and suburban housing." },

  // Sutton
  { name: "Sutton", slug: "sutton", borough: "Sutton", hasServiceCombos: false, note: "Repairs and planned maintenance across Sutton's residential estates." },
  { name: "Cheam", slug: "cheam", borough: "Sutton", hasServiceCombos: false, note: "Property maintenance for Cheam's suburban family homes." },

  // Merton
  { name: "Wimbledon", slug: "wimbledon", borough: "Merton", hasServiceCombos: false, note: "Repairs and refurbishment across Wimbledon's period homes and managed developments." },
  { name: "Mitcham", slug: "mitcham", borough: "Merton", hasServiceCombos: false, note: "Property maintenance for Mitcham's residential streets." },

  // Kingston upon Thames
  { name: "Kingston upon Thames", slug: "kingston", borough: "Kingston upon Thames", hasServiceCombos: false, note: "Maintenance and repairs across Kingston's mix of riverside and residential properties." },
  { name: "Surbiton", slug: "surbiton", borough: "Kingston upon Thames", hasServiceCombos: false, note: "Property maintenance for Surbiton's period and suburban homes." },

  // Wandsworth (additional)
  { name: "Putney", slug: "putney", borough: "Wandsworth", hasServiceCombos: false, note: "Repairs and refurbishment for Putney's riverside developments and period homes." },

  // Hounslow
  { name: "Hounslow", slug: "hounslow", borough: "Hounslow", hasServiceCombos: false, note: "Maintenance and repairs across Hounslow's residential estates." },
  { name: "Chiswick", slug: "chiswick", borough: "Hounslow", hasServiceCombos: false, note: "Property maintenance for Chiswick's period homes and riverside developments." },

  // Richmond upon Thames
  { name: "Richmond", slug: "richmond", borough: "Richmond upon Thames", hasServiceCombos: false, note: "Repairs and refurbishment across Richmond's period properties and managed buildings." },
  { name: "Twickenham", slug: "twickenham", borough: "Richmond upon Thames", hasServiceCombos: false, note: "Property maintenance for Twickenham's residential streets." },

  // Ealing
  { name: "Ealing", slug: "ealing", borough: "Ealing", hasServiceCombos: false, note: "Maintenance and repairs across Ealing's mix of period terraces and modern flats." },
  { name: "Acton", slug: "acton", borough: "Ealing", hasServiceCombos: false, note: "Property maintenance for Acton's residential streets." },

  // Brent
  { name: "Wembley", slug: "wembley", borough: "Brent", hasServiceCombos: false, note: "Repairs and planned maintenance across Wembley's residential and commercial stock." },
  { name: "Willesden", slug: "willesden", borough: "Brent", hasServiceCombos: false, note: "Property maintenance for Willesden's residential streets." },

  // Harrow
  { name: "Harrow", slug: "harrow", borough: "Harrow", hasServiceCombos: false, note: "Maintenance and repairs across Harrow's suburban family housing." },
  { name: "Pinner", slug: "pinner", borough: "Harrow", hasServiceCombos: false, note: "Property maintenance for Pinner's period and suburban homes." },

  // Hillingdon
  { name: "Uxbridge", slug: "uxbridge", borough: "Hillingdon", hasServiceCombos: false, note: "Repairs and planned maintenance across Uxbridge's residential estates." },
  { name: "Hayes", slug: "hayes", borough: "Hillingdon", hasServiceCombos: false, note: "Property maintenance for Hayes's residential streets." },
] as const;

export type Location = (typeof locations)[number];

export function getLocationContent(location: Location) {
  return {
    overview: `Tamesis Development Ltd provides property maintenance, repairs, refurbishment and construction services across ${location.name}. ${location.note} Whether it's a single reported repair or an ongoing planned maintenance contract, our directly employed engineers deliver the same professional standard throughout ${location.name}.`,
    whyChooseLocal: [
      `Local response times across ${location.name} and the surrounding area`,
      "Directly employed engineers, not ad-hoc subcontractors",
      "Work for housing associations, local authorities, managing agents, landlords and homeowners",
      "Clear, fixed quotes before any work begins",
    ],
    faqs: [
      {
        q: `Do you cover all of ${location.name}?`,
        a: `Yes — ${location.name} is within our regular working area and we take on both one-off repairs and ongoing planned maintenance contracts here.`,
      },
      {
        q: `How quickly can you respond to a job in ${location.name}?`,
        a: `Emergency requests in ${location.name} are prioritised and typically actioned within hours; non-urgent work is scheduled with you in advance at a time that suits you.`,
      },
      {
        q: `Do you work with housing associations and managing agents in ${location.name}?`,
        a: `Yes — alongside individual homeowner and landlord jobs, we deliver planned maintenance contracts in ${location.name} for housing associations, local authorities, managing agents and commercial clients.`,
      },
      {
        q: "Do you provide a fixed quote before starting work?",
        a: "Yes. We assess the work first and provide a clear, fixed-price quotation before anything begins, so you know the full cost upfront.",
      },
    ],
  };
}

export function getServiceLocationContent(service: Service, location: Location) {
  const serviceLower = service.name.toLowerCase();
  return {
    overview: `Looking for ${serviceLower} in ${location.name}? Tamesis Development Ltd delivers professional ${serviceLower} across ${location.name}, carried out by our own directly employed engineers rather than a network of subcontractors. ${location.note}`,
    whatWeDo: [
      `Initial assessment and diagnosis of the ${serviceLower} issue in your ${location.name} property`,
      "A clear, itemised quotation before any work begins",
      "Work carried out by our own directly employed engineers",
      "Full clean-up and a quality check before we consider the job complete",
    ],
    faqs: [
      {
        q: `Do you provide ${serviceLower} in ${location.name}?`,
        a: `Yes — ${serviceLower} is one of our core services and we regularly carry it out across ${location.name} for housing associations, landlords, managing agents and homeowners.`,
      },
      {
        q: `How quickly can you respond in ${location.name}?`,
        a: `Response times depend on urgency. Emergency requests are prioritised; non-urgent ${serviceLower} work is scheduled with you in advance.`,
      },
      {
        q: "Do you provide a fixed quote before starting work?",
        a: "Yes. We assess the work first and provide a clear, itemised quotation before anything begins.",
      },
    ],
  };
}

export const values = [
  {
    name: "Professionalism",
    icon: "BadgeCheck",
    description: "Every engineer represents Tamesis on site — in conduct, communication and workmanship.",
  },
  {
    name: "Reliability",
    icon: "ShieldCheck",
    description: "We turn up when we say we will, and we finish what we start to specification.",
  },
  {
    name: "Clear Communication",
    icon: "MessageSquare",
    description: "Clients and residents are kept informed at every stage, with no surprises.",
  },
  {
    name: "Quality Workmanship",
    icon: "Hammer",
    description: "Work is signed off against a quality checklist before we consider a job complete.",
  },
] as const;

export const timeline = [
  { year: "2019", title: "Tamesis Founded", description: "Started delivering responsive repairs across South West London." },
  { year: "2020", title: "First Housing Association Contract", description: "Secured our first multi-year planned maintenance contract." },
  { year: "2022", title: "10 Operational Teams", description: "Grew to ten directly managed teams covering all of Greater London." },
  { year: "2025", title: "3,000th Completed Job", description: "Passed 3,000 completed projects across repairs, refurbishment and construction." },
  { year: "2026", title: "London Wide Coverage", description: "Now serving housing associations, local authorities, commercial clients and homeowners across every London borough, with 17 operational teams." },
] as const;

export const vacancies = [
  { title: "Multi-Trade Engineer", location: "London Wide", type: "Full-Time" },
  { title: "Plumber", location: "South West London", type: "Full-Time" },
  { title: "Site Supervisor", location: "London Wide", type: "Full-Time" },
  { title: "Bathroom Fitter", location: "London Wide", type: "Full-Time / Subcontract" },
  { title: "Administrator — Job Booking", location: "Fulham Office", type: "Full-Time" },
] as const;

export const benefits = [
  { name: "Competitive Pay", icon: "Banknote" },
  { name: "Company Van & Fuel Card", icon: "Truck" },
  { name: "Consistent Year-Round Work", icon: "CalendarCheck2" },
  { name: "Training & Development", icon: "GraduationCap" },
  { name: "Supportive Team Culture", icon: "Users" },
  { name: "Career Progression", icon: "TrendingUp" },
] as const;

export const newsCategoryIcon: Record<string, string> = {
  "Company News": "Building2",
  Guidance: "BookOpen",
  "Case Study": "FileText",
};

export const news = [
  {
    title: "Tamesis Expands Planned Maintenance Team",
    category: "Company News",
    date: "June 2026",
  },
  {
    title: "A Guide to Preventing Winter Leaks in Occupied Properties",
    category: "Guidance",
    date: "May 2026",
  },
  {
    title: "How We Deliver Void Turnarounds Faster",
    category: "Case Study",
    date: "April 2026",
  },
] as const;
