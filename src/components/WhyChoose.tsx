import { whyChoose } from "../data/content";
import { Icon } from "./Icon";

import { AnimateIn } from "./AnimateIn";

export function WhyChoose() {
  return (
    <section className="py-24 lg:py-32 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-60" />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="max-w-2xl">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">Why Tamesis</span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance">
            Why Choose Tamesis
          </h2>
        </AnimateIn>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
          {whyChoose.map((item) => (
            <div key={item.name} className="flex items-start gap-4">
              <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-blue-400">
                <Icon name={item.icon} size={20} strokeWidth={1.75} />
              </span>
              <span className="pt-2.5 font-display font-semibold text-white text-base leading-snug">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
