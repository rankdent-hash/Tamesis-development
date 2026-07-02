import { ChevronDown, CheckCircle2 } from "lucide-react";

const badges = [
  "Established 2014",
  "London Wide Coverage",
  "3,200+ Completed Projects",
  "520+ Customer Reviews",
  "10 Operational Teams",
];

export function Hero() {
  return (
    <section className="relative pt-40 lg:pt-48 pb-24 lg:pb-32 overflow-hidden bg-navy-950">
      {/* Background photography placeholder */}
      <div className="absolute inset-0 bg-navy-900 blueprint-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-transparent to-navy-950/40" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-mono uppercase tracking-widest text-teal-300 mb-8">
            Property Maintenance &amp; Refurbishment · Since 2014
          </div>

          <h1 className="font-display font-extrabold text-white text-4xl sm:text-5xl lg:text-6xl leading-[1.06] text-balance">
            London&rsquo;s Trusted Property Maintenance, Repairs &amp; Refurbishment Specialists
          </h1>

          <p className="mt-6 text-lg text-navy-100/80 max-w-2xl leading-relaxed">
            Delivering responsive repairs, planned maintenance, refurbishment and construction services across London since 2014.
          </p>
          <p className="mt-4 text-base text-navy-100/60 max-w-2xl leading-relaxed">
            Serving housing associations, local authorities, managing agents, commercial organisations, landlords and homeowners with professionalism, reliability and exceptional workmanship.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="/quote"
              className="rounded-full bg-teal-500 text-navy-950 px-8 py-4 text-sm font-bold shadow-card hover:bg-teal-400 hover:shadow-card-hover transition-all"
            >
              Request a Quote
            </a>
            <a
              href="/report-repair"
              className="rounded-full border border-white/30 text-white px-8 py-4 text-sm font-bold hover:bg-white/10 transition-all"
            >
              Book a Repair
            </a>
          </div>

          <ul className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
            {badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2 text-sm text-navy-100/75 font-medium">
                <CheckCircle2 size={16} className="text-teal-400 shrink-0" />
                {badge}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a
        href="#trust-bar"
        aria-label="Scroll to content"
        className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-navy-100/50 hover:text-teal-400 transition-colors"
      >
        <span className="text-[10px] font-mono uppercase tracking-widest">Scroll</span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  );
}
