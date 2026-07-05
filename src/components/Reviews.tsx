import { Star } from "lucide-react";
import { ReviewsCarousel } from "./ReviewsCarousel";

export function Reviews() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Reviews</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Customer Reviews
          </h2>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex text-orange-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm font-semibold text-navy-900">4.6 average &middot; 520+ Google reviews</span>
          </div>
        </div>

        <div className="mt-12">
          <ReviewsCarousel />
        </div>

        <div className="mt-10 text-center">
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            Read More Reviews
          </a>
        </div>
      </div>
    </section>
  );
}
