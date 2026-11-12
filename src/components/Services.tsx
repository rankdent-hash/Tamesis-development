import { ArrowRight, ArrowUpRight } from "lucide-react";
import { services } from "../data/content";
import { Icon } from "./Icon";
import { AnimateIn } from "./AnimateIn";
import { TiltCard } from "./TiltCard";
import { cn } from "../lib/utils";

// Literal class names (Tailwind can't see computed ones) for the closing
// call-to-action tile, which stretches to fill whatever is left of the last
// row at each breakpoint's column count.
const SPAN_BASE: Record<number, string> = { 1: "col-span-1", 2: "col-span-2" };
const SPAN_MD: Record<number, string> = { 1: "md:col-span-1", 2: "md:col-span-2", 3: "md:col-span-3" };
const SPAN_LG: Record<number, string> = { 1: "lg:col-span-1", 2: "lg:col-span-2", 3: "lg:col-span-3", 4: "lg:col-span-4" };
const remainder = (count: number, cols: number) => cols - (count % cols);

export function Services() {
  const visible = services.filter((service) => !("hideFromMegaMenu" in service && service.hideFromMegaMenu));

  return (
    <section className="relative pb-24 lg:pb-32 pt-16 lg:pt-24 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> What We Do
            </span>
            <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
              Every trade your property needs, <span className="text-orange-600">under one roof</span>
            </h2>
            <p className="mt-5 text-slate leading-relaxed">
              A full range of maintenance, repair, refurbishment and construction services, delivered by our own
              directly managed teams across London.
            </p>
          </div>
          <a
            href="/services"
            className="group shrink-0 inline-flex items-center gap-2 self-start lg:self-auto rounded-full bg-navy-900 text-white px-7 py-3.5 text-sm font-bold hover:bg-navy-800 transition-colors"
          >
            View All Services
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </AnimateIn>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {visible.map((service, i) => (
            <TiltCard
              key={service.slug}
              href={`/services/${service.slug}`}
              className="relative flex flex-col rounded-2xl bg-white border border-navy-100 p-5 lg:p-6 shadow-card hover:shadow-card-hover hover:border-orange-500/50"
            >
              <span className="tilt-pop flex items-start justify-between">
                <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-navy-900 text-blue-400 shadow-[0_8px_18px_-6px_rgba(10,22,38,0.55)] group-hover:bg-orange-500 group-hover:text-navy-950 transition-colors">
                  <Icon name={service.icon} size={22} strokeWidth={1.75} />
                </span>
                <span className="font-accent text-[11px] font-semibold text-navy-900/25 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </span>
              <span className="tilt-pop-sm mt-6 flex items-end justify-between gap-2 grow">
                <span className="font-display font-semibold text-navy-900 text-sm lg:text-[15px] leading-snug">
                  {service.name}
                </span>
                <ArrowUpRight
                  size={16}
                  className="shrink-0 mb-0.5 text-slate-light group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                />
              </span>
            </TiltCard>
          ))}

          <a
            href="/quote"
            className={cn(
              "group relative flex flex-col justify-between gap-6 overflow-hidden rounded-2xl bg-orange-500 p-5 lg:p-6 text-navy-950 shadow-[0_18px_40px_-16px_rgba(255,116,33,0.7)] transition-transform hover:-translate-y-1",
              SPAN_BASE[remainder(visible.length, 2)],
              SPAN_MD[remainder(visible.length, 3)],
              SPAN_LG[remainder(visible.length, 4)]
            )}
          >
            <span
              className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-400 blur-2xl"
              aria-hidden="true"
            />
            <span className="relative font-accent text-[11px] font-semibold uppercase tracking-widest text-navy-950/70">
              Not sure which trade you need?
            </span>
            <span className="relative flex items-end justify-between gap-4">
              <span className="font-display font-bold text-xl lg:text-2xl leading-tight">
                Tell us the problem — we&rsquo;ll send the right team.
              </span>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-navy-950 text-white transition-transform group-hover:translate-x-1">
                <ArrowRight size={20} />
              </span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
