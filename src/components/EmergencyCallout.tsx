import { Phone, AlertCircle } from "lucide-react";
import { company } from "../data/content";

export function EmergencyCallout() {
  return (
    <section className="bg-teal-700">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 py-14 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex items-start gap-4">
          <AlertCircle size={28} className="text-teal-200 shrink-0 mt-1" />
          <div>
            <h2 className="font-display font-bold text-white text-2xl lg:text-3xl leading-tight">
              Need an Emergency Repair?
            </h2>
            <p className="mt-2 text-teal-100/90 max-w-lg">
              Our responsive teams are ready to help across London.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 shrink-0">
          <a
            href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-white text-teal-700 px-7 py-4 text-sm font-bold shadow-card hover:bg-teal-50 transition-colors"
          >
            <Phone size={16} /> Call Job Booking
          </a>
          <a
            href="/emergency"
            className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 text-white px-7 py-4 text-sm font-bold hover:bg-white/10 transition-colors"
          >
            Request Assistance
          </a>
        </div>
      </div>
    </section>
  );
}
