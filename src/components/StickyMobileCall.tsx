import { Phone } from "lucide-react";
import { company } from "../data/content";

export function StickyMobileCall() {
  return (
    <a
      href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-center gap-2 bg-orange-500 text-white py-3.5 text-sm font-bold shadow-[0_-4px_16px_rgba(11,31,58,0.18)]"
      style={{ paddingBottom: "calc(0.875rem + env(safe-area-inset-bottom))" }}
    >
      <Phone size={16} /> Call {company.phoneJobBooking}
    </a>
  );
}
