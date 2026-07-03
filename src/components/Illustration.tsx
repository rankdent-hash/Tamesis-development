import { Icon } from "./Icon";

// Simple deterministic hash so the same label always produces the same
// layout (stable across re-renders / builds), while different labels get
// visually distinct compositions.
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function Illustration({
  icon,
  label,
  className = "",
}: {
  icon: string;
  label: string;
  className?: string;
}) {
  const seed = hashString(label);
  const accent = seed % 2 === 0 ? "#C6A15B" : "#74886C"; // brass / sage, alternating by item
  const accentSoft = seed % 2 === 0 ? "#D4B67C" : "#93A48C";

  // Deterministic-but-varied positions for the decorative shapes, derived
  // from the hash so each label gets its own arrangement.
  const shape1 = { cx: 20 + (seed % 25), cy: 15 + ((seed >> 3) % 20), r: 26 + (seed % 14) };
  const shape2 = { cx: 78 + ((seed >> 5) % 15), cy: 70 + ((seed >> 2) % 20), size: 30 + (seed % 20) };
  const shape3 = { cx: 82 - (seed % 20), cy: 22 + ((seed >> 4) % 15), r: 10 + (seed % 8) };
  const rotate = seed % 360;

  return (
    <div className={`relative overflow-hidden bg-navy-900 ${className}`} role="img" aria-label={label}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
        <defs>
          <linearGradient id={`bg-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0E1611" />
            <stop offset="100%" stopColor="#070B09" />
          </linearGradient>
          <pattern id={`grid-${seed}`} width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#93A48C" strokeOpacity="0.16" strokeWidth="0.3" />
          </pattern>
        </defs>

        <rect width="100" height="100" fill={`url(#bg-${seed})`} />
        <rect width="100" height="100" fill={`url(#grid-${seed})`} />

        <circle cx={shape1.cx} cy={shape1.cy} r={shape1.r} fill={accent} opacity="0.12" />
        <circle cx={shape3.cx} cy={shape3.cy} r={shape3.r} fill={accentSoft} opacity="0.18" />
        <rect
          x={shape2.cx - shape2.size / 2}
          y={shape2.cy - shape2.size / 2}
          width={shape2.size}
          height={shape2.size}
          rx="8"
          fill={accent}
          opacity="0.10"
          transform={`rotate(${rotate} ${shape2.cx} ${shape2.cy})`}
        />

        {/* Corner brackets — echoes the site's engineering/blueprint motif */}
        <path d="M6 14 V6 H14" fill="none" stroke={accentSoft} strokeWidth="1" opacity="0.5" />
        <path d="M94 86 V94 H86" fill="none" stroke={accentSoft} strokeWidth="1" opacity="0.5" />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex items-center justify-center rounded-2xl w-20 h-20 sm:w-24 sm:h-24 backdrop-blur-sm"
          style={{ backgroundColor: `${accent}26`, border: `1px solid ${accent}55` }}
        >
          <Icon name={icon} size={40} strokeWidth={1.5} color="white" />
        </span>
      </div>
    </div>
  );
}
