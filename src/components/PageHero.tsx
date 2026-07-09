import { ChevronRight } from "lucide-react";

export function PageHero({
  eyebrow,
  title,
  subtitle,
  breadcrumb,
  compact = false,
  showBreadcrumb = true,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  compact?: boolean;
  showBreadcrumb?: boolean;
}) {
  return (
    <section
      className={
        compact
          ? "relative pt-28 lg:pt-32 pb-10 lg:pb-12 overflow-hidden bg-navy-950"
          : "relative pt-40 lg:pt-48 pb-16 lg:pb-20 overflow-hidden bg-navy-950"
      }
    >
      <div className="absolute inset-0 bg-navy-900 blueprint-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        {showBreadcrumb && breadcrumb && (
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-navy-100/60 font-medium mb-6">
            <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            <ChevronRight size={12} />
            <span className="text-navy-100/90">{breadcrumb}</span>
          </nav>
        )}

        <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">{eyebrow}</span>
        <h1
          className={
            compact
              ? "mt-3 font-display font-extrabold text-white text-2xl sm:text-3xl leading-[1.15] max-w-2xl text-balance"
              : "mt-4 font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.1] max-w-2xl text-balance"
          }
        >
          {title}
        </h1>
        {subtitle && (
          <p className={compact ? "mt-3 text-navy-100/75 max-w-xl leading-relaxed" : "mt-4 text-navy-100/75 max-w-xl leading-relaxed"}>
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
