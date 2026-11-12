import { Phone, Siren } from "lucide-react";
import { company } from "../data/content";

export function EmergencyCallout() {
  return (
    <section className="relative bg-orange-500 overflow-hidden">
      {/* Hazard-tape edge */}
      <div
        className="absolute inset-x-0 top-0 h-2 opacity-90"
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, #050C16 0 14px, transparent 14px 28px)",
        }}
        aria-hidden="true"
      />
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-400 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 py-14 lg:py-16 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
        <div className="flex items-start gap-5">
          <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-navy-950 text-orange-400 shadow-[0_14px_30px_-10px_rgba(5,12,22,0.7)]">
            <span className="absolute inset-0 rounded-2xl bg-navy-950 animate-ping opacity-20" />
            <Siren size={26} className="relative" />
          </span>
          <div>
            <h2 className="font-display font-extrabold text-navy-950 text-2xl lg:text-4xl leading-tight">
              Need an Emergency Repair?
            </h2>
            <p className="mt-2 text-navy-950/80 font-medium max-w-lg">
              Our responsive teams are ready to help across London.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <a
            href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2.5 rounded-full bg-navy-950 text-white px-7 py-4 text-sm font-bold shadow-[0_14px_30px_-10px_rgba(5,12,22,0.7)] hover:bg-navy-800 transition-colors"
          >
            <Phone size={16} className="text-orange-400" /> Call {company.phoneJobBooking}
          </a>
          <a
            href="/emergency"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-950 text-navy-950 px-7 py-4 text-sm font-bold hover:bg-navy-950 hover:text-white transition-colors"
          >
            Request Assistance
          </a>
        </div>
      </div>
    </section>
  );
}
