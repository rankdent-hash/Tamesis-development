import { stats } from "../data/content";
import { useCountUp, useInView } from "../hooks/useCountUp";

function Stat({ value, suffix, label, decimals }: (typeof stats)[number]) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const raw = useCountUp(decimals ? value * 10 : value, inView);
  const display = decimals ? (raw / 10).toFixed(decimals) : raw.toString();

  return (
    <div ref={ref} className="flex flex-col items-center text-center px-6 py-8 lg:py-0">
      <span className="font-mono font-semibold text-3xl lg:text-4xl text-white tabular-nums">
        {display}
        {suffix}
      </span>
      <span className="mt-2 text-xs lg:text-sm text-navy-100/70 font-medium uppercase tracking-wide">{label}</span>
    </div>
  );
}

export function TrustBar() {
  return (
    <section id="trust-bar" className="relative bg-navy-900">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-navy-700/60">
        {stats.map((stat) => (
          <Stat key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
