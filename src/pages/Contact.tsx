import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, MapPin, Phone, Clock, AlertCircle, User, MessageSquare, HelpCircle, MessageCircle } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Illustration } from "../components/Illustration";
import { AnimateIn } from "../components/AnimateIn";
import { Button } from "../components/ui/button";
import { company } from "../data/content";
import { submitForm } from "../lib/submitForm";

export function Contact() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const ok = await submitForm("contact", {
      name: String(formData.get("name") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      reason: String(formData.get("reason") || ""),
      message: String(formData.get("message") || ""),
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
      <Seo title={seoMeta.contact.title} description={seoMeta.contact.description} path="/contact" />
      <Header />
      <main>
        <PageHero
          eyebrow="Contact"
          title="Get in Touch"
          subtitle="Whether it's a quote request, a repair to book, or a question about a contract, our team is ready to help."
          breadcrumb="Contact"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-[1fr_1.1fr] gap-14">
            {/* Details */}
            <AnimateIn>
              <div className="space-y-4">
                {[
                  { icon: MapPin, label: "Office", value: company.addressLines.join(", ") },
                  { icon: Phone, label: "Management", value: company.phoneManagement, href: `tel:${company.phoneManagement.replace(/\s/g, "")}` },
                  { icon: Phone, label: "Job Booking", value: company.phoneJobBooking, href: `tel:${company.phoneJobBooking.replace(/\s/g, "")}` },
                  { icon: MessageCircle, label: "WhatsApp", value: company.whatsapp, href: `https://wa.me/44${company.whatsapp.replace(/\s/g, "").replace(/^0/, "")}` },
                  { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
                  { icon: Clock, label: "Opening Hours", value: "Mon–Fri: 8:00–17:30 · Emergency callout available 24/7" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                    <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <item.icon size={20} strokeWidth={1.75} />
                    </span>
                    <div>
                      <span className="block text-xs font-accent uppercase tracking-widest text-slate-light font-semibold">{item.label}</span>
                      {item.href ? (
                        <a href={item.href} className="mt-1 block font-display font-semibold text-navy-900 hover:text-orange-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <span className="mt-1 block font-display font-semibold text-navy-900">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 corner-marks">
                <Illustration icon="MapPin" label="Office location map" className="aspect-[16/10] rounded-2xl" />
              </div>
            </AnimateIn>

            {/* Form */}
            <AnimateIn delay={0.1}>
                <form onSubmit={handleSubmit} className="rounded-2xl border border-navy-100 bg-white p-8 shadow-card space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="c-name" className="block text-sm font-medium text-navy-800 mb-1.5">Name</label>
                      <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="c-name" name="name" type="text" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                    </div>
                    <div>
                      <label htmlFor="c-phone" className="block text-sm font-medium text-navy-800 mb-1.5">Phone</label>
                      <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="c-phone" name="phone" type="tel" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-sm font-medium text-navy-800 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <input id="c-email" name="email" type="email" required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-reason" className="block text-sm font-medium text-navy-800 mb-1.5">Reason for Contact</label>
                    <div className="relative">
                      <HelpCircle size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-700 pointer-events-none" />
                      <select id="c-reason" name="reason" required defaultValue="" className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white">
                        <option value="" disabled>Select an option</option>
                        <option>Request a Quote</option>
                        <option>Report a Repair</option>
                        <option>Emergency Callout</option>
                        <option>Contract / Sector Enquiry</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="c-message" className="block text-sm font-medium text-navy-800 mb-1.5">Message</label>
                    <div className="relative">
                      <MessageSquare size={16} className="absolute left-3.5 top-3.5 text-navy-700 pointer-events-none" />
                      <textarea id="c-message" name="message" rows={5} required className="w-full rounded-lg border-2 border-navy-900 pl-10 pr-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none" />
                    </div>
                  </div>
                  <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
                  <Button type="submit" variant="primary" className="w-full justify-center" disabled={submitting}>
                    {submitting ? "Sending..." : "Send Message"}
                  </Button>
                  {error && (
                    <p className="flex items-center gap-1.5 justify-center text-xs text-red-600">
                      <AlertCircle size={13} /> Something went wrong — please call us instead.
                    </p>
                  )}
                </form>
            </AnimateIn>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
