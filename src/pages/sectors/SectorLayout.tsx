import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { SectorHero } from "../../components/SectorHero";
import { Illustration } from "../../components/Illustration";
import { AnimateIn } from "../../components/AnimateIn";
import { Icon } from "../../components/Icon";
import { Seo } from "../../components/Seo";
import { Button } from "../../components/ui/button";
import { services, sectors, locations, type Service } from "../../data/content";
import { breadcrumbJsonLd } from "../../lib/seo";
import { CtaPhoneLine } from "../../components/CtaPhoneLine";
import { sectorPhotos, unsplashUrl } from "../../data/photos";

export function SectorLayout({
  name,
  slug,
  metaDescription,
  heroSubtitle,
  introHeading,
  introParagraphs,
  keyPoints,
  relevantServiceSlugs,
  ctaHeading,
}: {
  name: string;
  slug: string;
  metaDescription: string;
  heroSubtitle: string;
  introHeading: string;
  introParagraphs: string[];
  keyPoints: { title: string; body: string }[];
  relevantServiceSlugs: string[];
  ctaHeading: string;
}) {
  const relevantServices: Service[] = services.filter((s) => relevantServiceSlugs.includes(s.slug));
  const sectorData = sectors.find((s) => s.name === name);
  const sectorIcon = sectorData?.icon ?? "Building2";
  const path = `/sectors/${slug}`;

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={`${name} — Property Maintenance for ${name}`}
        description={metaDescription}
        path={path}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Sectors", path: "/sectors" },
          { name, path },
        ])}
      />
      <Header />
      <main>
        <SectorHero
          title={name}
          subtitle={heroSubtitle}
          breadcrumb={name}
          breadcrumbParent={{ name: "Sectors", path: "/sectors" }}
          photo={sectorPhotos[slug]}
        />

        {/* Intro */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Overview</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                {introHeading}
              </h2>
              <div className="mt-6 space-y-5 text-slate leading-relaxed">
                {introParagraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <p>
                  <a href="/" className="text-orange-600 font-semibold hover:underline">Tamesis Development Ltd</a> has
                  delivered work across every London borough since 2019.
                </p>
              </div>
              <div className="mt-8">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Get a Free Quote
                </Button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              {sectorPhotos[slug] ? (
                <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
                  <img
                    src={unsplashUrl(sectorPhotos[slug])}
                    alt={`Property maintenance and repairs for ${name} in London — Tamesis Development Ltd`}
                    className="aspect-[4/3] w-full h-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
                    {sectorData?.description ?? `Property maintenance and repairs delivered for ${name} across London.`}
                  </figcaption>
                </figure>
              ) : (
                <div className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
                  <Illustration icon={sectorIcon} label={`${name} works`} className="aspect-[4/3]" />
                </div>
              )}
            </AnimateIn>
          </div>
        </section>

        {/* Key points */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">How We Help</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                What Sets Us Apart for {name}
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {keyPoints.map((point) => (
                <div key={point.title} className="corner-marks rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                  <span className="flex w-10 h-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <CheckCircle2 size={18} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-navy-900 text-base">{point.title}</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{point.body}</p>
                </div>
              ))}
            </div>

            <p className="mt-10 text-sm text-slate">
              Want to know more about the team behind the work? Visit our{" "}
              <a href="/about" className="text-orange-600 font-semibold hover:underline">About Us page</a>.
            </p>
          </div>
        </section>

        {/* Relevant services */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Relevant Services</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Services Commonly Delivered for {name}
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {relevantServices.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all text-center"
                >
                  <span className="flex w-11 h-11 mx-auto items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Icon name={service.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <span className="mt-4 block font-display font-semibold text-navy-900 text-sm leading-snug">{service.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Areas covered for this sector */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Coverage</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                Serving {name} Across London
              </h2>
            </AnimateIn>
            <div className="mt-8 flex flex-wrap gap-3">
              {locations.filter((l) => l.hasServiceCombos).map((location) => (
                <a
                  key={location.slug}
                  href={`/property-maintenance/${location.slug}`}
                  className="rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-900 hover:text-navy-900 transition-colors"
                >
                  {location.name}
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate">
              Don't see your area? <a href="/coverage" className="text-orange-600 font-semibold hover:underline">View our full London coverage</a>.
              Have a question specific to your organisation?{" "}
              <a href="/contact" className="text-orange-600 font-semibold hover:underline">Contact our team</a> directly.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              {ctaHeading}
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (navigate("/quote"))}>
                Get a Free Quote
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => (navigate("/contact"))}>
                Contact Us
              </Button>
            </div>
            <CtaPhoneLine />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
