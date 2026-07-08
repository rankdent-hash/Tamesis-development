import { Mail, MapPin, Phone, HardHat, Star, CalendarCheck, ShieldCheck, MapPinned } from "lucide-react";
import { company, londonRegions, boroughLinkMap } from "../data/content";
import logo from "../assets/logo.png";

// lucide-react no longer ships brand/logo icons — simple inline marks instead.
const socialLinks = [
  {
    label: "Facebook",
    path: "M13.5 21v-7.5h2.5l.5-3H13.5V8.25c0-.87.24-1.46 1.5-1.46H16.5V4.1C16.24 4.07 15.37 4 14.36 4 12.24 4 10.8 5.28 10.8 7.72V10.5H8.25v3H10.8V21h2.7z",
  },
  {
    label: "Instagram",
    path: "M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2ZM12 6a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm6.3-.3a1.4 1.4 0 1 1-2.8 0 1.4 1.4 0 0 1 2.8 0ZM4 8.4C4 5.97 5.97 4 8.4 4h7.2C18.03 4 20 5.97 20 8.4v7.2c0 2.43-1.97 4.4-4.4 4.4H8.4A4.4 4.4 0 0 1 4 15.6V8.4Zm4.4-2.3A2.3 2.3 0 0 0 6.1 8.4v7.2a2.3 2.3 0 0 0 2.3 2.3h7.2a2.3 2.3 0 0 0 2.3-2.3V8.4a2.3 2.3 0 0 0-2.3-2.3H8.4Z",
  },
  {
    label: "LinkedIn",
    path: "M6.94 8.5H4.06V19h2.88V8.5ZM5.5 4.25a1.67 1.67 0 1 0 0 3.33 1.67 1.67 0 0 0 0-3.33ZM19.94 19h-2.87v-5.4c0-1.29-.03-2.94-1.79-2.94-1.8 0-2.07 1.4-2.07 2.85V19h-2.87V8.5h2.75v1.43h.04c.38-.72 1.32-1.48 2.72-1.48 2.91 0 3.45 1.92 3.45 4.4V19Z",
  },
];


const columns = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Projects", href: "/projects" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Responsive Repairs", href: "/services/responsive-repairs" },
      { label: "Planned Maintenance", href: "/services/planned-maintenance" },
      { label: "Refurbishment", href: "/services/void-refurbishment" },
      { label: "Construction", href: "/services/construction" },
    ],
  },
  {
    title: "Sectors",
    links: [
      { label: "Housing Associations", href: "/sectors" },
      { label: "Local Authorities", href: "/sectors" },
      { label: "Property Managers", href: "/sectors" },
      { label: "Landlords", href: "/sectors" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Health &amp; Safety", href: "/health-safety" },
      { label: "Accreditations", href: "/accreditations" },
      { label: "Reviews", href: "/reviews" },
    ],
  },
];

export function Footer() {
  const trustItems = [
    { icon: HardHat, label: "Directly Employed Engineers" },
    { icon: Star, label: "4.6★ from 535+ Reviews" },
    { icon: CalendarCheck, label: "Trusted Since 2019" },
    { icon: ShieldCheck, label: "Fully Insured & Compliant" },
    { icon: MapPinned, label: "London-Wide Coverage" },
  ];

  return (
    <footer className="relative bg-navy-950 text-navy-100 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40" />

      {/* Prefooter trust bar */}
      <div className="relative border-b border-navy-800">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-6 flex flex-wrap items-center justify-center lg:justify-between gap-x-8 gap-y-3">
          {trustItems.map((item) => (
            <span key={item.label} className="flex items-center gap-2 text-xs sm:text-[13px] font-medium text-navy-100/80">
              <item.icon size={15} className="text-orange-400 shrink-0" />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      {/* Brand statement */}
      <div className="relative border-b border-navy-800">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16 lg:py-20">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight max-w-xl text-balance">
              London&rsquo;s trusted property maintenance partner, since 2019.
            </h2>
            <a
              href="/quote"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-orange-500 text-navy-950 px-7 py-3.5 text-sm font-bold shadow-card hover:bg-orange-400 transition-all"
            >
              Get a Free Quote
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 py-16 lg:py-20 grid lg:grid-cols-6 gap-12">
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center">
            <img src={logo} alt="Tamesis Development Ltd" className="h-[55px] w-auto invert" />
          </a>

          <div className="mt-7 space-y-3.5 text-sm text-navy-100/70 font-accent">
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="shrink-0 mt-0.5 text-orange-400" />
              {company.addressLines.join(", ")}
            </p>
            <a href={`tel:${company.phoneManagement.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
              <Phone size={15} className="text-orange-400" /> Management {company.phoneManagement}
            </a>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
              <Phone size={15} className="text-orange-400" /> Job Booking {company.phoneJobBooking}
            </a>
            <a
              href={`https://wa.me/44${company.whatsapp.replace(/\s/g, "").replace(/^0/, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 hover:text-orange-400 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-orange-400 shrink-0">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.9-4.45 9.9-9.92 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.13c-.24.68-1.42 1.32-1.96 1.4-.5.08-1.13.11-1.83-.12-.42-.13-.96-.31-1.66-.6-2.92-1.26-4.83-4.2-4.98-4.4-.15-.19-1.19-1.58-1.19-3.01 0-1.43.75-2.13 1.02-2.43.26-.29.57-.36.76-.36l.55.01c.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.16-.29.36-.42.48-.14.13-.28.27-.12.53.15.26.68 1.13 1.47 1.83 1.01.9 1.87 1.18 2.13 1.31.26.13.41.11.56-.07.15-.18.64-.75.81-1.01.17-.26.34-.21.57-.13.24.09 1.5.71 1.76.84.26.13.43.19.49.3.06.11.06.63-.18 1.31Z" />
              </svg>
              WhatsApp {company.whatsapp}
            </a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2.5 hover:text-orange-400 transition-colors">
              <Mail size={15} className="text-orange-400" /> {company.email}
            </a>
          </div>

          <div className="mt-7 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-navy-700 flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 hover:text-navy-950 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-accent font-semibold text-white/90 text-xs uppercase tracking-[0.14em]">{col.title}</h3>
            <ul className="mt-6 space-y-3.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-navy-100/70 hover:text-orange-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Areas we cover — all 32 London boroughs + City of London */}
      <div className="relative border-t border-navy-800">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-10">
          <h3 className="font-accent font-semibold text-white/90 text-xs uppercase tracking-[0.14em]">
            Areas We Cover — All of London, North to South, East to West
          </h3>
          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-4">
            {londonRegions.map((group) => (
              <div key={group.region}>
                <span className="text-xs font-semibold text-orange-400/90">{group.region}</span>
                <p className="mt-2 text-xs text-navy-100/60 leading-relaxed">
                  {group.boroughs.map((borough, i) => {
                    const slug = boroughLinkMap[borough];
                    return (
                      <span key={borough}>
                        {slug ? (
                          <a href={`/property-maintenance/${slug}`} className="hover:text-orange-400 transition-colors">
                            {borough}
                          </a>
                        ) : (
                          borough
                        )}
                        {i < group.boroughs.length - 1 ? ", " : ""}
                      </span>
                    );
                  })}
                </p>
              </div>
            ))}
          </div>
          <a href="/coverage" className="mt-6 inline-block text-xs font-semibold text-orange-400 hover:text-orange-300 transition-colors">
            View full coverage details &rarr;
          </a>
        </div>
      </div>

      <div className="relative border-t border-navy-800">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-accent text-navy-100/50">
          <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved. Company No. 12210539.</span>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-orange-400 transition-colors">Cookie Policy</a>
            <a href="/terms" className="hover:text-orange-400 transition-colors">Terms</a>
            <a href="/sitemap" className="hover:text-orange-400 transition-colors">Sitemap</a>
            <a href="/admin" className="hover:text-orange-400 transition-colors">Admin Login</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
