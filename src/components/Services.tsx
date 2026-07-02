import { ArrowUpRight } from "lucide-react";
import { services } from "../data/content";
import { Icon } from "./Icon";

import { AnimateIn } from "./AnimateIn";

export function Services() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="max-w-2xl">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">What We Do</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Our Services
          </h2>
          <p className="mt-4 text-slate leading-relaxed">
            A full range of maintenance, repair, refurbishment and construction services, delivered by our own directly
            managed teams across London.
          </p>
        </AnimateIn>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {services.map((service) => (
            <a
              key={service.slug}
              href={`/services/${service.slug}`}
              className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200"
            >
              <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon name={service.icon} size={22} strokeWidth={1.75} />
              </span>
              <span className="mt-5 flex items-start justify-between gap-2">
                <span className="font-display font-semibold text-navy-900 text-sm leading-snug">{service.name}</span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 mt-0.5 text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </span>
            </a>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 text-white px-8 py-3.5 text-sm font-bold hover:bg-navy-800 transition-colors"
          >
            View All Services
          </a>
        </div>
      </div>
    </section>
  );
}
