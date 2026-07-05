import { CopyButton } from "./CopyButton";

export function CopyableText({ value, label, className = "" }: { value: string; label: string; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-navy-900">{value}</span>
      <CopyButton value={value} label={label} />
    </div>
  );
}
