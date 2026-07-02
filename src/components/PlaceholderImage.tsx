/**
 * Temporary photography placeholder.
 * Replace the `src` prop with a real image URL (or swap this component
 * entirely for an <img> tag) once photography is available.
 */
export function PlaceholderImage({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden bg-navy-900 blueprint-grid ${className}`}
      role="img"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-navy-900/60 via-navy-900/20 to-teal-700/40" />
      <div className="absolute inset-0 flex items-end p-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-navy-100/60 bg-navy-950/40 rounded px-2 py-1">
          {label}
        </span>
      </div>
    </div>
  );
}
