export const company = {
  name: "Tamesis Development Ltd",
  shortName: "Tamesis",
  founded: 2014,
  addressLines: ["First Floor", "48 Fulham High Street", "London", "SW6 3LQ"],
  phoneManagement: "020 3592 0042",
  phoneJobBooking: "020 3488 3737",
  email: "contact@tamesisdevelopment.co.uk",
};

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Sectors", href: "/sectors" },
  { label: "Projects", href: "/projects" },
  { label: "Reviews", href: "/reviews" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

export const stats = [
  { value: 3200, suffix: "+", label: "Completed Repairs" },
  { value: 520, suffix: "+", label: "Verified Reviews" },
  { value: 4.6, suffix: "", label: "Average Rating", decimals: 1 },
  { value: 10, suffix: "", label: "Operational Teams" },
  { value: 12, suffix: "+", label: "Years Serving London" },
];

export const serviceCategories = [
  "Repairs & Maintenance",
  "Plumbing & Drainage",
  "Bathrooms",
  "Interiors & Finishing",
  "Building & Construction",
] as const;

export const services = [
  { name: "Responsive Repairs", slug: "responsive-repairs", icon: "Wrench", category: "Repairs & Maintenance" },
  { name: "Property Maintenance", slug: "property-maintenance", icon: "Building2", category: "Repairs & Maintenance" },
  { name: "Planned Maintenance", slug: "planned-maintenance", icon: "CalendarCheck2", category: "Repairs & Maintenance" },
  { name: "Void Property Refurbishment", slug: "void-refurbishment", icon: "KeyRound", category: "Repairs & Maintenance" },
  { name: "Plumbing", slug: "plumbing", icon: "Droplets", category: "Plumbing & Drainage" },
  { name: "Leak Detection", slug: "leak-detection", icon: "Search", category: "Plumbing & Drainage" },
  { name: "Drain Unblocking", slug: "drain-unblocking", icon: "Waves", category: "Plumbing & Drainage" },
  { name: "Drain Repairs", slug: "drain-repairs", icon: "GitBranch", category: "Plumbing & Drainage" },
  { name: "Bathroom Repairs", slug: "bathroom-repairs", icon: "ShowerHead", category: "Bathrooms" },
  { name: "Bathroom Installation", slug: "bathroom-installation", icon: "Bath", category: "Bathrooms" },
  { name: "Bathroom Refurbishment", slug: "bathroom-refurbishment", icon: "Hammer", category: "Bathrooms" },
  { name: "Flooring Repairs", slug: "flooring-repairs", icon: "LayoutGrid", category: "Interiors & Finishing" },
  { name: "Wall & Floor Tiling", slug: "tiling", icon: "Grid3x3", category: "Interiors & Finishing" },
  { name: "Carpentry & Joinery", slug: "carpentry-joinery", icon: "Ruler", category: "Interiors & Finishing" },
  { name: "Painting & Decorating", slug: "painting-decorating", icon: "PaintRoller", category: "Interiors & Finishing" },
  { name: "Electrical Services", slug: "electrical", icon: "Zap", category: "Building & Construction" },
  { name: "Damp & Mould Treatment", slug: "damp-mould", icon: "CloudRain", category: "Building & Construction" },
  { name: "Insurance Reinstatement", slug: "insurance-reinstatement", icon: "ShieldCheck", category: "Building & Construction" },
  { name: "Commercial Refurbishment", slug: "commercial-refurbishment", icon: "Building", category: "Building & Construction" },
  { name: "General Construction", slug: "construction", icon: "HardHat", category: "Building & Construction" },
] as const;

export type Service = (typeof services)[number];

export function getServiceContent(service: Service) {
  const name = service.name;
  const lower = name.toLowerCase();

  return {
    overview: `Need reliable ${lower} in London? Our directly employed engineers — not a loose network of subcontractors — assess the job, give you a clear fixed-price quote, and get it done properly, first time. From a single reported issue to a portfolio-wide programme of works, we deliver ${lower} to a consistent standard across every London borough.`,
    whatWeDo: [
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
    icon: "Home",
    description: "Responsive repairs and planned maintenance delivered at scale, with full compliance reporting.",
  },
  {
    name: "Local Authorities",
    icon: "Landmark",
    description: "Framework-ready contracting for council housing stock and public buildings.",
  },
  {
    name: "Property Management Companies",
    icon: "Building2",
    description: "A single reliable contractor across your entire managed portfolio.",
  },
  {
    name: "Commercial Clients",
    icon: "Briefcase",
    description: "Refurbishment and maintenance that keeps commercial premises trading.",
  },
  {
    name: "Landlords",
    icon: "KeySquare",
    description: "Fast turnarounds on void works, repairs and compliance certificates.",
  },
  {
    name: "Residential Homeowners",
    icon: "House",
    description: "The same professional standard, brought to individual family homes.",
  },
] as const;

export const whyChoose = [
  { name: "Established Since 2014", icon: "CalendarClock" },
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

export const locations = [
  { name: "Fulham", slug: "fulham", note: "Home to our Fulham High Street office, so Fulham is where we can respond fastest." },
  { name: "Chelsea", slug: "chelsea", note: "Regular work in Chelsea's period conversions and high-spec residential properties." },
  { name: "Westminster", slug: "westminster", note: "Experience with both residential blocks and commercial premises across Westminster." },
  { name: "Kensington", slug: "kensington", note: "Repairs and refurbishment for Kensington homeowners, landlords and managing agents." },
  { name: "Hammersmith", slug: "hammersmith", note: "Close to our Fulham base, with fast response times across Hammersmith." },
  { name: "Camden", slug: "camden", note: "Planned maintenance and repairs for Camden's mix of residential and commercial stock." },
  { name: "Islington", slug: "islington", note: "Regular work across Islington's period properties and managed developments." },
  { name: "Wandsworth", slug: "wandsworth", note: "Repairs, refurbishment and planned maintenance across Wandsworth." },
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
  { year: "2014", title: "Tamesis Founded", description: "Started delivering responsive repairs across South West London." },
  { year: "2017", title: "First Housing Association Contract", description: "Secured our first multi-year planned maintenance contract." },
  { year: "2019", title: "10 Operational Teams", description: "Grew to ten directly managed teams covering all of Greater London." },
  { year: "2022", title: "3,000th Completed Job", description: "Passed 3,000 completed projects across repairs, refurbishment and construction." },
  { year: "2026", title: "London Wide Coverage", description: "Now serving housing associations, local authorities, commercial clients and homeowners across every London borough." },
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
