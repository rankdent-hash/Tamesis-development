import { useState, type FormEvent } from "react";
import { CheckCircle2, ArrowRight, AlertCircle, User, Phone, Wrench } from "lucide-react";
import { services } from "../data/content";
import { submitForm } from "../lib/submitForm";

export function HeroQuoteForm({ presetService }: { presetService?: string }) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [service, setService] = useState(presetService ?? "");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const ok = await submitForm("hero-quote", {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      service: String(formData.get("service") || ""),
      honeypot: String(formData.get("company_website") || ""),
    });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
    } else {
      setError(true);
    }
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

          {/* Honeypot — hidden from real users, catches basic bots */}
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

          <div className="relative">
            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              required
              className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              required
              className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>
          <div className="relative">
            <Wrench size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
            <select
              name="service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              required
              disabled={!!presetService}
              className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-3 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white disabled:bg-navy-50 disabled:text-navy-700"
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
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 text-navy-950 px-5 py-3.5 text-sm font-bold hover:bg-orange-400 transition-colors disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Get My Free Quote"} {!submitting && <ArrowRight size={16} />}
          </button>

          {error && (
            <p className="flex items-center gap-1.5 justify-center text-xs text-red-600">
              <AlertCircle size={13} /> Something went wrong — please call us instead.
            </p>
          )}

          <p className="text-center text-[11px] text-slate-light">No obligation. We'll respond within 1 working day.</p>
        </form>
      )}
    </div>
  );
}
