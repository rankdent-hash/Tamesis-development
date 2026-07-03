import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/button";
import { services } from "../data/content";

export function ServicesPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.services.title} description={seoMeta.services.description} path="/services" />
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title="Full Range of Property Maintenance & Refurbishment Services"
          subtitle="From responsive repairs to full construction projects, our directly employed teams deliver every service to the same professional standard."
          breadcrumb="Services"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
              {services.map((service, i) => (
                <AnimateIn key={service.slug} delay={(i % 8) * 0.03}>
                  <a
                    href={`/services/${service.slug}`}
                    className="corner-marks group h-full rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                  >
                    <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                      <Icon name={service.icon} size={22} strokeWidth={1.75} />
                    </span>
                    <span className="mt-5 flex items-start justify-between gap-2">
                      <span className="font-display font-semibold text-navy-900 text-sm leading-snug">{service.name}</span>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 mt-0.5 text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </span>
                  </a>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Not Sure Which Service You Need?
            </h2>
            <p className="mt-4 text-navy-100/75 max-w-xl mx-auto">
              Get in touch and our team will assess the work and recommend the right service.
            </p>
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
