import { Phone } from "lucide-react";
import { company } from "../data/content";

export function CtaPhoneLine({ dark = true }: { dark?: boolean }) {
  return (
    <a
      href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
      className={`mt-6 inline-flex items-center gap-2 text-sm font-accent transition-colors ${
        dark ? "text-navy-100/70 hover:text-orange-400" : "text-slate hover:text-orange-600"
      }`}
    >
      <Phone size={14} /> Or call us now on {company.phoneJobBooking}
    </a>
  );
}
