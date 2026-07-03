import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { PlaceholderImage } from "../components/PlaceholderImage";
import { AnimateIn } from "../components/AnimateIn";
import { Button } from "../components/ui/button";
import { news } from "../data/content";

export function News() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <PageHero
          eyebrow="Insights"
          title="Latest News"
          subtitle="Company updates, guidance and case studies from across Tamesis."
          breadcrumb="Latest News"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((article, i) => (
              <AnimateIn key={article.title} delay={(i % 3) * 0.06}>
                <a href="/contact" className="group corner-marks h-full flex flex-col rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow">
                  <PlaceholderImage label={article.title} className="aspect-[16/10]" />
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">
                      <span>{article.category}</span>
                      <span className="text-slate-light">&middot;</span>
                      <span className="text-slate-light normal-case tracking-normal font-sans">{article.date}</span>
                    </div>
                    <h3 className="mt-3 font-display font-semibold text-navy-900 text-lg leading-snug flex-1">{article.title}</h3>
                    <span className="mt-4 inline-flex text-sm font-semibold text-navy-900 group-hover:text-orange-600 transition-colors">
                      Read More &rarr;
                    </span>
                  </div>
                </a>
              </AnimateIn>
            ))}
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Have a Project You&rsquo;d Like to Discuss?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = "/quote")}>
                Request a Quote
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => (window.location.href = "/contact")}>
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
