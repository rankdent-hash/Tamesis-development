import { useState, type FormEvent } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Button } from "../components/ui/button";
import { company } from "../data/content";

export function ReportRepair() {
  const [submitted, setSubmitted] = useState(false);

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
          eyebrow="Report a Repair"
          title="Report a Repair"
          subtitle="Tell us what's wrong and where, and our job booking team will get it scheduled."
          breadcrumb="Report a Repair"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-2xl px-6 lg:px-8">
            <div className="mb-8 rounded-2xl border border-orange-100 bg-orange-50 p-6 flex items-center gap-4">
              <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-full bg-orange-500 text-white">
                <Phone size={18} />
              </span>
              <p className="text-sm text-navy-800">
                For anything urgent — flooding, no heating in winter, security issues — please{" "}
                <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="font-semibold text-orange-700 underline">
                  call Job Booking on {company.phoneJobBooking}
                </a>{" "}
                rather than using this form, or use our{" "}
                <a href="/emergency" className="font-semibold text-orange-700 underline">Emergency Callout</a> page.
              </p>
            </div>

            {submitted ? (
              <div className="rounded-2xl border border-blue-100 bg-blue-50 p-10 text-center">
                <CheckCircle2 size={36} className="mx-auto text-blue-600" />
                <h2 className="mt-4 font-display font-bold text-navy-900 text-2xl">Repair Reported</h2>
                <p className="mt-2 text-slate max-w-sm mx-auto">
                  Thanks — our job booking team will review this and get in touch to schedule the work.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="r-name" className="block text-sm font-medium text-navy-800 mb-1.5">Name</label>
                    <input id="r-name" name="name" type="text" required className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label htmlFor="r-phone" className="block text-sm font-medium text-navy-800 mb-1.5">Phone</label>
                    <input id="r-phone" name="phone" type="tel" required className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                <div>
                  <label htmlFor="r-address" className="block text-sm font-medium text-navy-800 mb-1.5">Property Address</label>
                  <input id="r-address" name="address" type="text" required className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label htmlFor="r-issue" className="block text-sm font-medium text-navy-800 mb-1.5">Describe the Issue</label>
                  <textarea id="r-issue" name="issue" rows={5} required className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-none" placeholder="What's wrong, where in the property, and how long it's been an issue" />
                </div>
                <div>
                  <label htmlFor="r-access" className="block text-sm font-medium text-navy-800 mb-1.5">Access Notes (optional)</label>
                  <input id="r-access" name="access" type="text" placeholder="e.g. key held by neighbour, buzzer code, best times to attend" className="w-full rounded-lg border border-navy-200 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
                </div>
                <Button type="submit" variant="primary" className="w-full justify-center">
                  Report Repair
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
