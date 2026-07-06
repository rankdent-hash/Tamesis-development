import { MapPin, ArrowRight, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { LocationHero } from "../components/LocationHero";
import { AnimateIn } from "../components/AnimateIn";
import { CtaPhoneLine } from "../components/CtaPhoneLine";
import { Button } from "../components/ui/button";
import { locations, londonRegions, boroughLinkMap } from "../data/content";
import { coveragePhoto } from "../data/photos";

export function Coverage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.coverage.title} description={seoMeta.coverage.description} path="/coverage" />
      <Header />
      <main>
        <LocationHero
          title="Covering All of London — North, South, East and West"
          subtitle="Our operational teams are positioned to reach every one of London's 32 boroughs, from a single reported repair to a portfolio-wide planned maintenance contract."
          breadcrumb="Coverage Areas"
          photo={coveragePhoto}
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Service Area</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Every London Borough, All 32 of Them
              </h2>
              <p className="mt-5 text-slate leading-relaxed">
                Whether it's a single property or a portfolio spread across multiple boroughs, our teams cover the
                whole of Greater London — north to south, east to west — for both emergency repairs and planned,
                ongoing works. Areas with a dedicated page below are linked; get in touch about any other borough
                and we can very likely help.
              </p>
              <div className="mt-8">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Get a Free Quote
                </Button>
              </div>
            </AnimateIn>

            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {londonRegions.map((group) => (
                <AnimateIn key={group.region} className="corner-marks rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                  <span className="flex items-center gap-2 text-orange-600">
                    <Compass size={16} />
                    <span className="text-xs font-accent uppercase tracking-widest font-semibold">{group.region}</span>
                  </span>
                  <ul className="mt-5 space-y-2.5">
                    {group.boroughs.map((borough) => {
                      const slug = boroughLinkMap[borough];
                      return (
                        <li key={borough} className="flex items-center gap-2 text-sm text-navy-800 font-medium">
                          <MapPin size={13} className="text-slate-light shrink-0" />
                          {slug ? (
                            <a href={`/property-maintenance/${slug}`} className="hover:text-orange-600 transition-colors">
                              {borough}
                            </a>
                          ) : (
                            borough
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* Featured areas with dedicated pages */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Featured Areas</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Areas We Work In Most
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {locations.map((location) => (
                <a
                  key={location.slug}
                  href={`/property-maintenance/${location.slug}`}
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="flex w-10 h-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <MapPin size={18} strokeWidth={1.75} />
                  </span>
                  <span className="mt-4 flex items-center justify-between gap-2">
                    <span className="font-display font-semibold text-navy-900 text-sm">{location.name}</span>
                    <ArrowRight size={14} className="text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Not Sure If We Cover Your Area?
            </h2>
            <p className="mt-4 text-navy-100/75 max-w-xl mx-auto">
              Get in touch — chances are we already do.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (navigate("/contact"))}>
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
