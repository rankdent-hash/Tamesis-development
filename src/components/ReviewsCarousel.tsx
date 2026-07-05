import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { reviews as allReviews } from "../data/content";

function GoogleIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label="Google">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18A13.96 13.96 0 0 1 10.94 24c0-1.45.25-2.86.7-4.18v-5.7H4.34A21.99 21.99 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  );
}

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
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="font-display font-semibold text-navy-900 text-sm">{review.name}</span>
              <GoogleIcon size={16} />
            </div>
            <div className="flex text-orange-400 mb-4">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="text-navy-800 text-sm leading-relaxed line-clamp-5">&ldquo;{review.review}&rdquo;</p>
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
