import { Phone, Package, Clock, CheckCircle2, Wrench } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "What kind of furniture can you assemble?", a: "Flat-pack wardrobes, beds, bookcases, TV units, office furniture, and most standard self-assembly ranges, including IKEA and similar brands." },
  { q: "Do I need to provide tools?", a: "No — our team brings everything needed. You just need the furniture and the space to assemble it in." },
  { q: "How long does assembly usually take?", a: "Most single items take 30-90 minutes depending on complexity. If you have several pieces, it's often more efficient to book a single longer visit." },
  { q: "Can you dispose of the packaging?", a: "We're happy to flatten and stack packaging for your own disposal. Ask when booking if you'd like this included." },
];

export function FurnitureAssembly() {
  const path = "/services/furniture-assembly";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Furniture Assembly London — Flat-Pack, Wardrobes & More"
        description="Flat-pack, wardrobe, or office furniture assembly across London. Directly employed engineers, fixed price, no tools needed on your end."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Furniture Assembly", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Furniture Assembly", "Furniture assembly service across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Furniture Assembly"
          title="Flat-Pack Furniture, Assembled Properly."
          subtitle="Wardrobes, beds, TV units, office furniture — assembled by directly employed engineers, so you don't have to spend your weekend on it."
          photo="photo-1621905252507-b35492cc74b4"
          presetService="Handyman Services"
        />
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Skip the Instructions, Skip the Frustration
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Package, title: "Any flat-pack brand", body: "IKEA and most other self-assembly furniture ranges." },
                { icon: Wrench, title: "All tools included", body: "We bring everything needed — nothing for you to source." },
                { icon: Clock, title: "Usually one visit", body: "Most items assembled in under 90 minutes." },
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
              Got a whole list of small jobs, not just furniture? Our{" "}
              <a href="/services/handyman" className="text-orange-600 font-semibold hover:underline">general handyman service</a> can bundle them into one visit.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get Your Furniture Assembled</h2>
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
