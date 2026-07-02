import { news } from "../data/content";
import { PlaceholderImage } from "./PlaceholderImage";

import { AnimateIn } from "./AnimateIn";

export function News() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="max-w-2xl">
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Insights</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Latest News
          </h2>
        </AnimateIn>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {news.map((article) => (
            <a key={article.title} href="/news" className="group corner-marks rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow">
              <PlaceholderImage label={article.title} className="aspect-[16/10]" />
              <div className="p-6">
                <div className="flex items-center gap-3 text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">
                  <span>{article.category}</span>
                  <span className="text-slate-light">&middot;</span>
                  <span className="text-slate-light normal-case tracking-normal font-sans">{article.date}</span>
                </div>
                <h3 className="mt-3 font-display font-semibold text-navy-900 text-lg leading-snug">{article.title}</h3>
                <span className="mt-4 inline-flex text-sm font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">
                  Read More &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
