import { services, sectors } from "./src/data/content";
import { servicePhotos, sectorPhotos, handymanSubPhotos, unsplashUrl } from "./src/data/photos";
import { seoMeta } from "./src/data/seoMeta";

// ---------------------------------------------------------------------------
// WHY THIS FILE EXISTS
// ---------------------------------------------------------------------------
// This site is a client-rendered React SPA. Per-page <title>/description/
// og:image tags are set by the Seo component via useEffect, AFTER React
// mounts and runs. Social media link-preview crawlers (Facebook, LinkedIn,
// Twitter/X, WhatsApp, Slack, Discord) do not execute JavaScript when
// fetching a URL to build a share card — they only read the static HTML
// Vercel returns for the request. That static HTML is index.html, which
// only has generic sitewide tags (and, before this fix, no og:image at
// all) — so every shared page showed the same generic (or blank-image)
// preview regardless of which page was actually shared.
//
// This middleware detects known crawler user-agents and, for those
// requests only, returns a small, fast, per-page HTML response with the
// correct title/description/og:image/canonical for the requested path —
// computed from the exact same data sources (services, sectors, seoMeta,
// photos) the real React pages use, so the two can't drift out of sync.
// Ordinary browser requests pass straight through untouched.
// ---------------------------------------------------------------------------

const SITE_URL = "https://www.tamesisdevelopment.co.uk";
const SITE_NAME = "Tamesis Development Ltd";
const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1632862378103-8248dccb7e3d?auto=format&fit=crop&q=80&w=1200&h=630";
const IMG_PARAMS = "auto=format&fit=crop&q=80&w=1200&h=630";

const CRAWLER_UA_PATTERNS = [
  "facebookexternalhit",
  "facebot",
  "linkedinbot",
  "twitterbot",
  "slackbot",
  "whatsapp",
  "discordbot",
  "telegrambot",
  "pinterest",
  "skypeuripreview",
  "redditbot",
  "vkshare",
];

function isCrawler(userAgent: string): boolean {
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA_PATTERNS.some((p) => ua.includes(p));
}

// The handful of bespoke, hand-built landing pages that aren't part of the
// generic services array — their title/description/photo are hardcoded in
// their own .tsx files via <Seo>, duplicated here since parsing JSX at the
// edge isn't practical. These change rarely, so the duplication is a
// reasonable trade-off.
const BESPOKE_PAGES: Record<string, { title: string; description: string; image: string }> = {
  "/services/tap-repairs": {
    title: "Dripping Tap Repair London — Fast, Fixed Price",
    description:
      "Dripping or leaking tap? Directly employed engineers fix it fast, fixed price, across London. Call now or book online.",
    image: unsplashUrl("photo-1749532125405-70950966b0e5", IMG_PARAMS),
  },
  "/services/toilet-repairs": {
    title: "Toilet Repair London — Fast, Fixed Price",
    description: "Toilet not flushing or leaking? Directly employed engineers fix it fast, fixed price, across London.",
    image: unsplashUrl("photo-1749532125405-70950966b0e5", IMG_PARAMS),
  },
  "/services/low-water-pressure": {
    title: "Low Water Pressure London — Diagnosis & Repair",
    description: "Weak shower or slow taps? Directly employed engineers diagnose and fix low water pressure across London.",
    image: unsplashUrl("photo-1749532125405-70950966b0e5", IMG_PARAMS),
  },
  "/services/blocked-drains": {
    title: "Blocked Drain Unblocking London — Same-Day",
    description: "Blocked drain? Directly employed engineers clear it fast, across every London borough.",
    image: unsplashUrl("photo-1521207418485-99c705420785", IMG_PARAMS),
  },
  "/services/emergency-plumbing": {
    title: "Emergency Plumber London — 24/7 Response",
    description: "Burst pipe or flooding? Directly employed emergency plumbers respond fast, 24/7, across London.",
    image: unsplashUrl("photo-1749532125405-70950966b0e5", IMG_PARAMS),
  },
  "/services/landlord-plumbing": {
    title: "Landlord Plumbing & Gas Safety London",
    description: "Gas Safe registered engineers for landlord compliance and rental property plumbing across London.",
    image: unsplashUrl("photo-1621983209352-c2880ac507b2", IMG_PARAMS),
  },
  "/services/furniture-assembly": {
    title: "Furniture Assembly London — Flat-Pack & More",
    description: "Flat-pack, wardrobes, TV units — assembled properly by directly employed engineers across London.",
    image: unsplashUrl(handymanSubPhotos["furniture-assembly"], IMG_PARAMS),
  },
  "/services/shelving-tv-mounting": {
    title: "Shelving & TV Mounting London",
    description: "Shelves, TVs and pictures fixed securely by directly employed engineers across London.",
    image: unsplashUrl(handymanSubPhotos["shelving-tv-mounting"], IMG_PARAMS),
  },
  "/services/gutter-cleaning": {
    title: "Gutter Cleaning London",
    description: "Gutters cleared of leaves and debris before they cause overflow and damp, across London.",
    image: unsplashUrl(handymanSubPhotos["gutter-cleaning"], IMG_PARAMS),
  },
  "/services/minor-plumbing-repairs": {
    title: "Minor Plumbing Repairs London",
    description: "Small plumbing jobs fixed quickly by directly employed engineers across London.",
    image: unsplashUrl(handymanSubPhotos["minor-plumbing-repairs"], IMG_PARAMS),
  },
  "/services/minor-electrical-repairs": {
    title: "Minor Electrical Repairs London",
    description: "Light fittings, sockets and switches replaced safely across London.",
    image: unsplashUrl(handymanSubPhotos["minor-electrical-repairs"], IMG_PARAMS),
  },
  "/services/painting-touch-ups": {
    title: "Painting Touch-Ups London",
    description: "Scuffs and marks freshened up neatly, matched to your existing paint colour, across London.",
    image: unsplashUrl(handymanSubPhotos["painting-touch-ups"], IMG_PARAMS),
  },
  "/services/ikea-installation": {
    title: "IKEA Furniture Assembly & Installation London",
    description: "PAX wardrobes, bookcases, bed frames and kitchen units assembled properly across London.",
    image: unsplashUrl(handymanSubPhotos["furniture-assembly"], IMG_PARAMS),
  },
};

const STATIC_PAGE_PATHS: Record<string, keyof typeof seoMeta> = {
  "/": "home",
  "/about": "about",
  "/services": "services",
  "/sectors": "sectors",
  "/projects": "projects",
  "/reviews": "reviews",
  "/careers": "careers",
  "/contact": "contact",
  "/quote": "quote",
  "/report-repair": "reportRepair",
  "/emergency": "emergency",
  "/coverage": "coverage",
  "/news": "news",
  "/privacy-policy": "privacy",
  "/cookie-policy": "cookies",
  "/terms": "terms",
  "/blog": "blog",
};

interface PageMeta {
  title: string;
  description: string;
  image: string;
}

function getStaticMeta(pathname: string): PageMeta | null {
  const clean = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;

  if (BESPOKE_PAGES[clean]) return BESPOKE_PAGES[clean];

  const staticKey = STATIC_PAGE_PATHS[clean];
  if (staticKey) {
    const meta = seoMeta[staticKey];
    return { title: meta.title, description: meta.description, image: DEFAULT_IMAGE };
  }

  if (clean.startsWith("/services/")) {
    const slug = clean.replace("/services/", "");
    const service = services.find((s) => s.slug === slug);
    if (service) {
      const photoId = servicePhotos[service.slug as keyof typeof servicePhotos];
      return {
        title: `${service.name} in London`,
        description: `Professional ${service.name.toLowerCase()} across London from Tamesis Development Ltd — directly employed engineers, clear quotes, and work for housing associations, landlords and homeowners.`,
        image: photoId ? unsplashUrl(photoId, IMG_PARAMS) : DEFAULT_IMAGE,
      };
    }
  }

  if (clean.startsWith("/sectors/")) {
    const slug = clean.replace("/sectors/", "");
    const sector = sectors.find((s) => s.slug === slug);
    if (sector) {
      const photoId = sectorPhotos[sector.slug as keyof typeof sectorPhotos];
      return {
        title: `${sector.name} — Property Maintenance for ${sector.name}`,
        description: `Tamesis Development Ltd provides property maintenance and repairs for ${sector.name.toLowerCase()} across London.`,
        image: photoId ? unsplashUrl(photoId, IMG_PARAMS) : DEFAULT_IMAGE,
      };
    }
  }

  return null;
}

async function getBlogMeta(slug: string): Promise<PageMeta | null> {
  try {
    const res = await fetch(`${SITE_URL}/api/blog-posts?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const post = data.post;
    if (!post) return null;
    return {
      title: post.title,
      description: post.excerpt,
      image: post.cover_photo ? unsplashUrl(post.cover_photo, IMG_PARAMS) : DEFAULT_IMAGE,
    };
  } catch {
    return null;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderHtml(meta: PageMeta, path: string): string {
  const fullTitle = meta.title.includes(SITE_NAME) ? meta.title : `${meta.title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const title = escapeHtml(fullTitle);
  const description = escapeHtml(meta.description);

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${title}</title>
<meta name="description" content="${description}" />
<link rel="canonical" href="${url}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:type" content="website" />
<meta property="og:url" content="${url}" />
<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:image" content="${meta.image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${meta.image}" />
</head>
<body>
<h1>${title}</h1>
<p>${description}</p>
<p><a href="${url}">${url}</a></p>
</body>
</html>`;
}

export const config = {
  matcher: "/((?!api/|assets/|.*\\.(?:js|css|png|jpg|jpeg|svg|ico|xml|txt|json|webmanifest)$).*)",
};

export default async function middleware(request: Request) {
  const userAgent = request.headers.get("user-agent") || "";
  if (!isCrawler(userAgent)) {
    return; // not a crawler — let the normal SPA response through untouched
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  let meta = getStaticMeta(pathname);

  if (!meta && pathname.startsWith("/blog/")) {
    const slug = pathname.replace("/blog/", "").replace(/\/$/, "");
    if (slug) meta = await getBlogMeta(slug);
  }

  if (!meta) {
    // Unrecognised path (locations, sector sub-pages not yet mapped, etc.)
    // — fall back to the sitewide default rather than serving nothing.
    meta = {
      title: seoMeta.home.title,
      description: seoMeta.home.description,
      image: DEFAULT_IMAGE,
    };
  }

  return new Response(renderHtml(meta, pathname), {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
