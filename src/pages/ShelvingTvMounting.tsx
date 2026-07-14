import { Phone, Tv, Image, Layers, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "Can you mount a TV on any wall?", a: "Most walls, yes — we check whether it's stud, brick, or plasterboard first and use the right fixings so it's properly secure, not just wedged into plaster." },
  { q: "Do you hide the cables?", a: "We can route cables neatly or discuss in-wall cable management if you'd like a fully concealed finish." },
  { q: "Can you fit shelves into plasterboard walls?", a: "Yes, using appropriate cavity fixings rated for the weight you need to hold — we'll advise what's actually safe for your specific wall type." },
  { q: "Do you provide a fixed price before starting?", a: "Always. We'll confirm the cost before any work begins." },
];

export function ShelvingTvMounting() {
  const path = "/services/shelving-tv-mounting";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="TV Mounting & Shelving London — Fitted Properly"
        description="TV mounting, shelving, and picture hanging across London. Directly employed engineers, correct fixings for your wall type, fixed price."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Shelving & TV Mounting", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Shelving and TV Mounting", "TV mounting and shelving service across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Shelving & TV Mounting"
          title="Shelves, TVs and Pictures — Properly Fixed."
          subtitle="The right fixings for your actual wall type, not a quick job that comes loose in a month. Directly employed engineers, across every London borough."
          photo="photo-1621905252507-b35492cc74b4"
          presetService="Handyman Services"
        />
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Fitted to Actually Stay Up
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Tv, title: "TV mounting", body: "Any bracket type, cables routed neatly or fully concealed." },
                { icon: Layers, title: "Shelving", body: "Floating or bracket shelves, fitted with the right fixings for your wall." },
                { icon: Image, title: "Pictures & mirrors", body: "Properly hung, level, and secure — including heavier mirrors." },
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
              Have a longer list of small jobs? Our{" "}
              <a href="/services/handyman" className="text-orange-600 font-semibold hover:underline">general handyman service</a> can cover them all in one visit.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get It Properly Mounted</h2>
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
