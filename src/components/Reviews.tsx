import { ArrowRight, Star } from "lucide-react";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { AnimateIn } from "./AnimateIn";

export function Reviews() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> Reviews
            </span>
            <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
              Don&rsquo;t take our word for it — <span className="text-orange-600">take theirs</span>
            </h2>
          </div>

          <div className="flex items-center gap-4 rounded-2xl bg-white border border-navy-100 px-5 py-4 shadow-card self-start lg:self-auto">
            <span className="font-accent text-4xl font-semibold text-navy-900 leading-none">4.6</span>
            <span className="flex flex-col gap-1.5">
              <span className="flex text-orange-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="text-sm font-semibold text-navy-900 leading-none">535+ Google reviews</span>
            </span>
          </div>
        </AnimateIn>

        <div className="mt-12">
          <ReviewsCarousel />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/reviews"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            Read More Reviews
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
