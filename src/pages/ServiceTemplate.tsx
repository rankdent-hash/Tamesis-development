import { CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { PlaceholderImage } from "../components/PlaceholderImage";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/button";
import { services, whyChoose, process, getServiceContent, type Service } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

export function ServiceTemplate({ service }: { service: Service }) {
  const content = getServiceContent(service);
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const path = `/services/${service.slug}`;
  const metaDescription = `Professional ${service.name.toLowerCase()} across London from Tamesis Development Ltd — directly employed engineers, clear quotes, and work for housing associations, landlords and homeowners.`;

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={`${service.name} in London`}
        description={metaDescription}
        path={path}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: service.name, path },
          ]),
          faqJsonLd(content.faqs),
          serviceJsonLd(service.name, metaDescription, path),
        ]}
      />
      <Header />
      <main>
        <PageHero
          eyebrow="Services"
          title={service.name}
          subtitle={`Professional ${service.name.toLowerCase()} across London, delivered by directly employed engineers — for housing associations, local authorities, commercial clients, landlords and homeowners.`}
          breadcrumb={service.name}
        />

        {/* Overview */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Overview</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                {service.name} You Can Rely On
              </h2>
              <p className="mt-6 text-slate leading-relaxed">{content.overview}</p>
              <div className="mt-8">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Request a Quote
                </Button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1} className="corner-marks">
              <PlaceholderImage
                label={`${service.name} in progress`}
                className="aspect-[4/3] rounded-2xl shadow-card-hover"
              />
            </AnimateIn>
          </div>
        </section>

        {/* What we do */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">What We Do</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Our Approach to {service.name}
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

        {/* Common issues */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Common Requirements</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                When Clients Call Us for {service.name}
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {content.commonIssues.map((issue) => (
                <div key={issue} className="corner-marks rounded-2xl border border-navy-100 bg-white p-7 shadow-card">
                  <span className="flex w-10 h-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Icon name={service.icon} size={18} strokeWidth={1.75} />
                  </span>
                  <p className="mt-4 text-sm text-navy-800 leading-relaxed">{issue}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-24 lg:py-32 bg-navy-950 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-60" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl mx-auto text-center">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">How It Works</span>
              <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance">
                Our Process
              </h2>
            </AnimateIn>

            <div className="mt-16 relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
              <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-navy-700" />
              {process.map((item) => (
                <div key={item.step} className="relative text-center flex flex-col items-center">
                  <span className="relative z-10 flex w-12 h-12 items-center justify-center rounded-full bg-orange-500 text-white font-accent font-semibold text-lg">
                    {item.step}
                  </span>
                  <h3 className="mt-5 font-display font-semibold text-white text-lg">{item.title}</h3>
                  <p className="mt-2 text-sm text-navy-100/70 leading-relaxed max-w-[220px]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Why Tamesis</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Why Choose Us for {service.name}
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8">
              {whyChoose.slice(0, 6).map((item) => (
                <div key={item.name} className="flex items-start gap-4">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon name={item.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <span className="pt-2.5 font-display font-semibold text-navy-900 text-base leading-snug">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
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

        {/* Related services */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Related</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                Related Services
              </h2>
            </AnimateIn>

            <div className="mt-10 grid sm:grid-cols-3 gap-5">
              {related.map((s) => (
                <a
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                    <Icon name={s.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <span className="mt-5 flex items-center justify-between gap-2">
                    <span className="font-display font-semibold text-navy-900 text-sm">{s.name}</span>
                    <ArrowRight size={14} className="text-slate-light group-hover:text-orange-500 transition-colors" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Need {service.name}?
            </h2>
            <p className="mt-4 text-navy-100/75 max-w-xl mx-auto">
              Get in touch for a clear, no-obligation quote from our team.
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
