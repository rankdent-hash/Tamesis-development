import { useState, type FormEvent } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { services } from "../data/content";

export function HeroQuoteForm({ presetService }: { presetService?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState(presetService ?? "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet — swap this for a real submit handler when ready.
    setSubmitted(true);
  };

  return (
    <div className="corner-marks rounded-2xl bg-paper/98 backdrop-blur-sm shadow-card-hover p-6 sm:p-7 w-full max-w-md lg:max-w-none">
      {submitted ? (
        <div className="py-6 text-center">
          <CheckCircle2 size={32} className="mx-auto text-green-500" />
          <h3 className="mt-3 font-display font-semibold text-navy-900 text-lg">Request Received</h3>
          <p className="mt-1.5 text-sm text-slate">We'll be in touch shortly to confirm the details.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <span className="text-[11px] font-accent uppercase tracking-widest text-orange-600 font-semibold">
              Free Quote
            </span>
            <h3 className="mt-1 font-display font-bold text-navy-900 text-xl leading-tight">
              Get a Quote in Minutes
            </h3>
          </div>

          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            className="w-full rounded-lg border border-navy-100 px-4 py-3 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone number"
            required
            className="w-full rounded-lg border border-navy-100 px-4 py-3 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none"
          />
          <select
            name="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            disabled={!!presetService}
            className="w-full rounded-lg border border-navy-100 px-4 py-3 text-sm focus:border-orange-400 focus:ring-1 focus:ring-orange-400 outline-none bg-white disabled:bg-navy-50 disabled:text-navy-700"
          >
            <option value="" disabled>
              What do you need?
            </option>
            <option value="General Enquiry">General Enquiry</option>
            {services.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 text-navy-950 px-5 py-3.5 text-sm font-bold hover:bg-orange-400 transition-colors"
          >
            Get My Free Quote <ArrowRight size={16} />
          </button>

          <p className="text-center text-[11px] text-slate-light">No obligation. We'll respond within 1 working day.</p>
        </form>
      )}
    </div>
  );
}
