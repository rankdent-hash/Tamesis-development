import { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle, MessageCircle, Wrench } from "lucide-react";
import { services, serviceCategories } from "../data/content";
import { Icon } from "./Icon";
import { cn } from "../lib/utils";

export function ServiceSelect({
  value,
  onChange,
  disabled = false,
  compact = false,
  name = "service",
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  compact?: boolean;
  name?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const selectedService = services.find((s) => s.name === value);
  const isOther = value === "Other";
  const isGeneral = value === "General Enquiry";

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2.5 rounded-lg border-2 border-navy-900 pl-10 pr-3 text-sm text-left bg-white disabled:bg-navy-50 disabled:text-navy-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none relative",
          compact ? "py-2.5" : "py-3"
        )}
      >
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-navy-700 shrink-0 pointer-events-none">
          {selectedService ? (
            <Icon name={selectedService.icon} size={16} strokeWidth={1.75} />
          ) : isOther || isGeneral ? (
            <HelpCircle size={16} />
          ) : (
            <Wrench size={16} />
          )}
        </span>
        <span className={cn("flex-1 truncate", !value && "text-slate-light")}>
          {value || "What do you need?"}
        </span>
        <ChevronDown size={15} className={cn("shrink-0 text-slate-light transition-transform", open && "rotate-180")} />
      </button>

      {/* Keeps FormData-based submission working (e.g. HeroQuoteForm reads
          the form via new FormData(e.currentTarget)) since this is a custom
          button-based widget, not a real form-associated <select>. */}
      <input type="hidden" name={name} value={value} />

      {open && !disabled && (
        <div className="absolute z-30 left-0 right-0 mt-1.5 max-h-72 overflow-y-auto rounded-xl border-2 border-navy-900 bg-white shadow-card-hover">
          <button
            type="button"
            onClick={() => choose("General Enquiry")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-navy-50 transition-colors border-b border-navy-100",
              isGeneral && "bg-navy-50"
            )}
          >
            <MessageCircle size={16} className="text-navy-700 shrink-0" />
            General Enquiry
          </button>

          {serviceCategories.map((category) => (
            <div key={category}>
              <div className="px-3.5 pt-2.5 pb-1 text-[10px] font-accent uppercase tracking-widest text-slate-light font-semibold">
                {category}
              </div>
              {services
                .filter((s) => s.category === category)
                .map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => choose(s.name)}
                    className={cn(
                      "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-orange-50 hover:text-orange-700 transition-colors",
                      value === s.name && "bg-orange-50 text-orange-700"
                    )}
                  >
                    <Icon name={s.icon} size={16} className="shrink-0" strokeWidth={1.75} />
                    {s.name}
                  </button>
                ))}
            </div>
          ))}

          <button
            type="button"
            onClick={() => choose("Other")}
            className={cn(
              "w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-left hover:bg-navy-50 transition-colors border-t border-navy-100",
              isOther && "bg-navy-50"
            )}
          >
            <HelpCircle size={16} className="text-navy-700 shrink-0" />
            Other (please describe below)
          </button>
        </div>
      )}
    </div>
  );
}
