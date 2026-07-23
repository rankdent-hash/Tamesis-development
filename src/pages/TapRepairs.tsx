import { Phone, Droplet, PoundSterling, Wrench, CheckCircle2 } from "lucide-react";
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
    q: "Is a dripping tap really worth calling a plumber for?",
    a: "A single drip can waste over 5,000 litres of water a year and often signals a worn washer or valve that only gets worse. It's usually a quick, inexpensive fix — worth sorting before it costs more.",
  },
  {
    q: "Can you fix any type of tap?",
    a: "Yes — traditional washer taps, modern mixer taps, and kitchen or bathroom taps of any make. If a part needs replacing entirely, we'll quote you clearly before doing so.",
  },
  {
    q: "How long does a tap repair take?",
    a: "Most tap repairs are completed in a single visit, usually within an hour.",
  },
  {
    q: "Do you provide a fixed price before starting?",
    a: "Always. We'll assess the tap and confirm the cost before any work begins.",
  },
];

export function TapRepairs() {
  const path = "/services/tap-repairs";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Dripping Tap Repair London — Fast, Fixed Price"
        description="Dripping or leaking tap? Directly employed engineers fix it fast, fixed price, across London. Call now or book online."
        path={path}
        image={unsplashUrl("photo-1749532125405-70950966b0e5", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Tap Repairs", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Tap Repairs", "Dripping and leaking tap repairs across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Tap Repairs"
          title="Dripping Tap? Fixed Fast, Fixed Price."
          subtitle="A dripping tap wastes water and money every single day. Directly employed engineers, usually sorted in a single visit, across every London borough."
          photo="photo-1749532125405-70950966b0e5"
          presetService="Plumbing and Drainage"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Small Drip, Real Cost — Worth Fixing Properly
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Droplet, title: "Any tap, any make", body: "Washer taps, mixer taps, kitchen or bathroom — we fix them all." },
                { icon: PoundSterling, title: "Stops wasted water", body: "A single drip can waste 5,000+ litres a year — and inflate your bill." },
                { icon: Wrench, title: "Usually one visit", body: "Most tap repairs are diagnosed and fixed within the hour." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "You'll know the cost before we start — no surprises." },
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
              Stop That Drip Today
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
