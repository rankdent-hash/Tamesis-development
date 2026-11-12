import { ArrowRight } from "lucide-react";
import { news, newsCategoryIcon } from "../data/content";
import { Illustration } from "./Illustration";
import { newsPhotos, unsplashUrl } from "../data/photos";
import { AnimateIn } from "./AnimateIn";

export function News() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> Insights
            </span>
            <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
              Latest <span className="text-orange-600">News &amp; Guidance</span>
            </h2>
          </div>
          <a
            href="/news"
            className="group inline-flex items-center gap-2 self-start sm:self-auto text-sm font-bold text-navy-900 hover:text-orange-600 transition-colors"
          >
            All articles
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </AnimateIn>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {news.map((article, i) => (
            <AnimateIn key={article.title} delay={i * 0.08} className="h-full">
              <a
                href="/news"
                className="group flex h-full flex-col rounded-3xl overflow-hidden bg-white border border-navy-100 shadow-card hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative overflow-hidden">
                  {newsPhotos[article.title] ? (
                    <img
                      src={unsplashUrl(newsPhotos[article.title])}
                      alt={article.title}
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <Illustration
                      icon={newsCategoryIcon[article.category] ?? "FileText"}
                      label={article.title}
                      className="aspect-[16/10]"
                    />
                  )}
                  <span className="absolute left-4 top-4 rounded-full bg-navy-950/85 backdrop-blur px-3 py-1.5 text-[10px] font-accent uppercase tracking-widest text-blue-300">
                    {article.category}
                  </span>
                </div>
                <div className="flex grow flex-col p-6">
                  <span className="text-xs text-slate-light">{article.date}</span>
                  <h3 className="mt-2 font-display font-semibold text-navy-900 text-lg leading-snug">{article.title}</h3>
                  <span className="mt-auto pt-5 inline-flex items-center gap-1.5 text-sm font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                    Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </a>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
