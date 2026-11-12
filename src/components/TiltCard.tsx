import { useRef, type PointerEvent, type ReactNode } from "react";
import { cn } from "../lib/utils";

/**
 * Link card that leans toward the cursor in 3D. The tilt is written straight
 * to CSS variables (no React state, no re-render per mouse move); the
 * `.tilt-card` rules in index.css turn them into a transform and switch the
 * effect off for touch input and reduced-motion users.
 */
export function TiltCard({
  href,
  className,
  children,
  max = 9,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  max?: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(px - 0.5) * 2 * max}deg`);
    el.style.setProperty("--rx", `${(0.5 - py) * 2 * max}deg`);
    el.style.setProperty("--gx", `${px * 100}%`);
    el.style.setProperty("--gy", `${py * 100}%`);
    el.dataset.tilting = "true";
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--rx", "0deg");
    delete el.dataset.tilting;
  };

  return (
    <a ref={ref} href={href} onPointerMove={onMove} onPointerLeave={onLeave} className={cn("tilt-card group", className)}>
      <span className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
      {children}
    </a>
  );
}
