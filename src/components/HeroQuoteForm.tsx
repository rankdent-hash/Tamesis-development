import { useState, type FormEvent } from "react";
import { CheckCircle2, ArrowRight, AlertCircle, User, Phone, Mail, MessageSquare } from "lucide-react";
import { submitForm } from "../lib/submitForm";
import { cn } from "../lib/utils";
import { ServiceSelect } from "./ServiceSelect";

export function HeroQuoteForm({
  presetService,
  compact = false,
}: {
  presetService?: string;
  compact?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [service, setService] = useState(presetService ?? "");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const ok = await submitForm("hero-quote", {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      service: String(formData.get("service") || ""),
      ...(message ? { message } : {}),
      honeypot: String(formData.get("company_website") || ""),
    });
    setSubmitting(false);
    if (ok) {
      setSubmitted(true);
    } else {
      setError(true);
    }
  };

  const fieldPad = compact ? "py-2.5" : "py-3";

  return (
    <div
      className={cn(
        "corner-marks rounded-2xl bg-paper/98 backdrop-blur-sm shadow-card-hover w-full",
        compact ? "p-5 max-w-[22rem] lg:max-w-[22rem]" : "p-6 sm:p-7 max-w-md lg:max-w-none"
      )}
    >
      {submitted ? (
        <div className={compact ? "py-4 text-center" : "py-6 text-center"}>
          <CheckCircle2 size={compact ? 26 : 32} className="mx-auto text-green-500" />
          <h3 className="mt-3 font-display font-semibold text-navy-900 text-lg">Request Received</h3>
          <p className="mt-1.5 text-sm text-slate">We'll be in touch shortly to confirm the details.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={compact ? "space-y-2.5" : "space-y-3.5"}>
          <div>
            <span className="text-[11px] font-accent uppercase tracking-widest text-orange-600 font-semibold">
              Free Quote
            </span>
            <h3 className={cn("mt-1 font-display font-bold text-navy-900 leading-tight", compact ? "text-lg" : "text-xl")}>
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
              className={cn(
                "w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none",
                fieldPad
              )}
            />
          </div>
          <div className="relative">
            <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              required
              className={cn(
                "w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none",
                fieldPad
              )}
            />
          </div>
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              required
              className={cn(
                "w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none",
                fieldPad
              )}
            />
          </div>

          <ServiceSelect value={service} onChange={setService} disabled={!!presetService} compact={compact} />

          <div className="relative">
            <MessageSquare size={16} className="absolute left-3.5 top-3 text-navy-700 pointer-events-none" />
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={service === "Other" ? "Briefly describe what you need" : "Anything else we should know? (optional)"}
              rows={2}
              required={service === "Other"}
              className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full inline-flex items-center justify-center gap-2 rounded-lg bg-orange-500 text-navy-950 px-5 text-sm font-bold hover:bg-orange-400 transition-colors disabled:opacity-60",
              compact ? "py-3" : "py-3.5"
            )}
          >
            {submitting ? "Sending..." : "Get My Free Quote"} {!submitting && <ArrowRight size={16} />}
          </button>

          {error && (
            <p className="flex items-center gap-1.5 justify-center text-xs text-red-600">
              <AlertCircle size={13} /> Something went wrong — please call us instead.
            </p>
          )}

          {!compact && (
            <p className="text-center text-[11px] text-slate-light">No obligation. We'll respond within 1 working day.</p>
          )}
        </form>
      )}
    </div>
  );
}
