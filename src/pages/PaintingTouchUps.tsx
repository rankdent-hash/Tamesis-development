import { Phone, PaintRoller, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { unsplashUrl, handymanSubPhotos } from "../data/photos";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "What counts as a \"touch-up\" rather than a full paint job?", a: "Covering scuffs and marks, repainting a single wall or small area, or freshening up after removing furniture — smaller in scope than a full room repaint." },
  { q: "Will the paint match what's already there?", a: "We'll do our best to match existing colour and finish — for the closest match, having the original paint name or a sample helps." },
  { q: "Can this be combined with other small jobs?", a: "Yes — touch-ups are commonly bundled with other handyman tasks in the same visit." },
  { q: "Do you provide a fixed price before starting?", a: "Always. We'll confirm the cost before any work begins." },
];

export function PaintingTouchUps() {
  const path = "/services/painting-touch-ups";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Painting Touch-Ups London — Small Jobs, Fixed Price"
        description="Scuffs, marks, and small painting touch-ups across London. Directly employed engineers, bundled with your other handyman jobs or handled on their own."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Painting Touch-Ups", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Painting Touch-Ups", "Small painting and decorating touch-up jobs across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Painting Touch-Ups"
          title="Scuffs and Marks, Freshened Up Fast."
          subtitle="You don't need a full repaint for a few scuffs and marks — directly employed engineers handle small touch-ups on their own or bundled with your other jobs."
          photo={handymanSubPhotos["painting-touch-ups"]}
          presetService="Handyman Services"
        />

        <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-8 relative">
          <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
            <img
              src={unsplashUrl(handymanSubPhotos["painting-touch-ups"])}
              alt="Handyman touching up a scuffed wall with matching paint in a London home"
              title="Painting Touch-Ups — Tamesis Development Ltd"
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
            />
            <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
              Scuffs and marks freshened up neatly, matched to your existing paint colour where possible.
            </figcaption>
          </figure>
        </div>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Small Jobs, Neatly Finished
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: PaintRoller, title: "Scuffs & marks", body: "Covered neatly, matched to existing colour where possible." },
                { icon: Clock, title: "Single wall or area", body: "No need for a full room repaint for a small patch." },
                { icon: ArrowRight, title: "Bundle with other jobs", body: "Works well alongside other handyman tasks in one visit." },
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
              Planning a full room or exterior repaint? Visit our{" "}
              <a href="/services/painting-decorating" className="text-orange-600 font-semibold hover:underline">full painting and decorating service</a> instead.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get Your Touch-Ups Sorted</h2>
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
