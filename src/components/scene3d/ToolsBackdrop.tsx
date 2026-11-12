import { Suspense, lazy, useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { cn } from "../../lib/utils";

// three.js stays out of the initial bundle: the scene chunk is only fetched
// once its section is near the viewport and the browser is idle, and it
// fades in over the CSS backdrop — so there's nothing to wait for and no
// layout shift if WebGL is slow or unavailable.
const ToolsScene = lazy(() => import("./ToolsScene"));

export function ToolsBackdrop({
  anchorRefs,
  floor = false,
  ringScale,
  className,
}: {
  anchorRefs: RefObject<HTMLElement | null>[];
  floor?: boolean;
  ringScale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let idle = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        idle = window.setTimeout(() => setMounted(true), 250);
      },
      { rootMargin: "300px" }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(idle);
    };
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 transition-opacity duration-1000",
        ready ? "opacity-100" : "opacity-0",
        className
      )}
    >
      {mounted && (
        <Suspense fallback={null}>
          <ToolsScene anchorRefs={anchorRefs} floor={floor} ringScale={ringScale} onReady={handleReady} />
        </Suspense>
      )}
    </div>
  );
}
