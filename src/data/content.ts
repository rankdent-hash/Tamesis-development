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

export const services = [
  { name: "Responsive Repairs", slug: "responsive-repairs", icon: "Wrench" },
  { name: "Property Maintenance", slug: "property-maintenance", icon: "Building2" },
  { name: "Plumbing", slug: "plumbing", icon: "Droplets" },
  { name: "Leak Detection", slug: "leak-detection", icon: "Search" },
  { name: "Drain Unblocking", slug: "drain-unblocking", icon: "Waves" },
  { name: "Drain Repairs", slug: "drain-repairs", icon: "GitBranch" },
  { name: "Bathroom Repairs", slug: "bathroom-repairs", icon: "ShowerHead" },
  { name: "Bathroom Installation", slug: "bathroom-installation", icon: "Bath" },
  { name: "Bathroom Refurbishment", slug: "bathroom-refurbishment", icon: "Hammer" },
  { name: "Flooring Repairs", slug: "flooring-repairs", icon: "LayoutGrid" },
  { name: "Wall & Floor Tiling", slug: "tiling", icon: "Grid3x3" },
  { name: "Carpentry & Joinery", slug: "carpentry-joinery", icon: "Ruler" },
  { name: "Painting & Decorating", slug: "painting-decorating", icon: "PaintRoller" },
  { name: "Electrical Services", slug: "electrical", icon: "Zap" },
  { name: "Damp & Mould Treatment", slug: "damp-mould", icon: "CloudRain" },
  { name: "Planned Maintenance", slug: "planned-maintenance", icon: "CalendarCheck2" },
  { name: "Void Property Refurbishment", slug: "void-refurbishment", icon: "KeyRound" },
  { name: "Insurance Reinstatement", slug: "insurance-reinstatement", icon: "ShieldCheck" },
  { name: "Commercial Refurbishment", slug: "commercial-refurbishment", icon: "Building" },
  { name: "General Construction", slug: "construction", icon: "HardHat" },
] as const;

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
  { title: "Void Turnaround Programme", category: "Void Refurbishment", location: "Hackney, London" },
  { title: "Full Bathroom Refurbishment", category: "Bathrooms", location: "Fulham, London" },
  { title: "Estate-Wide Planned Maintenance", category: "Planned Maintenance", location: "Croydon, London" },
  { title: "Commercial Office Refit", category: "Commercial Refurbishment", location: "Southwark, London" },
  { title: "Insurance Reinstatement Works", category: "Insurance Reinstatement", location: "Wandsworth, London" },
  { title: "Multi-Unit Roof & Leak Repairs", category: "Leak Detection", location: "Camden, London" },
] as const;

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
] as const;

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
