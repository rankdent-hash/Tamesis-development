import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { Button } from "../components/ui/button";
import { reviews } from "../data/content";
import { CtaPhoneLine } from "../components/CtaPhoneLine";

const breakdown = [
  { stars: 5, pct: 78 },
  { stars: 4, pct: 16 },
  { stars: 3, pct: 4 },
  { stars: 2, pct: 1 },
  { stars: 1, pct: 1 },
];

export function ReviewsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.reviews.title} description={seoMeta.reviews.description} path="/reviews" />
      <Header />
      <main>
        <PageHero
          eyebrow="Reviews"
          title="What Our Clients Say"
          subtitle="520+ verified reviews from housing associations, commercial clients, landlords and homeowners across London."
          breadcrumb="Reviews"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            {/* Rating summary */}
            <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start mb-16">
              <AnimateIn className="rounded-2xl bg-white border border-navy-100 p-8 shadow-card text-center lg:text-left">
                <span className="font-accent font-extrabold text-navy-900 text-5xl">4.6</span>
                <div className="flex justify-center lg:justify-start text-orange-400 mt-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-2 text-sm text-slate font-medium">Based on 520+ Google reviews</p>
              </AnimateIn>

              <AnimateIn delay={0.1} className="space-y-2.5">
                {breakdown.map((row) => (
                  <div key={row.stars} className="flex items-center gap-3">
                    <span className="w-10 text-sm font-medium text-navy-700 shrink-0">{row.stars} star</span>
                    <div className="flex-1 h-2.5 rounded-full bg-navy-100 overflow-hidden">
                      <div className="h-full bg-orange-400 rounded-full" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-10 text-sm text-slate-light text-right shrink-0">{row.pct}%</span>
                  </div>
                ))}
              </AnimateIn>
            </div>

            {/* Reviews grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review, i) => (
                <AnimateIn
                  key={review.name + review.project}
                  delay={(i % 3) * 0.05}
                  className="rounded-2xl bg-white border border-navy-100 p-7 shadow-card"
                >
                  <div className="flex text-orange-400 mb-4">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} size={15} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-navy-800 text-sm leading-relaxed">&ldquo;{review.review}&rdquo;</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="font-display font-semibold text-navy-900 text-sm">{review.name}</span>
                    <span className="text-[11px] font-accent uppercase tracking-widest text-slate-light">{review.project}</span>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Ready to Experience the Same Standard?
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
