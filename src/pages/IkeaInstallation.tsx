import { Phone, Package, Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { unsplashUrl, handymanSubPhotos } from "../data/photos";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "Do you assemble any IKEA furniture, or just certain ranges?", a: "Any IKEA furniture — wardrobes (including PAX), bookcases, bed frames, chests of drawers, desks, and kitchen units. If it comes flat-packed, we can build it." },
  { q: "Are you an official IKEA assembly partner?", a: "No — we're an independent handyman service, not officially affiliated with IKEA. We assemble IKEA furniture as part of our general handyman offering, to the same standard as any other flat-pack job." },
  { q: "Why would I pay for assembly instead of doing it myself?", a: "IKEA furniture is generally straightforward, but larger items like PAX wardrobes or kitchen units can take several hours and are easy to get wrong first time. Professional assembly saves the time, the frustration, and the risk of a mistake that's hard to undo." },
  { q: "Do you provide a fixed price before starting?", a: "Always. Tell us what you're having delivered and we'll confirm the cost before any work begins." },
];

export function IkeaInstallation() {
  const path = "/services/ikea-installation";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="IKEA Furniture Assembly & Installation London"
        description="IKEA wardrobes, bookcases, bed frames and kitchen units assembled properly across London. Directly employed engineers, fixed price, no tools needed on your end."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "IKEA Installation", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("IKEA Furniture Assembly and Installation", "IKEA furniture assembly and installation service across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — IKEA Installation"
          title="IKEA Furniture, Assembled Properly."
          subtitle="PAX wardrobes, BILLY bookcases, bed frames, kitchen units — assembled by directly employed engineers, so you don't lose a weekend to an Allen key."
          photo={handymanSubPhotos["furniture-assembly"]}
          presetService="Handyman Services"
        />

        <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-8 relative">
          <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
            <img
              src={unsplashUrl(handymanSubPhotos["furniture-assembly"])}
              alt="Handyman assembling IKEA flat-pack furniture with a screwdriver in a London home"
              title="IKEA Furniture Assembly — Tamesis Development Ltd"
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
            />
            <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
              IKEA flat-pack furniture assembled properly by our directly employed handyman team.
            </figcaption>
          </figure>
        </div>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Any IKEA Range, Assembled Right
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Package, title: "Wardrobes & storage", body: "PAX wardrobes, BILLY bookcases, chests of drawers — including the fiddly interior fittings." },
                { icon: Wrench, title: "Beds & bedroom furniture", body: "Bed frames, headboards, and bedside tables, built to be sturdy, not just standing." },
                { icon: ShieldCheck, title: "Kitchen units", body: "METOD kitchen cabinets and units, assembled and fitted properly." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "Tell us what's arriving, and we'll confirm the cost before we start." },
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
              Not IKEA? Our{" "}
              <a href="/services/furniture-assembly" className="text-orange-600 font-semibold hover:underline">general furniture assembly service</a> covers any flat-pack brand.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center">Why Not Just DIY It?</h2>
            <p className="mt-4 text-center text-slate max-w-2xl mx-auto leading-relaxed">
              Most IKEA furniture is designed for self-assembly, and plenty of it is genuinely straightforward. But larger pieces —
              a PAX wardrobe with interior fittings, a full kitchen run of METOD units — can easily run to several hours, and a
              mistake partway through (a panel fitted the wrong way round, a cam lock stripped from over-tightening) is often
              harder to undo than to avoid in the first place. Professional assembly means it's done once, done properly, and
              you get your weekend back.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get Your IKEA Furniture Built</h2>
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all"
            >
              <Phone size={20} /> Call Now — {company.phoneJobBooking}
            </a>
            <p className="mt-4 text-xs text-navy-100/50">
              Tamesis Development Ltd is an independent handyman service and is not affiliated with or endorsed by IKEA.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
