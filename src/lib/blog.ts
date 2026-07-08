export interface BlogPostSummary {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover_photo: string | null;
  related_service_slug: string | null;
  published_at: string | null;
}

export interface BlogPost extends BlogPostSummary {
  content: string;
}

export async function fetchBlogPosts(): Promise<{ success: boolean; posts?: BlogPostSummary[]; error?: string }> {
  try {
    const res = await fetch("/api/blog-posts");
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to load blog posts" };
    }
    return { success: true, posts: data.posts };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function fetchBlogPostForService(
  serviceSlug: string
): Promise<{ success: boolean; post?: BlogPostSummary; error?: string }> {
  try {
    const res = await fetch(`/api/blog-posts?service=${encodeURIComponent(serviceSlug)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Failed to load" };
    }
    return { success: true, post: data.posts?.[0] };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}

export async function fetchBlogPost(slug: string): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    const res = await fetch(`/api/blog-posts?slug=${encodeURIComponent(slug)}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Post not found" };
    }
    return { success: true, post: data.post };
  } catch {
    return { success: false, error: "Network error — please try again" };
  }
}
