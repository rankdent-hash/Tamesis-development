import { Phone, Droplet, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "What counts as a \"minor\" plumbing job?", a: "Small, quick jobs like a dripping tap, a running toilet, or a minor leak under a sink — usually part of a wider list of small tasks, rather than a standalone plumbing emergency." },
  { q: "What if it turns out to be bigger than expected?", a: "We'll tell you honestly and quote separately — our full plumbing team can take over if it needs more than a quick fix." },
  { q: "Can I bundle this with other small jobs?", a: "Yes — this is exactly the kind of job that works well alongside furniture assembly, shelving, or other items on a handyman visit." },
  { q: "Do you provide a fixed price before starting?", a: "Always. We'll confirm the cost before any work begins." },
];

export function MinorPlumbingRepairs() {
  const path = "/services/minor-plumbing-repairs";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Minor Plumbing Repairs London — Small Jobs, Fixed Price"
        description="Small plumbing jobs — dripping taps, running toilets, minor leaks — bundled into a handyman visit or handled on their own. Directly employed engineers."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Minor Plumbing Repairs", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Minor Plumbing Repairs", "Small plumbing repair jobs across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Minor Plumbing"
          title="Small Plumbing Jobs, Sorted Quickly."
          subtitle="A dripping tap or running toilet doesn't need a full callout — directly employed engineers handle small plumbing jobs on their own or bundled with your other tasks."
          photo="photo-1621905252507-b35492cc74b4"
          presetService="Handyman Services"
        />
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Small Jobs, Handled Properly
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Droplet, title: "Dripping taps", body: "Quick, fixed-price repairs — usually done in one visit." },
                { icon: Clock, title: "Running toilets", body: "Faulty valves and mechanisms sorted quickly." },
                { icon: ArrowRight, title: "Bundle with other jobs", body: "Works well alongside furniture assembly or shelving on the same visit." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "You'll know the cost before we start." },
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
              Dealing with something bigger — a burst pipe or blocked drain? Visit our{" "}
              <a href="/services/plumbing" className="text-orange-600 font-semibold hover:underline">full plumbing and drainage service</a> instead.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get Your Small Plumbing Job Sorted</h2>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all">
              <Phone size={20} /> Call Now — {company.phoneJobBooking}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
