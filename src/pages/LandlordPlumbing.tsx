import { Phone, FileCheck, Users, Clock, ShieldCheck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { unsplashUrl } from "../data/photos";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "Can you issue Gas Safety Certificates (CP12)?",
    a: "Yes — our Gas Safe registered engineers carry out annual gas safety checks and issue your CP12 certificate, with a reminder ahead of renewal so you're never caught out.",
  },
  {
    q: "Do you work with letting agents as well as individual landlords?",
    a: "Yes, we work directly with landlords and with managing agents on behalf of their landlord clients — one point of contact either way, with clear reporting after every visit.",
  },
  {
    q: "How fast can you respond to a tenant's plumbing issue?",
    a: "Urgent issues (no heating, no hot water, a leak) are prioritised and typically actioned the same day. Routine repairs are scheduled at a time that works for your tenant.",
  },
  {
    q: "Can you manage plumbing across multiple properties?",
    a: "Yes — many of our landlord and agency clients use us as a single point of contact across their whole portfolio, rather than juggling different tradespeople property by property.",
  },
];

export function LandlordPlumbing() {
  const path = "/services/landlord-plumbing";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Landlord Plumbing & Gas Safety Certificates — London"
        description="Gas Safety Certificates, tenant repairs and rental property plumbing maintenance from a directly employed team. One reliable contact for your whole portfolio."
        path={path}
        image={unsplashUrl("photo-1621983209352-c2880ac507b2", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Landlord Plumbing", path },
          ]),
          faqJsonLd(faqs),
          serviceJsonLd("Landlord Plumbing & Compliance", "Gas safety certificates and rental property plumbing across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="For Landlords & Agents"
          title="Reliable Plumbing & Gas Safety for Your Rental Properties"
          subtitle="Gas Safety Certificates, tenant repairs, and ongoing maintenance — from directly employed engineers who won't let a compliance deadline slip. One contact, whatever the portfolio size."
          photo="photo-1621983209352-c2880ac507b2"
          presetService="Plumbing and Drainage"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Everything a Rental Property Needs, From One Contractor
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: FileCheck, title: "Gas Safety Certificates (CP12)", body: "Gas Safe registered engineers, annual checks, renewal reminders — never miss a legal deadline." },
                { icon: Clock, title: "Fast tenant repairs", body: "Urgent issues actioned same-day, so tenant complaints don't become tenant complaints about you." },
                { icon: Users, title: "One contact, any portfolio size", body: "Whether it's one flat or fifty, you deal with the same reliable team every time." },
                { icon: ShieldCheck, title: "Full compliance paper trail", body: "Documented reporting after every visit — useful for your own records and any future dispute." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <item.icon size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-navy-900 text-sm">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate">
              With the Renters' Rights Act now in force, property condition matters more than ever — read{" "}
              <a href="/blog/renters-rights-act-what-london-landlords-need-to-know" className="text-orange-600 font-semibold hover:underline">
                what changed for London landlords
              </a>
              .
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center">Working With Us</h2>
            <div className="mt-10 grid sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Get in touch", body: "Tell us about your property or portfolio and what you need." },
                { step: "2", title: "We set up your schedule", body: "Gas safety renewals tracked, routine maintenance planned around you." },
                { step: "3", title: "One team, ongoing", body: "The same directly employed engineers, every time, with reporting you can rely on." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-orange-500 text-navy-950 font-display font-bold">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-display font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-10">Common Questions</h2>
            <Faq items={faqs} />
          </div>
        </section>

        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Talk to Us About Your Rental Properties
            </h2>
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all"
            >
              <Phone size={20} /> Call Now — {company.phoneJobBooking}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
