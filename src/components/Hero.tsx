import { ChevronDown, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { heroPhoto, unsplashUrl } from "../data/photos";
import { HeroQuoteForm } from "./HeroQuoteForm";

const badges = [
  "Established 2014",
  "London Wide Coverage",
  "3,200+ Completed Projects",
  "520+ Customer Reviews",
  "10 Operational Teams",
];

export function Hero() {
  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-44 pb-16 sm:pb-20 lg:pb-28 overflow-hidden bg-navy-950">
      {/* Background photography — real photo, dark overlay for text contrast */}
      <div className="absolute inset-0 bg-navy-900">
        <img
          src={unsplashUrl(heroPhoto)}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/80 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/30 to-navy-950/60" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-xs font-accent uppercase tracking-widest text-blue-300 mb-6 lg:mb-8">
            Property Maintenance &amp; Refurbishment · Since 2014
          </div>

          <h1 className="font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-[1.08] text-balance">
            London Property Repairs &amp; Maintenance — Done Right, First Time
          </h1>

          <p className="mt-5 lg:mt-6 text-base sm:text-lg text-navy-100/80 max-w-2xl leading-relaxed">
            Fast response, fixed-price quotes and directly employed engineers — not subcontractors — trusted since 2014 by housing associations, local authorities, landlords and homeowners across London.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-row flex-nowrap gap-3 sm:gap-4">
            <a
              href="/quote"
              className="flex-1 sm:flex-initial flex items-center justify-center text-center rounded-full bg-orange-500 text-navy-950 px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
            >
              Get a Free Quote
            </a>
            <a
              href="/report-repair"
              className="flex-1 sm:flex-initial flex items-center justify-center text-center rounded-full border border-white/30 text-white px-4 sm:px-8 py-3 sm:py-4 text-xs sm:text-sm font-bold hover:bg-white/10 transition-all"
            >
              Book a Repair
            </a>
          </div>

          <ul className="mt-10 lg:mt-14 flex flex-wrap gap-x-6 gap-y-3 lg:gap-x-8">
            {badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-sm text-navy-100/75 font-medium">
                <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                {badge}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          className="flex justify-center lg:justify-end"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <HeroQuoteForm />
        </motion.div>
      </div>

      <a
        href="#trust-bar"
        aria-label="Scroll to content"
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-navy-100/50 hover:text-blue-400 transition-colors"
      >
        <span className="text-[10px] font-accent uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
