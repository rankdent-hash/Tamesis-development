import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { Icon } from "../components/Icon";
import { unsplashUrl } from "../data/photos";
import { SITE_URL, SITE_NAME } from "../lib/seo";
import { services } from "../data/content";
import { fetchBlogPost, type BlogPost } from "../lib/blog";

export function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    setPost(undefined);
    fetchBlogPost(slug).then((result) => {
      if (result.success && result.post) {
        setPost(result.post);
      } else {
        setPost(null);
        setError(result.error || "Post not found");
      }
    });
  }, [slug]);

  if (post === undefined) {
    return (
      <div className="min-h-screen bg-paper">
        <Header />
        <main className="pt-40 pb-24 text-center">
          <p className="text-sm text-slate">Loading article...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="min-h-screen bg-paper">
        <Seo title="Article Not Found" description="This article could not be found." path={`/blog/${slug}`} noindex />
        <Header />
        <main className="pt-40 pb-24 text-center px-6">
          <h1 className="font-display font-bold text-navy-900 text-2xl">Article Not Found</h1>
          <p className="mt-3 text-sm text-slate">{error}</p>
          <a href="/blog" className="mt-6 inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline">
            Back to Blog <ArrowRight size={14} />
          </a>
        </main>
        <Footer />
      </div>
    );
  }

  const path = `/blog/${post.slug}`;
  const relatedService = post.related_service_slug
    ? services.find((s) => s.slug === post.related_service_slug)
    : null;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at || undefined,
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}${path}`,
  };

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title={post.title}
        description={post.excerpt}
        path={path}
        image={post.cover_photo ? unsplashUrl(post.cover_photo, "auto=format&fit=crop&q=80&w=1200&h=630") : undefined}
        jsonLd={articleJsonLd}
      />
      <Header />
      <main>
        <section className="pt-32 sm:pt-36 lg:pt-44 pb-12 lg:pb-16 bg-navy-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-navy-900 blueprint-grid">
            <div className="absolute inset-0 bg-gradient-to-b from-navy-950/95 via-navy-950/85 to-navy-950" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 lg:px-8">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-navy-100/60 font-medium mb-6">
              <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
              <ChevronRight size={12} />
              <a href="/blog" className="hover:text-orange-400 transition-colors">Blog</a>
              <ChevronRight size={12} />
              <span className="text-navy-100/90 truncate max-w-[200px]">{post.title}</span>
            </nav>
            <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">
              {post.category}
            </span>
            <h1 className="mt-3 font-display font-extrabold text-white text-2xl sm:text-3xl lg:text-4xl leading-tight text-balance">
              {post.title}
            </h1>
          </div>
        </section>

        {post.cover_photo && (
          <div className="mx-auto max-w-3xl px-6 lg:px-8 -mt-8 relative">
            <img
              src={unsplashUrl(post.cover_photo)}
              alt={post.title}
              className="w-full aspect-[16/9] object-cover rounded-2xl shadow-card-hover corner-marks"
            />
          </div>
        )}

        <article className="py-16 lg:py-20">
          <div
            className="mx-auto max-w-3xl px-6 lg:px-8 prose-blog"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content, { async: false }) as string }}
          />
        </article>

        {relatedService && (
          <section className="pb-16">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
              <a
                href={`/services/${relatedService.slug}`}
                className="corner-marks group flex items-center gap-5 rounded-2xl bg-navy-50 border border-navy-100 p-6 hover:shadow-card transition-all"
              >
                <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-white text-orange-600 shadow-card">
                  <Icon name={relatedService.icon} size={18} strokeWidth={1.75} />
                </span>
                <div className="flex-1">
                  <span className="text-[11px] font-accent uppercase tracking-widest text-orange-600 font-semibold">
                    Related Service
                  </span>
                  <p className="mt-0.5 font-display font-semibold text-navy-900">{relatedService.name}</p>
                </div>
                <ArrowRight size={16} className="shrink-0 text-slate-light group-hover:text-orange-500 transition-colors" />
              </a>
            </div>
          </section>
        )}

        <section className="py-16 border-t border-navy-100">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-navy-900 text-2xl">Need Help With Something Similar?</h2>
            <p className="mt-3 text-slate">Get a clear, no-obligation quote from our team.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <a
                href="/quote"
                className="rounded-full bg-orange-500 text-navy-950 px-7 py-3.5 text-sm font-bold shadow-card hover:bg-orange-400 transition-all"
              >
                Get a Free Quote
              </a>
              <a
                href="/blog"
                className="rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
              >
                More Articles
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
