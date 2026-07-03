# Tamesis Development Ltd — Website

Vite + React + TypeScript + Tailwind CSS v4, with React Router, Framer Motion,
and shadcn/ui-style primitives (`cn()` utility + CVA `Button`). Built to
hand-code the site now, then connect to Lovable via GitHub sync instead of
generating it with prompts — this avoids spending Lovable credits on
layout/structure, and leaves credits for content edits, copy tweaks, and new
pages afterwards.

## Brand

- **Palette**: Navy (primary) / Construction Orange (secondary, all CTAs) /
  Professional Blue (accent — icons, eyebrow labels, links) / Green (success
  states only, e.g. trust-badge checkmarks).
- **Fonts**: Manrope (headings), Inter (body), Plus Jakarta Sans (labels,
  stats, buttons).

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

## SEO

- Every route sets its own `<title>`, meta description, canonical URL, and Open Graph/Twitter tags via `src/components/Seo.tsx` (client-side, since this is a Vite SPA — Google's crawler executes JS, but if you later want true pre-rendered meta for all crawlers, that would mean moving to a static-generation or SSR setup).
- JSON-LD structured data: site-wide `LocalBusiness` schema (`SiteSchema.tsx`), plus `BreadcrumbList` on every inner page, `FAQPage` on every service page, and `Service` schema on service pages.
- `public/sitemap.xml` and `public/robots.txt` are in place, listing all 210 routes (16 static pages + 20 services + 6 sectors + 8 location pages + 160 service×location combination pages).
- **Location SEO pages**: `/property-maintenance/:location` (8 areas: Fulham, Chelsea, Westminster, Kensington, Hammersmith, Camden, Islington, Wandsworth) and `/services/:service/:location` (all 20 services × all 8 locations = 160 pages) are both single dynamic routes/templates (`LocationTemplate.tsx`, `ServiceLocationTemplate.tsx`) driven by `src/data/content.ts` — add a new entry to the `locations` array to automatically get a new location page plus 20 new service+location combination pages.
- **Placeholder domain**: `https://www.tamesisdevelopment.co.uk` is used throughout (`src/lib/seo.ts`, `sitemap.xml`, `index.html`, and the company email) — update this to the real domain before launch. A quick way: search-and-replace `tamesisdevelopment.co.uk` across the repo.
- Still outstanding: location-based SEO pages (Property Maintenance London/Fulham/Chelsea etc. and service+location combinations) from the original brief haven't been built yet.

## Photography

Every image is currently a styled placeholder (`PlaceholderImage.tsx`) so the
layout is production-ready but has no real photos yet. Replace these with
real photography of engineers/projects before launch — either swap the
component for a plain `<img>` tag, or update `PlaceholderImage` to accept a
`src` prop.

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

