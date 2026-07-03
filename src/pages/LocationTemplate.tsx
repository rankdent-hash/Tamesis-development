import { Navigate, useParams, useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Illustration } from "../components/Illustration";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/button";
import { services, locations, getLocationContent, type Location } from "../data/content";
import { breadcrumbJsonLd } from "../lib/seo";

export function LocationTemplate({ location }: { location: Location }) {
  const content = getLocationContent(location);
  const path = `/property-maintenance/${location.slug}`;
  const metaDescription = `Property maintenance, repairs and refurbishment in ${location.name} from Tamesis Development Ltd — directly employed engineers, clear quotes, and work for housing associations, landlords and homeowners.`;

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={`Property Maintenance in ${location.name}`}
        description={metaDescription}
        path={path}
        jsonLd={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Coverage", path: "/coverage" },
          { name: location.name, path },
        ])}
      />
      <Header />
      <main>
        <PageHero
          eyebrow="Coverage"
          title={`Property Maintenance in ${location.name}`}
          subtitle={`Responsive repairs, planned maintenance, refurbishment and construction services across ${location.name}, delivered by directly employed engineers.`}
          breadcrumb={location.name}
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Overview</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Trusted in {location.name}
              </h2>
              <p className="mt-6 text-slate leading-relaxed">{content.overview}</p>
              <ul className="mt-6 space-y-2.5">
                {content.whyChooseLocal.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-navy-800">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Request a Quote
                </Button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1} className="corner-marks">
              <Illustration icon="MapPin" label={`Property maintenance in ${location.name}`} className="aspect-[4/3] rounded-2xl shadow-card-hover" />
            </AnimateIn>
          </div>
        </section>

        {/* Services in this location */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Services</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Services Available in {location.name}
              </h2>
            </AnimateIn>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}/${location.slug}`}
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-5 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="flex w-10 h-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Icon name={service.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <span className="mt-3 flex items-start justify-between gap-2">
                    <span className="font-display font-semibold text-navy-900 text-xs leading-snug">{service.name}</span>
                    <ArrowUpRight size={14} className="shrink-0 text-slate-light group-hover:text-orange-500 transition-colors" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Other locations */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Nearby Areas</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                We Also Cover
              </h2>
            </AnimateIn>
            <div className="mt-8 flex flex-wrap gap-3">
              {locations
                .filter((l) => l.slug !== location.slug)
                .map((l) => (
                  <a
                    key={l.slug}
                    href={`/property-maintenance/${l.slug}`}
                    className="rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-900 hover:text-navy-900 transition-colors"
                  >
                    {l.name}
                  </a>
                ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Need Work Done in {location.name}?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (navigate("/quote"))}>
                Request a Quote
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => (navigate("/contact"))}>
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function LocationRoute() {
  const { locationSlug } = useParams();
  const location = locations.find((l) => l.slug === locationSlug);
  if (!location) return <Navigate to="/coverage" replace />;
  return <LocationTemplate location={location} />;
}
