import { Phone, PoundSterling, Zap, ShieldCheck, CheckCircle2 } from "lucide-react";
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
    q: "How much does an electrician charge per hour in London?",
    a: "Typically £45-70 per hour across London, usually with a one-hour minimum call-out. The exact rate depends on the job — straightforward fault-finding sits at the lower end, more complex work at the higher end. We'll always confirm a price before starting.",
  },
  {
    q: "How much does a full house rewire cost?",
    a: "For a typical London property, a full rewire generally runs from around £3,500 for a small flat up to £8,000+ for a larger house, depending on size, access, and how much of the existing wiring can be reused. We'll survey the property and give a fixed quote rather than an estimate.",
  },
  {
    q: "Do you charge a call-out fee?",
    a: "Our pricing includes a one-hour minimum rather than a separate call-out fee — so you're paying for the work itself, not an extra charge just to have someone attend.",
  },
  {
    q: "Can you give a fixed price before starting?",
    a: "For clearly defined jobs, yes. For anything needing a proper look first — fault-finding, a rewire — we'll assess on site and confirm the price before any work begins.",
  },
];

export function ElectricianCostGuide() {
  const path = "/services/electrician-cost-guide";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Electrician Cost Guide London — Hourly Rates & Rewire Prices"
        description="What electricians actually charge in London — hourly rates, full house rewire costs, and what affects the price. Directly employed electricians, fixed quotes."
        path={path}
        image={unsplashUrl("photo-1621905251189-08b45d6a269e", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Electrician Cost Guide", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Electrical Services", "Electrical services and rewiring across London, with clear, honest pricing.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Electrician Cost Guide"
          title="What Does an Electrician Actually Cost in London?"
          subtitle="Real hourly rates and rewire prices, no vague estimates — directly employed electricians, fixed quotes confirmed before we start."
          photo="photo-1621905251189-08b45d6a269e"
          presetService="Electrical Services"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Realistic Pricing, Not Guesswork
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h3 className="font-display font-semibold text-navy-900 text-sm">Hourly Rate</h3>
                <p className="mt-1 text-2xl font-display font-bold text-orange-600">£45–£70</p>
                <p className="mt-2 text-sm text-slate leading-relaxed">
                  Per hour across London, one-hour minimum. Fault-finding and small jobs sit at the lower end.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h3 className="font-display font-semibold text-navy-900 text-sm">Full House Rewire</h3>
                <p className="mt-1 text-2xl font-display font-bold text-orange-600">£3,500–£8,000+</p>
                <p className="mt-2 text-sm text-slate leading-relaxed">
                  Depends on property size, access, and existing wiring condition. Surveyed and quoted in writing.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h3 className="font-display font-semibold text-navy-900 text-sm">EICR Certificate</h3>
                <p className="mt-1 text-2xl font-display font-bold text-orange-600">Fixed Price</p>
                <p className="mt-2 text-sm text-slate leading-relaxed">
                  Required for landlords at least every five years. Priced per property, confirmed upfront.
                </p>
              </div>
              <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                <h3 className="font-display font-semibold text-navy-900 text-sm">Small Jobs</h3>
                <p className="mt-1 text-2xl font-display font-bold text-orange-600">From £45</p>
                <p className="mt-2 text-sm text-slate leading-relaxed">
                  Sockets, switches, light fittings — often completed within the one-hour minimum.
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-light max-w-2xl mx-auto">
              These are realistic ranges to help you budget, not a quote — every property and job is different. Call for an accurate price specific to yours.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              What Affects the Price
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Zap, title: "Scope of work", body: "Fault-finding and small repairs cost far less than a full or partial rewire." },
                { icon: ShieldCheck, title: "Property access and age", body: "Older properties and harder access (period conversions, limited access to voids) can add time." },
                { icon: PoundSterling, title: "Materials needed", body: "A consumer unit upgrade or significant cabling adds to the cost beyond labour alone." },
                { icon: CheckCircle2, title: "Certification required", body: "An EICR or compliance certificate is priced separately from repair or installation work." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-card">
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
              Get a Real Price, Not an Estimate
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
