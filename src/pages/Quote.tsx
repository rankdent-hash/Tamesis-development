import { useState, type FormEvent } from "react";
import { CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Button } from "../components/ui/button";
import { services, sectors } from "../data/content";
import { cn } from "../lib/utils";

const steps = ["Your Details", "Property & Sector", "The Work", "Review & Submit"];

export function Quote() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    propertyType: "",
    sector: "",
    service: "",
    description: "",
    preferredDate: "",
  });

  const update = (field: keyof typeof form, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet — swap this for a real submit handler when ready.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <PageHero
          eyebrow="Request a Quote"
          title="Get a Clear, No-Obligation Quote"
          subtitle="Tell us a little about the work and we'll come back to you with a clear quote — usually within one working day."
          breadcrumb="Request a Quote"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            {submitted ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-10 text-center">
                <CheckCircle2 size={36} className="mx-auto text-blue-600" />
                <h2 className="mt-4 font-display font-bold text-navy-900 text-2xl">Quote Request Received</h2>
                <p className="mt-2 text-slate max-w-sm mx-auto">
                  Thanks, {form.name || "there"} — our team will review the details and come back to you shortly.
                </p>
              </div>
            ) : (
              <>
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
                        <Field label="Full Name" value={form.name} onChange={(v) => update("name", v)} required />
                        <Field label="Company (optional)" value={form.company} onChange={(v) => update("company", v)} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <Field label="Phone" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required />
                        <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
                      </div>
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Property Type</label>
                        <select
                          value={form.propertyType}
                          onChange={(e) => update("propertyType", e.target.value)}
                          required
                          className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="" disabled>Select property type</option>
                          <option>Residential — House</option>
                          <option>Residential — Flat</option>
                          <option>Commercial</option>
                          <option>Void / Empty Property</option>
                          <option>Communal / Estate</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Sector</label>
                        <select
                          value={form.sector}
                          onChange={(e) => update("sector", e.target.value)}
                          required
                          className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="" disabled>Select sector</option>
                          {sectors.map((s) => (
                            <option key={s.name}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Service Required</label>
                        <select
                          value={form.service}
                          onChange={(e) => update("service", e.target.value)}
                          required
                          className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="" disabled>Select a service</option>
                          {services.map((s) => (
                            <option key={s.slug}>{s.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-navy-800 mb-1.5">Description of Work</label>
                        <textarea
                          value={form.description}
                          onChange={(e) => update("description", e.target.value)}
                          rows={4}
                          required
                          className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                        />
                      </div>
                      <Field
                        label="Preferred Date (optional)"
                        type="date"
                        value={form.preferredDate}
                        onChange={(v) => update("preferredDate", v)}
                      />
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-4">
                      <h3 className="font-display font-semibold text-navy-900">Review Your Request</h3>
                      <dl className="divide-y divide-navy-100 text-sm">
                        {[
                          ["Name", form.name],
                          ["Company", form.company || "—"],
                          ["Phone", form.phone],
                          ["Email", form.email],
                          ["Property Type", form.propertyType],
                          ["Sector", form.sector],
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
                      <Button type="submit" variant="primary">
                        Submit Quote Request
                      </Button>
                    )}
                  </div>
                </form>
              </>
            )}
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
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-navy-800 mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}
