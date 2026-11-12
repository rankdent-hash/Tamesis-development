import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "./AnimateIn";
import { cn } from "../lib/utils";

// Rough positions on a stylised map of London (x = west→east, y = north→south,
// both as % of the board). Not to scale — it's an illustration, not navigation.
const boroughs = [
  { name: "Westminster", x: 50, y: 45 },
  { name: "Camden", x: 47, y: 24 },
  { name: "Islington", x: 60, y: 27 },
  { name: "Hackney", x: 74, y: 23 },
  { name: "Fulham", x: 25, y: 60 },
  { name: "Chelsea", x: 38, y: 55 },
  { name: "Wandsworth", x: 35, y: 77 },
  { name: "Southwark", x: 64, y: 58 },
  { name: "Croydon", x: 60, y: 92 },
  { name: "Hammersmith", x: 15, y: 47 },
  { name: "Kensington", x: 32, y: 41 },
  { name: "Greenwich", x: 87, y: 60 },
];

const TILT_X = 58;
const TILT_Z = -14;
const THAMES =
  "M-2,65 C8,60 16,69 24,67 S34,61 40,64 C47,67 52,61 55,53 C57,46 62,48 68,50 C74,52 76,43 82,46 C88,49 86,57 93,52 L102,47";

export function Coverage() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % boroughs.length), 1900);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section className="relative py-24 lg:py-32 bg-navy-900 overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_right,transparent,black)]" />
      <div
        className="absolute right-[-10%] top-1/2 h-[620px] w-[620px] -translate-y-1/2 rounded-full bg-blue-500/20 blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <AnimateIn>
          <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> Coverage
          </span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-5xl leading-[1.1] text-balance">
            Servicing <span className="text-orange-500">Every London Borough</span>
          </h2>
          <p className="mt-5 text-navy-100/70 leading-relaxed max-w-lg">
            Providing property maintenance and refurbishment services across Greater London. Supporting both planned
            maintenance and emergency repairs.
          </p>

          <ul
            className="mt-8 flex flex-wrap gap-2 max-w-xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {boroughs.map((b, i) => (
              <li key={b.name}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={cn(
                    "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                    i === active
                      ? "border-orange-500 bg-orange-500 text-navy-950"
                      : "border-white/15 bg-white/[0.04] text-navy-100/80 hover:border-white/40"
                  )}
                >
                  {b.name}
                </button>
              </li>
            ))}
          </ul>

          <a
            href="/coverage"
            className="group mt-9 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/5 text-white px-7 py-3.5 text-sm font-bold hover:bg-white/10 transition-colors"
          >
            View Coverage Areas
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </AnimateIn>

        {/* Tilted 3D board — pure CSS transforms, no WebGL */}
        <div
          className="relative mx-auto aspect-[1/0.78] w-full max-w-[600px] [perspective:1400px]"
          role="img"
          aria-label="Stylised 3D map of Greater London showing the boroughs we cover"
        >
          <div
            className="absolute inset-x-[13%] top-[-8%] aspect-square"
            style={{ transform: `rotateX(${TILT_X}deg) rotateZ(${TILT_Z}deg)`, transformStyle: "preserve-3d" }}
          >
            {/* Stacked layers fake the board's thickness */}
            {[28, 21, 14, 7].map((z) => (
              <div
                key={z}
                className="absolute inset-0 rounded-[2rem] border border-blue-400/25 bg-navy-950"
                style={{ transform: `translateZ(-${z}px)` }}
              />
            ))}
            <div
              className="absolute inset-[6%] rounded-[2rem] bg-blue-400/30 blur-2xl"
              style={{ transform: "translateZ(-70px)" }}
            />

            <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-blue-400/50 bg-navy-800">
              <div className="absolute inset-0 blueprint-grid opacity-80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(34,184,212,0.28),transparent_62%)]" />
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path d={THAMES} fill="none" stroke="rgba(95,211,232,0.25)" strokeWidth="5.5" strokeLinecap="round" />
                <path d={THAMES} fill="none" stroke="#5FD3E8" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="absolute left-[7%] bottom-[6%] text-[10px] font-accent uppercase tracking-[0.3em] text-blue-300/60">
                Greater London
              </span>
            </div>

            {boroughs.map((b, i) => {
              const isActive = i === active;
              return (
                <div
                  key={b.name}
                  className="absolute"
                  style={{ left: `${b.x}%`, top: `${b.y}%`, transformStyle: "preserve-3d" }}
                >
                  {/* Footprint on the board */}
                  <span
                    className={cn(
                      "absolute -left-3 -top-3 h-6 w-6 rounded-full border transition-colors duration-300",
                      isActive ? "map-pulse border-orange-400 bg-orange-500/25" : "border-blue-300/50 bg-blue-400/10"
                    )}
                  />
                  {/* Upright pin — counter-rotated so it faces the viewer */}
                  <div
                    className="absolute left-0 top-0"
                    style={{
                      transform: `rotateZ(${-TILT_Z}deg) rotateX(${-TILT_X}deg)`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <div className="absolute bottom-0 left-0 flex -translate-x-1/2 flex-col items-center">
                      <span
                        className={cn(
                          "mb-1.5 whitespace-nowrap rounded-md px-2 py-1 font-display text-[11px] font-bold shadow-lg transition-all duration-300",
                          isActive
                            ? "translate-y-0 bg-orange-500 text-navy-950 opacity-100"
                            : "translate-y-1 bg-navy-950 text-white opacity-0"
                        )}
                      >
                        {b.name}
                      </span>
                      <span
                        className={cn(
                          "rounded-full transition-all duration-300",
                          isActive
                            ? "h-3.5 w-3.5 bg-orange-500 shadow-[0_0_18px_4px_rgba(255,116,33,0.7)]"
                            : "h-2 w-2 bg-blue-300 shadow-[0_0_10px_2px_rgba(95,211,232,0.6)]"
                        )}
                      />
                      <span
                        className={cn(
                          "w-px bg-gradient-to-b to-transparent transition-all duration-300",
                          isActive ? "h-12 from-orange-400" : "h-5 from-blue-300"
                        )}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
