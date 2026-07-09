import { useEffect, useState } from "react";
import { CheckCircle2, ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ServiceHero } from "../components/ServiceHero";
import { Illustration } from "../components/Illustration";
import { servicePhotos, unsplashUrl } from "../data/photos";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Faq } from "../components/Faq";
import { ReviewsCarousel } from "../components/ReviewsCarousel";
import { Seo } from "../components/Seo";
import { Button } from "../components/ui/button";
import { services, sectors, locations, whyChoose, process, getServiceContent, type Service } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";
import { CtaPhoneLine } from "../components/CtaPhoneLine";
import { fetchBlogPostForService, type BlogPostSummary } from "../lib/blog";

export function ServiceTemplate({ service }: { service: Service }) {
  const content = getServiceContent(service);
  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);
  const [relatedPost, setRelatedPost] = useState<BlogPostSummary | null>(null);

  useEffect(() => {
    setRelatedPost(null);
    fetchBlogPostForService(service.slug).then((result) => {
      if (result.success && result.post) setRelatedPost(result.post);
    });
  }, [service.slug]);
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
        <ServiceHero service={service} />

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
                  Get a Free Quote
                </Button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1}>
              {servicePhotos[service.slug] ? (
                <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
                  <img
                    src={unsplashUrl(servicePhotos[service.slug])}
                    alt={`${service.name} carried out by a Tamesis Development Ltd engineer in London`}
                    className="aspect-[4/3] w-full h-full object-cover"
                    loading="lazy"
                  />
                  <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
                    Professional {service.name.toLowerCase()} delivered across London by our directly employed engineers.
                  </figcaption>
                </figure>
              ) : (
                <div className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
                  <Illustration
                    icon={service.icon}
                    label={`${service.name} in progress`}
                    className="aspect-[4/3]"
                  />
                </div>
              )}
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

        {/* Reviews */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Reviews</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                What Clients Say About Our {service.name}
              </h2>
            </AnimateIn>
            <div className="mt-12">
              <ReviewsCarousel />
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
              <p className="mt-4 text-slate leading-relaxed">
                Since founding in 2019, <a href="/" className="text-orange-600 font-semibold hover:underline">Tamesis Development Ltd</a> has
                grown into one of London's trusted property maintenance contractors — directly employed teams, not agency labour.
              </p>
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

            <p className="mt-10 text-sm text-slate">
              Read more about our history, values and approach on our{" "}
              <a href="/about" className="text-orange-600 font-semibold hover:underline">About Us page</a>.
            </p>
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
            <p className="mt-8 text-center text-sm text-slate">
              Still have a question about {service.name.toLowerCase()}?{" "}
              <a href="/contact" className="text-orange-600 font-semibold hover:underline">Get in touch</a> with our team and we'll help.
            </p>
          </div>
        </section>

        {/* Specific plumbing sub-services — only shown on the Plumbing and Drainage page */}
        {service.slug === "plumbing" && (
          <section className="py-16 lg:py-20 bg-navy-50">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Specific Needs</span>
              <h2 className="mt-3 font-display font-bold text-navy-900 text-2xl sm:text-3xl leading-tight">
                Looking for Something Specific?
              </h2>
              <div className="mt-8 grid sm:grid-cols-3 gap-5">
                <a
                  href="/services/emergency-plumbing"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Emergency Plumbing</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">Burst pipes, flooding, no heating — fast response, any time.</p>
                </a>
                <a
                  href="/services/blocked-drains"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Blocked Drains</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">Same-day drain unblocking, with an honest answer if it's recurring.</p>
                </a>
                <a
                  href="/services/landlord-plumbing"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Landlord &amp; Gas Safety</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">CP12 certificates and reliable plumbing for rental portfolios.</p>
                </a>
                <a
                  href="/services/tap-repairs"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Dripping Taps</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">Fast, fixed-price repairs for dripping or leaking taps.</p>
                </a>
                <a
                  href="/services/toilet-repairs"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Toilet Repairs</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">Running, blocked, or won't flush — sorted fast.</p>
                </a>
                <a
                  href="/services/low-water-pressure"
                  className="corner-marks group rounded-2xl bg-white border border-navy-100 p-6 shadow-card hover:shadow-card-hover transition-all"
                >
                  <span className="font-display font-semibold text-navy-900">Low Water Pressure</span>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">Weak shower or slow taps, diagnosed and fixed properly.</p>
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Related blog post, if one exists for this service */}
        {relatedPost && (
          <section className="py-16 lg:py-20 bg-navy-50">
            <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
              <a
                href={`/blog/${relatedPost.slug}`}
                className="corner-marks group flex flex-col sm:flex-row items-start sm:items-center gap-5 rounded-2xl bg-white border border-navy-100 p-7 shadow-card hover:shadow-card-hover transition-all"
              >
                <span className="flex w-12 h-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <BookOpen size={20} strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <span className="text-[11px] font-accent uppercase tracking-widest text-orange-600 font-semibold">
                    From Our Blog
                  </span>
                  <h3 className="mt-1 font-display font-semibold text-navy-900 text-lg leading-snug">
                    {relatedPost.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed line-clamp-2">{relatedPost.excerpt}</p>
                </div>
                <ArrowRight size={18} className="shrink-0 text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
              </a>
            </div>
          </section>
        )}

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

        {/* Sectors this service is delivered for */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Sectors</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                Who We Deliver {service.name} For
              </h2>
            </AnimateIn>
            <div className="mt-8 flex flex-wrap gap-3">
              {sectors.map((sector) => (
                <a
                  key={sector.slug}
                  href={`/sectors/${sector.slug}`}
                  className="rounded-full border border-navy-200 bg-white px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-900 hover:text-navy-900 transition-colors"
                >
                  {sector.name}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Areas this service is available in */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Coverage</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl leading-tight text-balance">
                {service.name} Available Across London
              </h2>
            </AnimateIn>
            <div className="mt-8 flex flex-wrap gap-3">
              {locations.filter((l) => l.hasServiceCombos).map((location) => (
                <a
                  key={location.slug}
                  href={`/services/${service.slug}/${location.slug}`}
                  className="rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 hover:border-navy-900 hover:text-navy-900 transition-colors"
                >
                  {location.name}
                </a>
              ))}
            </div>
            <p className="mt-6 text-sm text-slate">
              Don't see your area? <a href="/coverage" className="text-orange-600 font-semibold hover:underline">View our full London coverage</a>.
            </p>
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
