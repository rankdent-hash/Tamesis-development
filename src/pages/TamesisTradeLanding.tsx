import { CheckCircle2, ArrowRight, Star, ShieldCheck, HardHat } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { unsplashUrl, servicePhotos } from "../data/photos";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";
import type { TamesisTrade } from "../data/tamesisTrades";

export function TamesisTradeLanding({ trade }: { trade: TamesisTrade }) {
  const path = `/tamesis-${trade.slug}`;
  const photo = servicePhotos[trade.mainServiceSlug] ?? servicePhotos.handyman;

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={`Tamesis ${trade.tradeName}`}
        description={trade.metaDescription}
        path={path}
        image={unsplashUrl(photo, "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: `Tamesis ${trade.tradeName}`, path }]),
          faqJsonLd(trade.faqs),
          serviceJsonLd(`Tamesis ${trade.tradeName}`, trade.metaDescription, path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow={`Tamesis ${trade.tradeName}`}
          title={`Tamesis ${trade.tradeName}`}
          subtitle={trade.heroSubtitle}
          photo={photo}
          presetService={trade.mainServiceName}
        />

        {/* Trust strip */}
        <section className="border-b border-navy-100 bg-white">
          <div className="mx-auto max-w-[1000px] px-6 lg:px-8 py-6 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Star size={20} className="text-orange-500" />
              <span className="text-xs sm:text-sm font-semibold text-navy-900">4.6★, 535+ Reviews</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={20} className="text-orange-500" />
              <span className="text-xs sm:text-sm font-semibold text-navy-900">Directly Employed Team</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <HardHat size={20} className="text-orange-500" />
              <span className="text-xs sm:text-sm font-semibold text-navy-900">Est. 2019, 17 Teams</span>
            </div>
          </div>
        </section>

        {/* What's covered */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              What Your Tamesis {trade.tradeName} Covers
            </h2>
            <ul className="mt-8 space-y-3">
              {trade.scope.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-xl border border-navy-100 bg-white p-4 shadow-card">
                  <CheckCircle2 size={18} className="text-orange-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-navy-800">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-center">
              <a
                href={`/services/${trade.mainServiceSlug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:underline"
              >
                See the full service details <ArrowRight size={15} />
              </a>
            </div>
          </div>
        </section>

        {/* Why Tamesis */}
        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Why Choose Tamesis as Your {trade.tradeName}
            </h2>
            <div className="mt-10 grid sm:grid-cols-3 gap-5">
              {trade.whyTamesis.map((point) => (
                <div key={point.title} className="rounded-2xl bg-white border border-navy-100 p-6 shadow-card">
                  <h3 className="font-display font-semibold text-navy-900 text-sm">{point.title}</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-10">Common Questions</h2>
            <Faq items={trade.faqs} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Talk to Your Local Tamesis {trade.tradeName}
            </h2>
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all"
            >
              Call Now — {company.phoneJobBooking}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
