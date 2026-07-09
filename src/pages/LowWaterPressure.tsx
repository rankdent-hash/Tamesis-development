import { Phone, Gauge, Search, Wrench, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "What usually causes low water pressure?",
    a: "Common causes include limescale buildup (especially in London's hard water areas), leaks in the pipework, partially closed valves, or corroded older pipes. We diagnose the actual cause rather than guessing.",
  },
  {
    q: "Is it just one tap, or the whole house?",
    a: "If it's isolated to one tap or shower, it's often a blocked aerator or local issue. If it's the whole property, it usually points to a supply or pipework problem — worth a proper assessment either way.",
  },
  {
    q: "Can low pressure indicate a bigger problem?",
    a: "Sometimes — a sudden drop can indicate a leak or even a water main issue. We'll assess it properly and tell you honestly what's going on.",
  },
  {
    q: "Do you provide a fixed price before starting?",
    a: "Always. We'll assess the issue and confirm the cost before any work begins.",
  },
];

export function LowWaterPressure() {
  const path = "/services/low-water-pressure";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Low Water Pressure London — Diagnosed & Fixed"
        description="Weak shower or slow-filling taps? Directly employed engineers diagnose and fix low water pressure across London."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Low Water Pressure", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Low Water Pressure Diagnosis & Repair", "Low water pressure diagnosis and repair across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Low Water Pressure"
          title="Weak Shower, Slow Taps? We'll Find Why."
          subtitle="Low water pressure has a real cause — limescale, a leak, or ageing pipework. Directly employed engineers diagnose it properly, across every London borough."
          photo="photo-1749532125405-70950966b0e5"
          presetService="Plumbing and Drainage"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              London's Hard Water Makes This a Common Problem
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Gauge, title: "Proper diagnosis", body: "We identify whether it's limescale, a leak, a valve, or pipework — not guesswork." },
                { icon: Search, title: "Whole-house or one tap", body: "Isolated or property-wide, we assess it the right way for the actual symptom." },
                { icon: Wrench, title: "Fixed properly", body: "From descaling to pipework repairs, sorted at the source, not just patched." },
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
              Get Your Water Pressure Sorted
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
