import { MapPin } from "lucide-react";

const boroughs = [
  "Westminster", "Camden", "Islington", "Hackney", "Fulham", "Chelsea",
  "Wandsworth", "Southwark", "Croydon", "Hammersmith", "Kensington", "Greenwich",
];

export function Coverage() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Coverage</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Servicing Every London Borough
          </h2>
          <p className="mt-5 text-slate leading-relaxed max-w-lg">
            Providing property maintenance and refurbishment services across Greater London. Supporting both planned
            maintenance and emergency repairs.
          </p>

          <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
            {boroughs.map((b) => (
              <li key={b} className="flex items-center gap-2 text-sm text-navy-800 font-medium">
                <MapPin size={14} className="text-blue-500 shrink-0" />
                {b}
              </li>
            ))}
          </ul>

          <a
            href="/coverage"
            className="mt-9 inline-flex items-center gap-2 rounded-full bg-navy-900 text-white px-7 py-3.5 text-sm font-bold hover:bg-navy-800 transition-colors"
          >
            View Coverage Areas
          </a>
        </div>

        <div className="corner-marks relative rounded-2xl overflow-hidden aspect-square bg-navy-900 blueprint-grid shadow-card-hover">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-950/50 to-blue-700/30" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-4 h-4 rounded-full bg-blue-400 ring-8 ring-blue-400/20 animate-pulse" />
          </div>
          <span className="absolute bottom-4 left-4 text-[10px] font-accent uppercase tracking-widest text-navy-100/60 bg-navy-950/40 rounded px-2 py-1">
            Greater London coverage map
          </span>
        </div>
      </div>
    </section>
  );
}
