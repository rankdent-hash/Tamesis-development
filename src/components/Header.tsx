import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Phone,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Home as HomeIcon,
  Info,
  Wrench,
  Building2,
  Image as ImageIcon,
  Star,
  Mail,
  FileWarning,
  AlertTriangle,
} from "lucide-react";
import { company, navLinks } from "../data/content";
import { cn } from "../lib/utils";
import { ServicesMegaMenu } from "./ServicesMegaMenu";

const MOBILE_NAV_ICONS: Record<string, typeof HomeIcon> = {
  Home: HomeIcon,
  "About Us": Info,
  Services: Wrench,
  Sectors: Building2,
  Projects: ImageIcon,
  Reviews: Star,
  Contact: Mail,
};

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  // Desktop still gets the transparent-over-hero effect; mobile is always
  // solid/light — small screens need a consistently legible header more
  // than the hero-reveal effect, and it reads more like a native app.
  const solid = scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar — desktop only, transparent over hero, fades to a hairline-bordered strip on scroll */}
      <div
        className={cn(
          "hidden lg:flex text-sm transition-colors duration-300",
          solid ? "bg-navy-950 text-navy-100" : "bg-transparent text-white/75"
        )}
      >
        <div className="mx-auto max-w-[1400px] w-full px-8 flex items-center justify-between py-2.5 font-accent text-xs tracking-wide">
          <div className="flex items-center gap-6">
            <a href={`tel:${company.phoneManagement.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Phone size={12} strokeWidth={2} />
              Management {company.phoneManagement}
            </a>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-orange-400 transition-colors">
              <Phone size={12} strokeWidth={2} />
              Job Booking {company.phoneJobBooking}
            </a>
          </div>
          <div className="flex items-center gap-4 font-medium">
            <a href="/quote" className="hover:text-orange-400 transition-colors">Get a Free Quote</a>
            <span className="opacity-30">/</span>
            <a href="/report-repair" className="hover:text-orange-400 transition-colors">Report a Repair</a>
            <span className="opacity-30">/</span>
            <a href="/emergency" className="text-orange-400 hover:text-orange-300 transition-colors">Emergency Callout</a>
          </div>
        </div>
      </div>

      {/* Main nav — always light on mobile; transparent-over-hero on desktop, solidifies on scroll */}
      <header
        className={cn(
          "transition-all duration-300 bg-paper/98 backdrop-blur-md shadow-[0_1px_0_rgba(14,22,17,0.08)]",
          solid
            ? "lg:bg-paper/95 lg:backdrop-blur-md lg:shadow-[0_1px_0_rgba(14,22,17,0.08)]"
            : "lg:bg-transparent lg:backdrop-blur-none lg:shadow-none"
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 flex items-center justify-between h-16 lg:h-24">
          <a href="/" className="flex items-center gap-2.5 lg:gap-3 shrink-0">
            <span className="w-9 h-9 lg:w-10 lg:h-10 rounded-lg bg-navy-900 text-orange-400 font-display font-bold text-base lg:text-lg flex items-center justify-center shrink-0">
              T
            </span>
            <span
              className={cn(
                "font-display font-bold text-base lg:text-lg leading-tight tracking-tight transition-colors duration-300 text-navy-900",
                !solid && "lg:text-white"
              )}
            >
              Tamesis
              <span
                className={cn(
                  "block text-[9px] lg:text-[10px] font-accent font-medium tracking-[0.22em] uppercase transition-colors duration-300 text-slate",
                  !solid && "lg:text-white/60"
                )}
              >
                Development Ltd
              </span>
            </span>
          </a>

          <nav
            className={cn(
              "hidden lg:flex items-center gap-8 font-medium text-sm transition-colors duration-300",
              solid ? "text-navy-800" : "text-white/85"
            )}
          >
            {navLinks.map((link) =>
              link.label === "Services" ? (
                <div
                  key={link.href}
                  className="relative"
                  onMouseEnter={() => setServicesOpen(true)}
                  onMouseLeave={() => setServicesOpen(false)}
                >
                  <a
                    href={link.href}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    aria-expanded={servicesOpen}
                    className={cn(
                      "relative py-2 flex items-center gap-1 transition-colors group",
                      solid ? "hover:text-navy-900" : "hover:text-white",
                      isActive(link.href) && (solid ? "text-navy-900" : "text-white")
                    )}
                  >
                    {link.label}
                    <ChevronDown size={14} className={cn("transition-transform duration-200", servicesOpen && "rotate-180")} />
                    <span
                      className={cn(
                        "absolute left-0 right-0 -bottom-0.5 h-0.5 bg-orange-500 origin-left transition-transform duration-200",
                        isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      )}
                    />
                  </a>
                  {servicesOpen && <ServicesMegaMenu />}
                </div>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "relative py-2 transition-colors group",
                    solid ? "hover:text-navy-900" : "hover:text-white",
                    isActive(link.href) && (solid ? "text-navy-900" : "text-white")
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute left-0 right-0 -bottom-0.5 h-0.5 bg-orange-500 origin-left transition-transform duration-200",
                      isActive(link.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </a>
              )
            )}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              aria-label={`Call Job Booking on ${company.phoneJobBooking}`}
              className={cn(
                "flex items-center justify-center w-11 h-11 rounded-full border transition-colors shrink-0",
                solid
                  ? "border-navy-200 text-navy-900 hover:bg-navy-900 hover:text-white hover:border-navy-900"
                  : "border-white/30 text-white hover:bg-white/10"
              )}
            >
              <Phone size={17} strokeWidth={2} />
            </a>
            <a
              href="/quote"
              className="rounded-full bg-orange-500 text-navy-950 px-6 py-2.5 text-sm font-semibold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
            >
              Get a Free Quote
            </a>
          </div>

          {/* Mobile: compact call button + hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              aria-label={`Call Job Booking on ${company.phoneJobBooking}`}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-navy-900 text-orange-400"
            >
              <Phone size={17} strokeWidth={2} />
            </a>
            <button
              className="flex items-center justify-center w-10 h-10 text-navy-900"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full-screen app-style overlay. Deliberately placed
          outside <header>: that element has backdrop-blur-md applied,
          and backdrop-filter creates a new CSS containing block, which
          would make this fixed-position overlay position itself relative
          to the (64px-tall) header instead of the viewport. */}
      {menuOpen && (
        <div className="lg:hidden fixed top-16 inset-x-0 bottom-0 bg-paper overflow-y-auto z-40">
          <nav className="px-5 py-4">
            {navLinks.map((link) => {
              const Icon = MOBILE_NAV_ICONS[link.label] ?? HomeIcon;
              const active = isActive(link.href);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-3 text-[15px] font-medium transition-colors",
                    active ? "bg-orange-50 text-orange-600" : "text-navy-800 hover:bg-navy-50"
                  )}
                >
                  <span
                    className={cn(
                      "flex w-9 h-9 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-orange-500 text-white" : "bg-navy-50 text-navy-700"
                    )}
                  >
                    <Icon size={17} strokeWidth={1.75} />
                  </span>
                  <span className="flex-1">{link.label}</span>
                  <ChevronRight size={16} className="text-slate-light" />
                </a>
              );
            })}
          </nav>

          <div className="px-5 pb-6 pt-2">
            <a
              href="/quote"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 text-navy-950 px-5 py-3.5 text-sm font-bold shadow-card"
            >
              Get a Free Quote
            </a>

            <div className="mt-3 grid grid-cols-3 gap-2.5">
              <a
                href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-navy-100 bg-white py-3 text-navy-800"
              >
                <Phone size={18} className="text-orange-600" />
                <span className="text-[11px] font-semibold">Call Now</span>
              </a>
              <a
                href="/report-repair"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-navy-100 bg-white py-3 text-navy-800"
              >
                <FileWarning size={18} className="text-orange-600" />
                <span className="text-[11px] font-semibold text-center leading-tight">Book a Repair</span>
              </a>
              <a
                href="/emergency"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-red-100 bg-red-50 py-3 text-red-700"
              >
                <AlertTriangle size={18} />
                <span className="text-[11px] font-semibold">Emergency</span>
              </a>
            </div>

            <div className="mt-5 pt-4 border-t border-navy-100 text-center">
              <span className="font-accent text-xs text-slate-light">
                Management: {company.phoneManagement}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
