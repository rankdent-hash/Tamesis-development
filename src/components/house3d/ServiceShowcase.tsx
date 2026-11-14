import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bath,
  ChevronLeft,
  ChevronRight,
  CloudRain,
  DoorOpen,
  Droplets,
  Fence,
  Flame,
  Grid3x3,
  House,
  Layers,
  Move3d,
  PaintRoller,
  Pause,
  Play,
  SprayCan,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { houseStops, type StopKey } from "./houseServices";
import { cn } from "../../lib/utils";

/**
 * three.js is a large dependency, so the scene is:
 *   1. lazy()'d into its own chunk, never in the initial bundle
 *   2. only mounted once the section scrolls near the viewport
 *   3. optional — the info card, tabs and links all work without it, so
 *      nothing is lost on a slow connection or a device without WebGL
 */
const HouseTour = lazy(() => import("./HouseTour"));

const CYCLE_MS = 7000;

const icons: Record<StopKey, LucideIcon> = {
  overview: House,
  plumbing: Droplets,
  heating: Flame,
  bathroom: Bath,
  tiling: Grid3x3,
  flooring: Layers,
  electrical: Zap,
  painting: PaintRoller,
  carpentry: DoorOpen,
  damp: SprayCan,
  leak: CloudRain,
  fencing: Fence,
};

export function ServiceShowcase() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [wide, setWide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

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

  // On desktop the info card overlays the left of the stage, so the scene
  // shifts its picture right to keep the house clear of it.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const running = playing && sceneReady && !hovered;

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % houseStops.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [running, active]);

  // Keep the active tab in view without scrolling the page
  useEffect(() => {
    const strip = tabsRef.current;
    const tab = strip?.children[active] as HTMLElement | undefined;
    if (!strip || !tab) return;
    strip.scrollTo({ left: tab.offsetLeft - strip.clientWidth / 2 + tab.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const handleReady = useCallback(() => setSceneReady(true), []);
  const go = (delta: number) => setActive((i) => (i + delta + houseStops.length) % houseStops.length);

  const stop = houseStops[active];
  const StopIcon = icons[stop.key];

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-3xl border border-navy-700 bg-navy-950 shadow-[0_40px_80px_-30px_rgba(5,12,22,0.6)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Stage */}
      <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-[16/8.2]">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 blueprint-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />
          <div className="absolute left-1/2 top-1/2 h-[70%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20 blur-[110px] lg:left-[62%]" />
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-orange-500/10 blur-[100px]" />
        </div>

        {inView && (
          <div className={cn("absolute inset-0 transition-opacity duration-700", sceneReady ? "opacity-100" : "opacity-0")}>
            <Suspense fallback={null}>
              <HouseTour activeIndex={active} viewShift={wide ? 0.13 : 0} onReady={handleReady} />
            </Suspense>
          </div>
        )}

        <span className="pointer-events-none absolute right-4 top-4 hidden items-center gap-2 rounded-full bg-navy-900/80 px-3.5 py-2 text-[10px] font-accent uppercase tracking-widest text-blue-300 backdrop-blur sm:inline-flex">
          <Move3d size={13} className="text-orange-400" /> Drag to look around
        </span>

        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause the tour" : "Play the tour"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-900/80 text-white backdrop-blur transition-colors hover:bg-navy-800"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous stop"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-navy-900/80 text-white backdrop-blur transition-colors hover:bg-navy-800"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next stop"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-navy-950 transition-colors hover:bg-orange-400"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Info card — overlays the stage on desktop, sits under it on phones */}
      <div className="border-t border-navy-700 p-5 lg:absolute lg:left-6 lg:top-6 lg:w-[340px] lg:rounded-2xl lg:border lg:border-white/10 lg:bg-navy-900/85 lg:p-6 lg:backdrop-blur-md">
        <div className="flex items-center justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500 text-navy-950">
            <StopIcon size={22} strokeWidth={1.9} />
          </span>
          <span className="font-accent text-xs text-navy-100/50 tabular-nums">
            <span className="text-base font-semibold text-white">{String(active + 1).padStart(2, "0")}</span> /{" "}
            {String(houseStops.length).padStart(2, "0")}
          </span>
        </div>
        <div key={stop.key} className="tour-card-in">
          <p className="mt-5 text-[10px] font-accent uppercase tracking-widest text-orange-400">{stop.where}</p>
          <h3 className="mt-1.5 font-display text-2xl font-bold leading-tight text-white">{stop.name}</h3>
          <p className="mt-3 text-sm leading-relaxed text-navy-100/75 lg:min-h-[5.5rem]">{stop.blurb}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href="/quote"
              className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-navy-950 transition-colors hover:bg-orange-400"
            >
              Get a Free Quote
            </a>
            <a
              href={stop.href}
              className="group inline-flex items-center gap-1.5 text-sm font-bold text-white transition-colors hover:text-orange-400"
            >
              {stop.key === "overview" ? "All services" : "View service"}
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>

      {/* Stops — real links, so crawlers and screen readers get the full list */}
      <div ref={tabsRef} className="no-scrollbar relative flex gap-2 overflow-x-auto border-t border-navy-700 bg-navy-900/60 p-3">
        {houseStops.map((s, i) => {
          const TabIcon = icons[s.key];
          const isActive = i === active;
          return (
            <a
              key={s.key}
              href={s.href}
              onClick={(e) => {
                e.preventDefault();
                setActive(i);
              }}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-xs font-semibold transition-colors",
                isActive
                  ? "border-orange-500 bg-orange-500/15 text-white"
                  : "border-white/10 text-navy-100/70 hover:border-white/30 hover:text-white"
              )}
            >
              <TabIcon size={15} className={isActive ? "text-orange-400" : "text-blue-400"} />
              {s.name}
              {isActive && (
                <span
                  key={`${active}-${running}`}
                  className="tour-progress absolute inset-x-0 bottom-0 h-0.5 origin-left bg-orange-500"
                  style={{ animationDuration: `${CYCLE_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                />
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
