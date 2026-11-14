import { ArrowRight, CheckCircle2, Flame, Phone, ShieldCheck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { unsplashUrl } from "../data/photos";
import { company } from "../data/content";
import { HEATING_HUB, heatingNav, type HeatingService } from "../data/heatingServices";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const PHOTO = "photo-1621983209352-c2880ac507b2";

export function HeatingServicePage({ service }: { service: HeatingService }) {
  const path = `/services/${service.slug}`;
  const hubPath = `/services/${HEATING_HUB.slug}`;
  const telHref = `tel:${company.phoneJobBooking.replace(/\s/g, "")}`;
  const related = heatingNav.filter((item) => item.href !== path);

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={service.seoTitle}
        description={service.seoDescription}
        path={path}
        image={unsplashUrl(PHOTO, "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Boiler & Heating", path: hubPath },
            { name: service.navLabel, path },
          ]),
          faqJsonLd(service.faqs),
          serviceJsonLd(service.navLabel, service.seoDescription, path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow={service.eyebrow}
          title={service.title}
          subtitle={service.subtitle}
          photo={PHOTO}
          presetService="Plumbing and Drainage"
        />

        <section className="py-10 border-b border-navy-100 bg-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-navy-100 bg-navy-50/60 p-6">
              <span className="flex w-14 h-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-orange-400">
                <ShieldCheck size={26} strokeWidth={1.75} />
              </span>
              <div className="text-center sm:text-left">
                <h2 className="font-display font-bold text-navy-900 text-lg">Gas Safe registered engineers</h2>
                <p className="mt-1.5 text-sm text-slate leading-relaxed">
                  Only Gas Safe registered engineers may legally install, service or repair gas appliances in the UK.
                  Every engineer we send for gas work carries their ID card, and you are welcome to check it on arrival.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-[1100px] px-6 lg:px-8 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
                <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> {service.eyebrow}
              </span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-2xl sm:text-3xl leading-tight text-balance">
                {service.includesTitle}
              </h2>
              <p className="mt-5 text-slate leading-relaxed">{service.intro}</p>
            </div>
            <ul className="rounded-2xl border border-navy-100 bg-white p-6 sm:p-7 shadow-card space-y-3.5">
              {service.includes.map((line) => (
                <li key={line} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-orange-600" />
                  <span className="text-sm text-navy-800 leading-relaxed">{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white border-y border-navy-100">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              {service.signsTitle}
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {service.signs.map((item, i) => (
                <div key={item.title} className="flex gap-4 rounded-2xl border border-navy-100 bg-paper p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-900 font-accent text-sm font-semibold text-blue-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-navy-900">{item.title}</h3>
                    <p className="mt-1.5 text-sm text-slate leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-10">
              Questions We Get Asked
            </h2>
            <Faq items={service.faqs} />
          </div>
        </section>

        <section className="pb-16 lg:pb-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-xl sm:text-2xl">More Boiler &amp; Heating Services</h2>
            <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-3 rounded-2xl border border-navy-100 bg-white p-5 shadow-card hover:border-orange-500/50 hover:-translate-y-0.5 transition-all"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-navy-950 transition-colors">
                    <Flame size={18} strokeWidth={1.9} />
                  </span>
                  <span>
                    <span className="flex items-center gap-1.5 font-display font-semibold text-navy-900 text-sm">
                      {item.label}
                      <ArrowRight size={14} className="text-slate-light transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="mt-1 block text-[13px] text-slate leading-relaxed">{item.short}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Speak to Our Booking Team
            </h2>
            <p className="mt-4 text-navy-100/80 leading-relaxed">
              Tell us what is happening and we will arrange a Gas Safe registered engineer, with a fixed price agreed
              before any work starts.
            </p>
            <a
              href={telHref}
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
