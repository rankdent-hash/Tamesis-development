import { Phone, CloudRain, Search, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { unsplashUrl, handymanSubPhotos } from "../data/photos";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "How often should gutters be cleaned?", a: "Once or twice a year is typical for most London properties — more often if you're near mature trees that shed heavily." },
  { q: "What happens if gutters are left blocked?", a: "Overflowing water can run down external walls, which is one of the more common contributing causes of penetrating damp — a relatively small job now avoids a bigger repair later." },
  { q: "Do you check the gutters as well as clear them?", a: "Yes — we'll flag any damaged sections, loose brackets, or signs of wear while we're up there, not just clear the debris and leave." },
  { q: "Do you provide a fixed price before starting?", a: "Always. We'll confirm the cost before any work begins." },
];

export function GutterCleaning() {
  const path = "/services/gutter-cleaning";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Gutter Cleaning London — Fast, Fixed Price"
        description="Gutter cleaning and maintenance across London. Directly employed engineers, checked for damage while we're up there, fixed price."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Gutter Cleaning", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Gutter Cleaning", "Gutter cleaning and maintenance service across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Gutter Cleaning"
          title="Blocked Gutters Cleared, Before They Cause Damp."
          subtitle="Overflowing gutters are one of the most common causes of damp walls — directly employed engineers clear and check them properly, across every London borough."
          photo={handymanSubPhotos["gutter-cleaning"]}
          presetService="Handyman Services"
        />

        <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-8 relative">
          <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
            <img
              src={unsplashUrl(handymanSubPhotos["gutter-cleaning"])}
              alt="Blocked gutters on a London roofline before professional gutter cleaning"
              title="Gutter Cleaning — Tamesis Development Ltd"
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
            />
            <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
              Gutters cleared of leaves and debris before they cause overflow and penetrating damp.
            </figcaption>
          </figure>
        </div>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              A Small Job That Prevents a Bigger One
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: CloudRain, title: "Full clearance", body: "Leaves, moss and debris cleared from gutters and downpipes." },
                { icon: Search, title: "Damage check included", body: "We flag loose brackets or damaged sections while we're up there." },
                { icon: ShieldCheck, title: "Prevents penetrating damp", body: "Overflow down external walls is a common, avoidable cause of damp." },
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
              Already seeing damp patches on an external wall? Read about our{" "}
              <a href="/services/damp-mould" className="text-orange-600 font-semibold hover:underline">damp and mould treatment</a> service too.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Book Your Gutter Clean</h2>
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
