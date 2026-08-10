import { Suspense, lazy, useEffect, useRef, useState, useCallback } from "react";
import { houseServices } from "./houseServices";
import { unsplashUrl, aboutPhoto } from "../../data/photos";

/**
 * three.js is a large dependency (~150KB gzipped — bigger than this site's
 * entire main bundle). It is therefore:
 *   1. lazy()'d, so it's a separate chunk, never in the initial bundle
 *   2. only mounted once the section actually scrolls into view
 *   3. backed by a real photo until it loads, so there's no layout shift
 *      and no blank box on slow connections or WebGL-less devices
 * Without all three of those, adding 3D to the homepage would measurably
 * hurt Core Web Vitals — which matters directly for search ranking.
 */
const HouseScene = lazy(() => import("./HouseScene"));

const CYCLE_MS = 4200;

export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Only start loading three.js once the section is close to the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Auto-cycle through services
  useEffect(() => {
    if (!sceneReady || paused) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const id = setInterval(() => {
      setActive((i) => (i + 1) % houseServices.length);
    }, CYCLE_MS);
    return () => clearInterval(id);
  }, [sceneReady, paused]);

  const handleReady = useCallback(() => setSceneReady(true), []);

  const current = houseServices[active];

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative corner-marks overflow-hidden rounded-2xl shadow-card-hover aspect-[4/5] lg:aspect-[5/6] bg-gradient-to-b from-sky-100 to-sky-50">
        {/* Static fallback — visible until the 3D scene has rendered a frame,
            and permanently if WebGL isn't available */}
        <img
          src={unsplashUrl(aboutPhoto)}
          alt="Tamesis engineers at work across London"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            sceneReady ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />

        {inView && (
          <Suspense fallback={null}>
            <HouseScene activeIndex={active} onReady={handleReady} />
          </Suspense>
        )}

        {/* Active service label */}
        <div
          className={`absolute left-4 right-4 bottom-4 transition-opacity duration-500 ${
            sceneReady ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="rounded-xl bg-navy-950/85 backdrop-blur-sm px-5 py-4 text-white">
            <span className="text-[10px] font-accent uppercase tracking-widest text-orange-400 font-semibold">
              {current.location}
            </span>
            <h3 className="mt-1 font-display font-bold text-lg leading-tight">{current.name}</h3>
            <p className="mt-0.5 text-xs text-navy-100/80 leading-snug">{current.blurb}</p>
          </div>
        </div>
      </div>

      {/* Service selector — real links, crawlable, and keyboard accessible.
          This is what search engines and screen readers actually see; the
          canvas above is decorative and marked aria-hidden. */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {houseServices.map((svc, i) => (
          <li key={svc.href}>
            <a
              href={svc.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={`inline-block rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                i === active
                  ? "border-orange-500 bg-orange-500 text-navy-950"
                  : "border-navy-200 text-navy-700 hover:border-navy-900 hover:text-navy-900"
              }`}
            >
              {svc.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
