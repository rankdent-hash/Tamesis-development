import { useState, type FormEvent } from "react";
import { Phone, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Button } from "../components/ui/button";
import { company } from "../data/content";

const emergencyTypes = [
  "Flooding / Burst Pipe",
  "No Heating or Hot Water",
  "Electrical Fault / No Power",
  "Security — Broken Door or Window",
  "Gas Smell / Suspected Leak",
  "Other Urgent Issue",
];

export function Emergency() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // No backend wired up yet — swap this for a real submit handler when ready.
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.emergency.title} description={seoMeta.emergency.description} path="/emergency" />
      <Header />
      <main>
        <PageHero
          eyebrow="Emergency Callout"
          title="Need Urgent Help?"
          subtitle="Our responsive teams are ready to help across London, day or night."
          breadcrumb="Emergency Callout"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            {/* Primary call CTA — the fastest path in a genuine emergency */}
            <div className="rounded-2xl bg-orange-600 text-white p-8 text-center mb-10">
              <AlertTriangle size={30} className="mx-auto text-orange-100" />
              <h2 className="mt-3 font-display font-bold text-2xl">For Genuine Emergencies, Call Us Directly</h2>
              <p className="mt-2 text-orange-50">
                Gas smells, serious flooding or safety risks — don&rsquo;t wait for a form response, call now.
              </p>
              <a
                href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white text-orange-700 px-8 py-4 text-sm font-bold shadow-card hover:bg-orange-50 transition-colors"
              >
                <Phone size={16} /> Call {company.phoneJobBooking}
              </a>
            </div>

            <p className="text-center text-sm text-slate mb-10">
              For urgent — but not immediately dangerous — issues, you can also request assistance below and our
              team will call you back.
            </p>

            {submitted ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-10 text-center">
                <CheckCircle2 size={36} className="mx-auto text-blue-600" />
                <h2 className="mt-4 font-display font-bold text-navy-900 text-2xl">Request Received</h2>
                <p className="mt-2 text-slate max-w-sm mx-auto">
                  We've logged your request as urgent — a member of our team will call you back shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="e-name" className="block text-sm font-medium text-navy-800 mb-1.5">Name</label>
                    <input id="e-name" name="name" type="text" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="e-phone" className="block text-sm font-medium text-navy-800 mb-1.5">Phone</label>
                    <input id="e-phone" name="phone" type="tel" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="e-address" className="block text-sm font-medium text-navy-800 mb-1.5">Property Address</label>
                  <input id="e-address" name="address" type="text" required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                </div>
                <div>
                  <label htmlFor="e-type" className="block text-sm font-medium text-navy-800 mb-1.5">Type of Emergency</label>
                  <select id="e-type" name="type" required defaultValue="" className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white">
                    <option value="" disabled>Select an option</option>
                    {emergencyTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="e-details" className="block text-sm font-medium text-navy-800 mb-1.5">Details</label>
                  <textarea id="e-details" name="details" rows={4} required className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none" />
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center">
                  Request Assistance
                </Button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
