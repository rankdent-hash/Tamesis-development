import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowLeft,
  Save,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { services } from "../../data/content";
import {
  fetchAdminBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  seedBlogPosts,
  type AdminBlogPost,
} from "../../lib/adminAuth";

const EMPTY_FORM = {
  title: "",
  excerpt: "",
  content: "",
  category: "",
  coverPhoto: "",
  relatedServiceSlug: "",
  status: "draft",
};

export function BlogAdmin() {
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "form">("list");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchAdminBlogPosts();
    setLoading(false);
    if (result.success) {
      setPosts(result.posts || []);
    } else {
      setError(result.error || "Failed to load posts");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setView("form");
  };

  const openEdit = (post: AdminBlogPost) => {
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      coverPhoto: post.cover_photo || "",
      relatedServiceSlug: post.related_service_slug || "",
      status: post.status,
    });
    setEditingId(post.id);
    setView("form");
  };

  const handleDelete = async (post: AdminBlogPost) => {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    const result = await deleteBlogPost(post.id);
    if (result.success) {
      load();
    } else {
      setError(result.error || "Failed to delete post");
    }
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setError(null);
    const status = publish ? "published" : "draft";
    const result = editingId
      ? await updateBlogPost(editingId, { ...form, status })
      : await createBlogPost({ ...form, status });
    setSaving(false);
    if (result.success) {
      setView("list");
      load();
    } else {
      setError(result.error || "Failed to save post");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMessage(null);
    const result = await seedBlogPosts();
    setSeeding(false);
    if (result.success) {
      setSeedMessage(
        result.inserted && result.inserted > 0
          ? `Added ${result.inserted} new article${result.inserted === 1 ? "" : "s"}.`
          : "No new articles to add — everything's already published."
      );
      load();
    } else {
      setError(result.error || "Failed to add starter posts");
    }
  };

  if (view === "form") {
    return (
      <div className="max-w-3xl">
        <button
          onClick={() => setView("list")}
          className="flex items-center gap-1.5 text-sm text-slate hover:text-navy-900 transition-colors mb-6"
        >
          <ArrowLeft size={14} /> Back to all posts
        </button>

        <div className="rounded-2xl border-2 border-navy-900 bg-white p-7 shadow-card space-y-5">
          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. 5 Signs You Need an Emergency Plumber"
              className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="e.g. Emergency & Repairs"
                className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-800 mb-1.5">
                Cover Photo <span className="text-slate-light font-normal">(Unsplash photo ID, optional)</span>
              </label>
              <input
                type="text"
                value={form.coverPhoto}
                onChange={(e) => setForm((f) => ({ ...f, coverPhoto: e.target.value }))}
                placeholder="photo-XXXXXXXXXXXXX"
                className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none font-mono text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">
              Related Service <span className="text-slate-light font-normal">(optional — shows a link to this post on that service's page, and links back to it)</span>
            </label>
            <select
              value={form.relatedServiceSlug}
              onChange={(e) => setForm((f) => ({ ...f, relatedServiceSlug: e.target.value }))}
              className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none bg-white"
            >
              <option value="">None</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">
              Excerpt <span className="text-slate-light font-normal">(shown on the blog listing page)</span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border-2 border-navy-900 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-navy-800 mb-1.5">
              Content <span className="text-slate-light font-normal">(Markdown — ## for headings, **bold**, [link text](/url), - for bullet points)</span>
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              rows={16}
              className="w-full rounded-lg border-2 border-navy-900 px-4 py-3 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-400 outline-none resize-y leading-relaxed"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button variant="primary" onClick={() => handleSave(true)} disabled={saving || !form.title}>
              <Save size={14} /> {saving ? "Saving..." : "Publish"}
            </Button>
            <Button variant="outline" onClick={() => handleSave(false)} disabled={saving || !form.title}>
              Save as Draft
            </Button>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-xs text-red-600">
              <AlertCircle size={13} /> {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-sm text-slate">Write and manage blog articles — published posts appear at /blog immediately.</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSeed} disabled={seeding}>
            <Sparkles size={13} /> {seeding ? "Checking..." : "Publish Starter Articles"}
          </Button>
          <Button variant="primary" size="sm" onClick={openNew}>
            <Plus size={14} /> New Post
          </Button>
        </div>
      </div>

      {seedMessage && (
        <p className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2 mb-4">
          <CheckCircle2 size={13} /> {seedMessage}
        </p>
      )}

      {loading && <p className="text-sm text-slate">Loading posts...</p>}

      {error && (
        <p className="flex items-center gap-1.5 text-sm text-red-600 mb-4">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      {!loading && posts && posts.length === 0 && (
        <div className="rounded-2xl border-2 border-navy-100 bg-white p-12 text-center">
          <p className="text-sm text-slate max-w-sm mx-auto">
            No blog posts yet. Write your first one, or use "Publish Starter Articles" above to add some ready-made ones.
          </p>
          <div className="mt-5 flex justify-center">
            <Button variant="primary" onClick={openNew}>
              <Plus size={14} /> Write a Post
            </Button>
          </div>
        </div>
      )}

      {!loading && posts && posts.length > 0 && (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border-2 border-navy-900 bg-white p-5 shadow-card"
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shrink-0",
                  post.status === "published" ? "bg-green-50 text-green-700" : "bg-navy-50 text-navy-700"
                )}
              >
                {post.status === "published" ? <CheckCircle2 size={12} /> : <Pencil size={12} />}
                {post.status === "published" ? "Published" : "Draft"}
              </span>

              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-navy-900 truncate">{post.title}</p>
                <p className="text-xs text-slate-light">{post.category}</p>
              </div>

              {post.status === "published" && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs font-semibold text-orange-600 hover:underline shrink-0"
                >
                  View <ExternalLink size={11} />
                </a>
              )}

              <button
                onClick={() => openEdit(post)}
                className="flex items-center gap-1 rounded-full border border-navy-200 px-3 py-1.5 text-xs font-semibold text-navy-700 hover:border-navy-900 hover:text-navy-900 transition-colors shrink-0"
              >
                <Pencil size={12} /> Edit
              </button>
              <button
                onClick={() => handleDelete(post)}
                className="flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors shrink-0"
              >
                <Trash2 size={12} /> Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
