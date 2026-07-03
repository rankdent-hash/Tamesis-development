import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Phone, Menu, X, ChevronDown } from "lucide-react";
import { company, navLinks } from "../data/content";
import { cn } from "../lib/utils";
import { ServicesMegaMenu } from "./ServicesMegaMenu";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const solid = scrolled || menuOpen;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 inset-x-0 z-50">
      {/* Top utility bar — transparent over hero, fades to a hairline-bordered strip on scroll */}
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
            <a href="/quote" className="hover:text-orange-400 transition-colors">Request a Quote</a>
            <span className="opacity-30">/</span>
            <a href="/report-repair" className="hover:text-orange-400 transition-colors">Report a Repair</a>
            <span className="opacity-30">/</span>
            <a href="/emergency" className="text-orange-400 hover:text-orange-300 transition-colors">Emergency Callout</a>
          </div>
        </div>
      </div>

      {/* Main nav — transparent over the hero, solidifies on scroll */}
      <header
        className={cn(
          "transition-all duration-300",
          solid ? "bg-paper/95 backdrop-blur-md shadow-[0_1px_0_rgba(14,22,17,0.08)]" : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-[1400px] px-6 lg:px-8 flex items-center justify-between h-20 lg:h-24">
          <a href="/" className="flex items-center gap-3 shrink-0">
            <span className="w-10 h-10 rounded-lg bg-navy-900 text-orange-400 font-display font-bold text-lg flex items-center justify-center shrink-0">
              T
            </span>
            <span
              className={cn(
                "font-display font-bold text-lg leading-tight tracking-tight transition-colors duration-300",
                solid ? "text-navy-900" : "text-white"
              )}
            >
              Tamesis
              <span
                className={cn(
                  "block text-[10px] font-accent font-medium tracking-[0.22em] uppercase transition-colors duration-300",
                  solid ? "text-slate" : "text-white/60"
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
              Request a Quote
            </a>
          </div>

          <button
            className={cn("lg:hidden transition-colors duration-300", solid ? "text-navy-900" : "text-white")}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-navy-100 bg-paper px-6 py-6 flex flex-col gap-5">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn("font-medium", isActive(link.href) ? "text-orange-600" : "text-navy-800")}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-3 border-t border-navy-100">
              <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="font-accent text-sm font-medium text-navy-700">
                Job Booking {company.phoneJobBooking}
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
