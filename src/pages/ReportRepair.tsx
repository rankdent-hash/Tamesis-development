import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, AlertCircle, User, MessageSquare, MapPin, KeyRound } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Button } from "../components/ui/button";
import { company } from "../data/content";
import { submitForm } from "../lib/submitForm";

export function ReportRepair() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const ok = await submitForm("report-repair", {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      address: String(formData.get("address") || ""),
      issue: String(formData.get("issue") || ""),
      access: String(formData.get("access") || ""),
      honeypot: String(formData.get("company_website") || ""),
    });
    setSubmitting(false);
    if (ok) {
      navigate("/thank-you");
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.reportRepair.title} description={seoMeta.reportRepair.description} path="/report-repair" />
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

            <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="r-name" className="block text-sm font-medium text-navy-800 mb-1.5">Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="r-name" name="name" type="text" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="r-phone" className="block text-sm font-medium text-navy-800 mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="r-phone" name="phone" type="tel" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="r-address" className="block text-sm font-medium text-navy-800 mb-1.5">Property Address</label>
                  <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="r-address" name="address" type="text" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                </div>
                <div>
                  <label htmlFor="r-issue" className="block text-sm font-medium text-navy-800 mb-1.5">Describe the Issue</label>
                  <div className="relative">
                      <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-navy-700 pointer-events-none" />
                      <textarea id="r-issue" name="issue" rows={5} required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none" placeholder="What's wrong, where in the property, and how long it's been an issue" />
                    </div>
                </div>
                <div>
                  <label htmlFor="r-access" className="block text-sm font-medium text-navy-800 mb-1.5">Access Notes (optional)</label>
                  <div className="relative">
                      <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="r-access" name="access" type="text" placeholder="e.g. key held by neighbour, buzzer code, best times to attend" className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                </div>
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
                  {submitting ? "Sending..." : "Report Repair"}
                </Button>
                {error && (
                  <p className="flex items-center gap-1.5 justify-center text-xs text-red-600">
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
