import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews as allReviews } from "../data/content";

export function ReviewsCarousel({ limit = 15 }: { limit?: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = allReviews.slice(0, limit);

  const scroll = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar pb-2"
      >
        {items.map((review) => (
          <div
            key={review.name + review.project}
            className="corner-marks snap-start shrink-0 w-[82%] sm:w-[46%] lg:w-[calc(25%-15px)] rounded-2xl bg-white p-7 shadow-card"
          >
            <div className="flex text-orange-400 mb-4">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-navy-800 text-sm leading-relaxed line-clamp-5">&ldquo;{review.review}&rdquo;</p>
            <div className="mt-6 flex items-center justify-between gap-2">
              <span className="font-display font-semibold text-navy-900 text-sm">{review.name}</span>
              <span className="text-xs font-accent uppercase tracking-widest text-slate-light shrink-0">
                {review.project}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden sm:flex justify-end gap-3 mt-6">
        <button
          onClick={() => scroll(-1)}
          aria-label="Previous reviews"
          className="w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={() => scroll(1)}
          aria-label="Next reviews"
          className="w-11 h-11 rounded-full border border-navy-200 flex items-center justify-center text-navy-900 hover:bg-navy-900 hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
