import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { unsplashUrl } from "../data/photos";
import { fetchBlogPosts, type BlogPostSummary } from "../lib/blog";

const POSTS_PER_PAGE = 9;

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchBlogPosts().then((result) => {
      if (result.success) {
        setPosts(result.posts || []);
      } else {
        setError(result.error || "Failed to load posts");
      }
    });
  }, []);

  const totalPages = posts ? Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE)) : 1;
  const pagePosts = posts ? posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE) : [];

  const goToPage = (n: number) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.blog.title} description={seoMeta.blog.description} path="/blog" />
      <Header />
      <main>
        <PageHero
          eyebrow="Blog"
          title="Property Maintenance Advice & Guides"
          subtitle="Practical, no-nonsense advice on repairs, maintenance and refurbishment — for homeowners, landlords and housing associations across London."
          breadcrumb="Blog"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            {!posts && !error && <p className="text-center text-sm text-slate">Loading articles...</p>}

            {posts && posts.length === 0 && (
              <p className="text-center text-sm text-slate">No articles published yet — check back soon.</p>
            )}

            {posts && posts.length > 0 && (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {pagePosts.map((post) => (
                    <AnimateIn key={post.slug}>
                      <a
                        href={`/blog/${post.slug}`}
                        className="corner-marks group block rounded-2xl bg-white border border-navy-100 shadow-card hover:shadow-card-hover transition-all overflow-hidden h-full"
                      >
                        {post.cover_photo && (
                          <div className="aspect-[16/10] overflow-hidden">
                            <img
                              src={unsplashUrl(post.cover_photo)}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <span className="text-[11px] font-accent uppercase tracking-widest text-orange-600 font-semibold">
                            {post.category}
                          </span>
                          <h2 className="mt-2 font-display font-bold text-navy-900 text-lg leading-snug">
                            {post.title}
                          </h2>
                          <p className="mt-2.5 text-sm text-slate leading-relaxed line-clamp-3">{post.excerpt}</p>
                          <div className="mt-5 flex items-center justify-end">
                            <ArrowRight size={16} className="text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                          </div>
                        </div>
                      </a>
                    </AnimateIn>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Blog pagination" className="mt-16 flex items-center justify-center gap-2">
                    <button
                      onClick={() => goToPage(page - 1)}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-navy-200 text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-navy-900 hover:enabled:text-white transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => goToPage(n)}
                        aria-current={n === page ? "page" : undefined}
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                          n === page
                            ? "bg-orange-500 text-navy-950"
                            : "border border-navy-200 text-navy-900 hover:bg-navy-50"
                        }`}
                      >
                        {n}
                      </button>
                    ))}

                    <button
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="flex items-center justify-center w-10 h-10 rounded-full border border-navy-200 text-navy-900 disabled:opacity-30 disabled:cursor-not-allowed hover:enabled:bg-navy-900 hover:enabled:text-white transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </nav>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
