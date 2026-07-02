import { useEffect, useState } from "react";
import { Phone, Menu, X } from "lucide-react";
import { company, navLinks } from "../data/content";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar */}
      <div className="hidden lg:flex bg-navy-950 text-navy-100 text-sm">
        <div className="mx-auto max-w-[1400px] w-full px-8 flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href={`tel:${company.phoneManagement.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Phone size={14} strokeWidth={2} />
              Management: {company.phoneManagement}
            </a>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
              <Phone size={14} strokeWidth={2} />
              Job Booking: {company.phoneJobBooking}
            </a>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a href="/quote" className="hover:text-blue-400 transition-colors">Request a Quote</a>
            <span className="text-navy-700">|</span>
            <a href="/report-repair" className="hover:text-blue-400 transition-colors">Report a Repair</a>
            <span className="text-navy-700">|</span>
            <a href="/emergency" className="text-blue-400 hover:text-blue-300 transition-colors">Emergency Callout</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <header
        className={`transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur shadow-[0_1px_0_rgba(11,31,58,0.08)]" : "bg-white"
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 flex items-center justify-between h-20">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <span className="w-10 h-10 rounded-lg bg-navy-900 text-blue-400 font-display font-bold text-lg flex items-center justify-center">
              T
            </span>
            <span className="font-display font-bold text-navy-900 text-lg leading-tight tracking-tight">
              Tamesis<span className="block text-xs font-medium text-slate tracking-[0.18em] uppercase">Development Ltd</span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-navy-800">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="relative py-2 hover:text-blue-600 transition-colors group">
                {link.label}
                <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-blue-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200" />
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href="/quote"
              className="rounded-full bg-orange-500 text-navy-950 px-6 py-2.5 text-sm font-semibold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
            >
              Request a Quote
            </a>
          </div>

          <button
            className="lg:hidden text-navy-900"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-navy-100 bg-white px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="font-medium text-navy-800" onClick={() => setMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-navy-100">
              <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="text-sm font-medium text-navy-700">
                Job Booking: {company.phoneJobBooking}
              </a>
              <a href="/quote" className="rounded-full bg-orange-500 text-navy-950 px-6 py-3 text-sm font-semibold text-center">
                Request a Quote
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}
