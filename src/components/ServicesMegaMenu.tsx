import { ArrowRight } from "lucide-react";
import { services, serviceCategories } from "../data/content";
import { Icon } from "./Icon";

export function ServicesMegaMenu() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[min(920px,90vw)]">
      <div className="corner-marks rounded-2xl bg-white shadow-card-hover p-8">
        <div className="grid grid-cols-5 gap-6">
          {serviceCategories.map((category) => (
            <div key={category}>
              <h3 className="text-[11px] font-accent font-semibold uppercase tracking-widest text-orange-600 mb-3">
                {category}
              </h3>
              <ul className="space-y-1">
                {services
                  .filter((s) => s.category === category)
                  .map((s) => (
                    <li key={s.slug}>
                      <a
                        href={`/services/${s.slug}`}
                        className="group flex items-center gap-2.5 rounded-lg px-2 py-2 -mx-2 text-sm text-navy-800 hover:bg-navy-50 hover:text-navy-900 transition-colors"
                      >
                        <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                          <Icon name={s.icon} size={14} strokeWidth={1.75} />
                        </span>
                        <span className="leading-snug">{s.name}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-navy-100 flex items-center justify-between">
          <p className="text-sm text-slate">Full range of property maintenance &amp; construction services.</p>
          <a
            href="/services"
            className="inline-flex items-center gap-2 rounded-full bg-navy-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-navy-800 transition-colors shrink-0"
          >
            View All Services <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
