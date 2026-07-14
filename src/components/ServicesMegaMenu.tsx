import { ArrowRight, Phone } from "lucide-react";
import { services, company } from "../data/content";
import { Icon } from "./Icon";

export function ServicesMegaMenu() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-[min(1160px,94vw)]">
      <div className="corner-marks rounded-2xl bg-white shadow-card-hover p-8">
        <div className="grid grid-cols-4 gap-x-5 gap-y-1">
          {services
            .filter((s) => !("hideFromMegaMenu" in s && s.hideFromMegaMenu))
            .map((s) => (
            <a
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-2.5 rounded-lg px-2 py-2.5 -mx-2 text-navy-800 hover:bg-navy-50 hover:text-navy-900 transition-colors"
            >
              <span className="flex w-7 h-7 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <Icon name={s.icon} size={14} strokeWidth={1.75} />
              </span>
              <span className="text-[13px] leading-snug">{s.name}</span>
            </a>
          ))}
        </div>

        <div className="mt-6 pt-6 border-t border-navy-100 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-slate">Full range of property maintenance &amp; construction services.</p>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-5 py-2.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-colors"
            >
              <Phone size={14} /> {company.phoneJobBooking}
            </a>
            <a
              href="/services"
              className="inline-flex items-center gap-2 rounded-full bg-navy-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-navy-800 transition-colors"
            >
              View All Services <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
