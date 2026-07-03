# Tamesis Development Ltd — Website

Vite + React + TypeScript + Tailwind CSS v4, with React Router, Framer Motion,
and shadcn/ui-style primitives (`cn()` utility + CVA `Button`). Built to
hand-code the site now, then connect to Lovable via GitHub sync instead of
generating it with prompts — this avoids spending Lovable credits on
layout/structure, and leaves credits for content edits, copy tweaks, and new
pages afterwards.

## Brand

**Design direction**: heritage British property brand — deep racing-green-black,
antique brass, warm ivory paper — rather than a generic navy/corporate-SaaS
palette. Signature motif is the blueprint-grid + corner-bracket treatment
(nods to surveying/technical drawings, ties to the construction/property
subject matter).

- **Palette**:
  - `navy-*` — ink: deep heritage green-black (`#0E1611`), primary dark
    surfaces and text-on-light
  - `orange-*` — brass: antique gold (`#C6A15B`), the **one** bold accent —
    used sparingly, primary CTAs only
  - `blue-*` — sage: muted olive-green, secondary accent for icons/labels/hover
  - `green-*` — functional success states only (e.g. trust-badge checkmarks),
    not a brand color
  - `paper` — warm ivory background (`#FAF8F4`), not flat cool grey
- **Fonts**: Bricolage Grotesque (headings — distinctive variable display
  face), Inter (body), IBM Plex Mono (labels, stats, phone numbers — ties
  into the blueprint/technical motif)
- **Header**: transparent over the hero, solidifies to the ivory paper
  background on scroll (every page has a dark hero, so this works site-wide)
- Tailwind color token *names* (`navy-900`, `orange-500`, etc.) were kept
  from an earlier palette iteration but now point at the values above — this
  means the whole site's color scheme lives in one place
  (`src/index.css` `@theme` block) and doesn't require touching individual
  components to re-theme.

## Lead capture

The homepage hero now has a compact quote-request form (`src/components/HeroQuoteForm.tsx`) on the right side — name, phone, service dropdown, submit. Client-side only for now (shows a success state, no backend wired up), same pattern as the other forms on the site (Contact, Careers, Quote, Report a Repair, Emergency). The component already accepts an optional `presetService` prop so it can be dropped into each of the 20 service pages later with the service field pre-filled/locked — not wired in yet, pending confirmation the homepage version looks right first.

## Structure

```
src/
  pages/        Home.tsx (full homepage) + ComingSoon.tsx (placeholder for routes not yet built)
  components/    one file per homepage section (Header, Hero, Services, ...)
  components/ui/ shadcn-style primitives (Button)
  data/          content.ts — all copy, stats, services, sectors, etc. in one place
  hooks/         useCountUp.ts — animated stat counters
  lib/           utils.ts — cn() classname helper
```

Edit `src/data/content.ts` to change company details, services, sectors,
stats, reviews, or nav links without touching component code. Every nav link
and card already routes to a real path — pages not yet built render a
branded "Coming Soon" placeholder rather than a dead link.

## Navigation

All internal links use plain `<a href="/path">` markup rather than React Router's `<Link>`. A global click interceptor (`src/hooks/useInternalLinkInterceptor.ts`, mounted once in `App.tsx`) catches clicks on same-origin `<a>` tags and routes them through React Router instead of a full page reload — external links, `tel:`/`mailto:`, `#` anchors, `target="_blank"`, and modified clicks (cmd/ctrl/shift-click) are left alone for the browser to handle natively. This gets the same instant client-side navigation as converting every anchor to `<Link>`, without the risk of a large mechanical find-and-replace across dynamic `href={...}` expressions.

CTA buttons (the `Button` component, which renders a `<button>` not an `<a>`) navigate via `useNavigate()` directly rather than `window.location.href`.

## SEO

- Every route sets its own `<title>`, meta description, canonical URL, and Open Graph/Twitter tags via `src/components/Seo.tsx` (client-side, since this is a Vite SPA — Google's crawler executes JS, but if you later want true pre-rendered meta for all crawlers, that would mean moving to a static-generation or SSR setup).
- JSON-LD structured data: site-wide `LocalBusiness` schema (`SiteSchema.tsx`), plus `BreadcrumbList` on every inner page, `FAQPage` on every service page, and `Service` schema on service pages.
- `public/sitemap.xml` and `public/robots.txt` are in place, listing all 210 routes (16 static pages + 20 services + 6 sectors + 8 location pages + 160 service×location combination pages).
- **Location SEO pages**: `/property-maintenance/:location` (8 areas: Fulham, Chelsea, Westminster, Kensington, Hammersmith, Camden, Islington, Wandsworth) and `/services/:service/:location` (all 20 services × all 8 locations = 160 pages) are both single dynamic routes/templates (`LocationTemplate.tsx`, `ServiceLocationTemplate.tsx`) driven by `src/data/content.ts` — add a new entry to the `locations` array to automatically get a new location page plus 20 new service+location combination pages.
- **Placeholder domain**: `https://www.tamesisdevelopment.co.uk` is used throughout (`src/lib/seo.ts`, `sitemap.xml`, `index.html`, and the company email) — update this to the real domain before launch. A quick way: search-and-replace `tamesisdevelopment.co.uk` across the repo.
- Still outstanding: location-based SEO pages (Property Maintenance London/Fulham/Chelsea etc. and service+location combinations) from the original brief haven't been built yet.

## Photography

The homepage hero, About, Featured Projects, Latest News, and Coverage sections, plus all 20 service pages (and the 160 service×location combo pages, which reuse the parent service's photo) now use **real, freely-licensed photos** from Unsplash — sourced in `src/data/photos.ts`. These are genuinely free for commercial use (the Unsplash License: free for any use, no attribution required — https://unsplash.com/license), and only free-tier photos were used (never Unsplash+ or iStock, which require payment).

Images use Unsplash's `auto=format` parameter, which automatically serves WebP/AVIF to browsers that support it (better than hardcoding a WebP URL, since it degrades gracefully for older browsers instead of breaking).

**Important caveat**: these are generic trade/property photos representing the *type* of work (a plumber, an electrician, a finished bathroom, a London skyline), not actual photos of Tamesis's own team, vans, or completed projects. Two service categories (`painting-decorating`, `damp-mould`) use an approximate fallback photo since a precisely-matched free photo wasn't sourced — worth revisiting with a dedicated search. Before launch, prioritise replacing these with real company photography for authenticity — swap the relevant entries in `src/data/photos.ts` with your own image URLs (or local files in `/public`) once available; no other code changes needed.

Every other image slot on the site (Sectors, Coverage/Contact maps on inner pages, Projects/News fallback) still uses `src/components/Illustration.tsx` — an original, on-brand SVG composition rather than stock photography. See below for details.

## Local development

```
npm install
npm run dev      # http://localhost:5173
npm run build    # production build to /dist
```

## Connecting to Lovable via GitHub

1. Push this repo to GitHub.
2. In Lovable, create a new project and choose "Import from GitHub" (or, in
   an existing empty project, go to Settings → GitHub → Connect and select
   this repo).
3. Lovable will sync the repo and you can continue editing visually/with
   prompts from there — further AI edits will only touch what you ask for,
   rather than regenerating the whole site.
4. Any commits pushed to GitHub afterwards (by you or Claude) will sync back
   into Lovable, and vice versa.

## Pages still to build

The homepage is complete. Routes exist for every other page in the site
structure (About, one route per Service, Sectors, Projects, Reviews,
Careers, Contact, Coverage, News, legal pages) but currently render a
"Coming Soon" placeholder — build these out next, one at a time, ideally
via Lovable prompts scoped to a single page so credit usage stays low.

