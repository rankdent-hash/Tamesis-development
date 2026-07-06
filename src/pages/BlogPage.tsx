import { useEffect, useState } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { unsplashUrl } from "../data/photos";
import { fetchBlogPosts, type BlogPostSummary } from "../lib/blog";

function formatDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogPage() {
  const [posts, setPosts] = useState<BlogPostSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts().then((result) => {
      if (result.success) {
        setPosts(result.posts || []);
      } else {
        setError(result.error || "Failed to load posts");
      }
    });
  }, []);

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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
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
                        <div className="mt-5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5 text-xs text-slate-light">
                            <Calendar size={12} /> {formatDate(post.published_at)}
                          </span>
                          <ArrowRight size={16} className="text-slate-light group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </div>
                    </a>
                  </AnimateIn>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
