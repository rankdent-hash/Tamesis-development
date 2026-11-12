import { ArrowRight } from "lucide-react";
import { whyChoose } from "../data/content";
import { Icon } from "./Icon";
import { AnimateIn } from "./AnimateIn";

export function WhyChoose() {
  return (
    <section className="relative py-24 lg:py-32 bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      <div className="absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-blue-500/15 blur-[130px]" aria-hidden="true" />
      <div className="absolute -left-40 bottom-[-20%] h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[130px]" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-16 items-center">
        <AnimateIn>
          <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> Why Ninja Fix
          </span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-5xl leading-[1.1] text-balance">
            Why Londoners <span className="text-orange-500">choose Ninja Fix</span>
          </h2>
          <p className="mt-5 text-navy-100/70 leading-relaxed max-w-md">
            Housing associations, local authorities, landlords and homeowners rely on us for the same things: people
            who turn up, communicate clearly and finish the job properly.
          </p>
          <a
            href="/quote"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-orange-500 text-navy-950 px-7 py-3.5 text-sm font-bold shadow-[0_10px_30px_-8px_rgba(255,116,33,0.6)] hover:bg-orange-400 transition-colors"
          >
            Get a Free Quote
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </AnimateIn>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 [perspective:1400px]">
          {whyChoose.map((item, i) => (
            <AnimateIn key={item.name} delay={(i % 3) * 0.07} className="h-full">
              <div className="lift-3d group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 lg:p-6 backdrop-blur-sm">
                <span className="flex w-12 h-12 items-center justify-center rounded-xl border border-blue-400/30 bg-blue-400/10 text-blue-400 transition-colors group-hover:border-orange-500 group-hover:bg-orange-500 group-hover:text-navy-950">
                  <Icon name={item.icon} size={22} strokeWidth={1.75} />
                </span>
                <span className="mt-5 block font-display font-semibold text-white text-[15px] lg:text-base leading-snug">
                  {item.name}
                </span>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
