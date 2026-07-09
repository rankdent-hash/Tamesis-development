import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, AlertCircle, User, Building2, Phone, Mail, Home, MessageSquare, Calendar, type LucideIcon } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { ServiceSelect } from "../components/ServiceSelect";
import { cn } from "../lib/utils";
import { submitForm } from "../lib/submitForm";

const steps = ["Your Details", "The Work", "Review & Submit"];

export function Quote() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    propertyType: "",
    service: "",
    description: "",
    preferredDate: "",
  });

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const ok = await submitForm("quote", { ...form });
    setSubmitting(false);
    if (ok) {
      navigate("/thank-you");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.quote.title} description={seoMeta.quote.description} path="/quote" />
      <Header />
      <main>
        <div className="pt-20 lg:pt-24 pb-2 px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm text-slate leading-snug">
              We&rsquo;ll come back to you within one working day.
            </p>
            <h1 className="mt-1 font-display font-bold text-navy-900 text-base sm:text-lg leading-snug">
              Get a Free Quote
            </h1>
          </div>
        </div>

        <section className="py-8 lg:py-12">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
                {/* Progress bar */}
                <div className="mb-10">
                  <div className="flex justify-between mb-2">
                    {steps.map((s, i) => (
                      <span
                        key={s}
                        className={cn(
                          "text-xs font-accent font-semibold uppercase tracking-wide",
                          i <= step ? "text-orange-600" : "text-slate-light"
                        )}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="h-1.5 rounded-full bg-navy-100 overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-300"
                      style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card">
                  {step === 0 && (
                    <div className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required icon={User} />
                        <Field label="Company (optional)" value={form.company} onChange={(v) => update("company", v)} icon={Building2} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required icon={Phone} />
                        <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required icon={Mail} />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Property Type</label>
                        <div className="relative">
                          <Home size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                          <select
                            value={form.propertyType}
                            onChange={(e) => update("propertyType", e.target.value)}
                            required
                            className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white"
                          >
                            <option value="" disabled>Select property type</option>
                            <option>Residential — House</option>
                            <option>Residential — Flat</option>
                            <option>Commercial</option>
                            <option>Void / Empty Property</option>
                            <option>Communal / Estate</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Service Required</label>
                        <ServiceSelect value={form.service} onChange={(v) => update("service", v)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Description of Work</label>
                        <div className="relative">
                          <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-navy-700 pointer-events-none" />
                          <textarea
                            value={form.description}
                            onChange={(e) => update("description", e.target.value)}
                            rows={4}
                            required
                            placeholder={
                              form.service === "Other"
                                ? "Please describe the service you need — we'll match you with the right team"
                                : undefined
                            }
                            className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
                          />
                        </div>
                      </div>
                      <Field
                        label="Preferred Date (optional)"
                        type="date"
                        value={form.preferredDate}
                        onChange={(v) => update("preferredDate", v)}
                        icon={Calendar}
                      />
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-4">
                      <h3 className="font-display font-semibold text-navy-900">Review Your Request</h3>
                      <dl className="divide-y divide-navy-100 text-sm">
                        {[
                          ["Name", form.name],
                          ["Company", form.company || "—"],
                          ["Phone", form.phone],
                          ["Email", form.email],
                          ["Property Type", form.propertyType],
                          ["Service", form.service],
                          ["Description", form.description],
                          ["Preferred Date", form.preferredDate || "No preference"],
                        ].map(([label, value]) => (
                          <div key={label} className="flex justify-between gap-4 py-2.5">
                            <dt className="text-slate-light">{label}</dt>
                            <dd className="text-navy-900 font-medium text-right">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  )}

                  <div className="mt-8 flex justify-between gap-4">
                    {step > 0 ? (
                      <Button type="button" variant="outline" onClick={back}>
                        <ArrowLeft size={16} /> Back
                      </Button>
                    ) : (
                      <span />
                    )}
                    {step < steps.length - 1 ? (
                      <Button type="button" variant="primary" onClick={next}>
                        Next <ArrowRight size={16} />
                      </Button>
                    ) : (
                      <Button type="submit" variant="primary" disabled={submitting}>
                        {submitting ? "Sending..." : "Submit Quote Request"}
                      </Button>
                    )}
                  </div>
                  {error && (
                    <p className="mt-4 flex items-center gap-1.5 justify-center text-xs text-red-600">
                      <AlertCircle size={13} /> Something went wrong — please call us instead.
                    </p>
                  )}
                </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  icon: FieldIcon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-800 mb-1.5">{label}</label>
      <div className="relative">
        {FieldIcon && <FieldIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className={cn(
            "w-full rounded-lg border-2 border-navy-900 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none",
            FieldIcon ? "pl-10 pr-4" : "px-4"
          )}
        />
      </div>
    </div>
  );
}
