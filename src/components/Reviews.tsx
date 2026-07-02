import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews } from "../data/content";

export function Reviews() {
  const [index, setIndex] = useState(0);
  const visible = 2;

  const go = (dir: 1 | -1) => {
    setIndex((prev) => (prev + dir + reviews.length) % reviews.length);
  };

  const items = [reviews[index], reviews[(index + 1) % reviews.length]];

  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
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

          <div className="hidden sm:flex gap-3">
            <button
              onClick={() => go(-1)}
              aria-label="Previous reviews"
              className="w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next reviews"
              className="w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6">
          {items.slice(0, visible).map((review) => (
            <div key={review.name + review.project} className="rounded-2xl bg-white border border-navy-100 p-8 shadow-card">
              <div className="flex text-orange-400 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="text-navy-800 leading-relaxed">&ldquo;{review.review}&rdquo;</p>
              <div className="mt-6 flex items-center justify-between">
                <span className="font-display font-semibold text-navy-900 text-sm">{review.name}</span>
                <span className="text-xs font-accent uppercase tracking-widest text-slate-light">{review.project}</span>
              </div>
            </div>
          ))}
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
