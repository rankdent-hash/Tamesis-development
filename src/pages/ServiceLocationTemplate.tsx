import { Navigate, useParams, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Illustration } from "../components/Illustration";
import { servicePhotos, unsplashUrl } from "../data/photos";
import { AnimateIn } from "../components/AnimateIn";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/button";
import { services, locations, getServiceLocationContent, type Service, type Location } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd } from "../lib/seo";
import { CtaPhoneLine } from "../components/CtaPhoneLine";

export function ServiceLocationTemplate({ service, location }: { service: Service; location: Location }) {
  const content = getServiceLocationContent(service, location);
  const path = `/services/${service.slug}/${location.slug}`;
  const metaDescription = `${service.name} in ${location.name} from Tamesis Development Ltd — directly employed engineers, clear quotes, no subcontractors.`;

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={`${service.name} in ${location.name}`}
        description={metaDescription}
        path={path}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path: `/services/${service.slug}` },
            { name: location.name, path },
          ]),
          faqJsonLd(content.faqs),
        ]}
      />
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title={`${service.name} in ${location.name}`}
          subtitle={`Professional ${service.name.toLowerCase()} in ${location.name}, delivered by our directly employed engineers.`}
          breadcrumb={`${service.name} in ${location.name}`}
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Overview</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                {service.name} You Can Rely On in {location.name}
              </h2>
              <p className="mt-6 text-slate leading-relaxed">{content.overview}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Request a Quote
                </Button>
                <a
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
                >
                  More on {service.name}
                </a>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1} className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
              {servicePhotos[service.slug] ? (
                <img
                  src={unsplashUrl(servicePhotos[service.slug])}
                  alt={`${service.name} in ${location.name}`}
                  className="aspect-[4/3] w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <Illustration icon={service.icon} label={`${service.name} in ${location.name}`} className="aspect-[4/3]" />
              )}
            </AnimateIn>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">What We Do</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Our Approach in {location.name}
              </h2>
            </AnimateIn>
            <div className="mt-10 grid sm:grid-cols-2 gap-4">
              {content.whatWeDo.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-white border border-navy-100 p-5 shadow-card">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-navy-800 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <AnimateIn className="text-center">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">FAQs</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                Frequently Asked Questions
              </h2>
            </AnimateIn>
            <div className="mt-10">
              <Faq items={content.faqs} />
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Need {service.name} in {location.name}?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (navigate("/quote"))}>
                Request a Quote
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

export function ServiceLocationRoute() {
  const { serviceSlug, locationSlug } = useParams();
  const service = services.find((s) => s.slug === serviceSlug);
  const location = locations.find((l) => l.slug === locationSlug);
  if (!service || !location) return <Navigate to="/services" replace />;
  return <ServiceLocationTemplate service={service} location={location} />;
}
