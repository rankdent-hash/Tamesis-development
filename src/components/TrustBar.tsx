import { stats } from "../data/content";
import { useCountUp, useInView } from "../hooks/useCountUp";

function Stat({ value, suffix, label, decimals }: (typeof stats)[number]) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const raw = useCountUp(decimals ? value * 10 : value, inView);
  const display = decimals ? (raw / 10).toFixed(decimals) : raw.toLocaleString("en-GB");

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center bg-navy-900 px-4 py-7 lg:py-9 last:col-span-2 lg:last:col-span-1"
    >
      <span className="font-accent font-semibold text-3xl lg:text-[2.6rem] leading-none text-white tabular-nums">
        {display}
        <span className="text-orange-500">{suffix}</span>
      </span>
      <span className="mt-3 text-[11px] lg:text-xs text-navy-100/65 font-accent uppercase tracking-widest">{label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section id="trust-bar" className="relative z-10 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* Pulled up over the hero so the two sections read as one stage */}
        <div className="relative -mt-16 lg:-mt-[4.5rem] rounded-3xl border border-navy-700 bg-navy-700 shadow-[0_30px_60px_-20px_rgba(5,12,22,0.55)] overflow-hidden">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-px">
            {stats.map((stat) => (
              <Stat key={stat.label} {...stat} />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
