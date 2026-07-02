import { ArrowRight } from "lucide-react";
import { sectors } from "../data/content";
import { Icon } from "./Icon";

import { AnimateIn } from "./AnimateIn";

export function Sectors() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="max-w-2xl">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Who We Work With</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Trusted Across Every Sector
          </h2>
        </AnimateIn>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sectors.map((sector) => (
            <div
              key={sector.name}
              className="corner-marks rounded-2xl border border-navy-100 bg-white p-8 shadow-card hover:shadow-card-hover transition-shadow"
            >
              <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-navy-900 text-blue-400">
                <Icon name={sector.icon} size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 font-display font-semibold text-navy-900 text-lg">{sector.name}</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed">{sector.description}</p>
              <a
                href="/sectors"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Learn More
                <ArrowRight size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
