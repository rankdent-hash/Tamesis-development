import { Mail, MapPin, Phone } from "lucide-react";
import { company } from "../data/content";

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
  return (
    <footer className="bg-navy-950 text-navy-100">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-16 grid lg:grid-cols-6 gap-12">
        <div className="lg:col-span-2">
          <a href="/" className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-blue-500 text-navy-950 font-display font-bold text-lg flex items-center justify-center">
              T
            </span>
            <span className="font-display font-bold text-white text-lg">Tamesis Development Ltd</span>
          </a>

          <div className="mt-6 space-y-3 text-sm text-navy-100/70">
            <p className="flex items-start gap-2">
              <MapPin size={16} className="shrink-0 mt-0.5 text-blue-400" />
              {company.addressLines.join(", ")}
            </p>
            <a href={`tel:${company.phoneManagement.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Phone size={16} className="text-blue-400" /> Management: {company.phoneManagement}
            </a>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Phone size={16} className="text-blue-400" /> Job Booking: {company.phoneJobBooking}
            </a>
            <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Mail size={16} className="text-blue-400" /> {company.email}
            </a>
          </div>

          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href="#"
                aria-label={social.label}
                className="w-9 h-9 rounded-full border border-navy-700 flex items-center justify-center hover:bg-blue-600 hover:border-blue-600 transition-colors"
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
            <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wide">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-navy-100/70 hover:text-blue-400 transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-navy-100/50">
          <span>&copy; {new Date().getFullYear()} {company.name}. All rights reserved. Company No. XXXXXXXX.</span>
          <div className="flex gap-6">
            <a href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
            <a href="/cookie-policy" className="hover:text-blue-400 transition-colors">Cookie Policy</a>
            <a href="/terms" className="hover:text-blue-400 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
