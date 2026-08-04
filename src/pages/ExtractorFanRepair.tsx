import { Phone, AlertCircle } from "lucide-react";
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
    q: "My bathroom extractor fan has stopped working — what's usually wrong?",
    a: "Most commonly a worn motor, a tripped connection, or a blocked vent. We diagnose it properly rather than guessing — often it's a straightforward fix rather than a full replacement.",
  },
  {
    q: "How much does extractor fan installation cost?",
    a: "For a straightforward like-for-like replacement, typically £80-150 including the unit. A new installation where ducting or wiring needs to be run costs more — we'll survey and confirm a fixed price before starting.",
  },
  {
    q: "Do I need an electrician for this, or can a handyman do it?",
    a: "Extractor fans involve a mains electrical connection, so this needs someone qualified to work on it safely — our electricians handle this as standard, not a general handyman job.",
  },
  {
    q: "Why does my bathroom still get condensation with the fan running?",
    a: "Often the fan is undersized for the room, poorly positioned, or venting into a loft space rather than outside. We check the whole setup, not just whether the fan spins.",
  },
];

export function ExtractorFanRepair() {
  const path = "/services/extractor-fan-repair-installation";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Extractor Fan Repair & Installation London"
        description="Bathroom and kitchen extractor fan not working, or need a new one installed? Directly employed electricians, fixed pricing, across London."
        path={path}
        image={unsplashUrl("photo-1621905251189-08b45d6a269e", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Extractor Fan Repair & Installation", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Extractor Fan Repair & Installation", "Bathroom and kitchen extractor fan repair and installation across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Extractor Fans"
          title="Extractor Fan Not Working? We'll Fix It or Fit a New One"
          subtitle="Bathroom and kitchen extractor fans, repaired or installed — directly employed electricians, fixed price confirmed before we start."
          photo="photo-1621905251189-08b45d6a269e"
          presetService="Electrical Services"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Common Extractor Fan Problems We Fix
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { title: "Fan not turning on at all", body: "Often a wiring fault or a failed switch, not necessarily the fan itself." },
                { title: "Running but not extracting properly", body: "Blocked ducting, a failed motor, or a fan that's simply undersized for the room." },
                { title: "Noisy or rattling fan", body: "Usually a worn bearing or a loose mounting — fixable without full replacement in most cases." },
                { title: "Persistent condensation despite the fan", body: "Often a positioning or ducting issue rather than the fan being faulty at all." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <AlertCircle size={20} strokeWidth={1.75} />
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

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Why Extractor Fans Matter More Than People Think
            </h2>
            <p className="mt-4 text-center text-slate leading-relaxed">
              A properly working extractor fan is one of the most effective ways to prevent condensation and mould in bathrooms and
              kitchens — the two rooms that produce the most moisture in daily use. A fan that's stopped working, or was never
              properly ducted to the outside, is a common and often overlooked contributor to a recurring damp problem. If you're
              dealing with condensation alongside a faulty fan, our{" "}
              <a href="/blog/how-to-stop-condensation-in-your-home" className="text-orange-600 font-semibold hover:underline">
                guide to stopping condensation
              </a>{" "}
              covers the wider picture.
            </p>
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
              Get Your Extractor Fan Sorted
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
