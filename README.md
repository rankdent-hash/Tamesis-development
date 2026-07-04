# Tamesis Development Ltd — Website

Vite + React + TypeScript + Tailwind CSS v4, with React Router, Framer Motion,
and shadcn/ui-style primitives (`cn()` utility + CVA `Button`). Built to
hand-code the site now, then connect to Lovable via GitHub sync instead of
generating it with prompts — this avoids spending Lovable credits on
layout/structure, and leaves credits for content edits, copy tweaks, and new
pages afterwards.

## Deployment config (`vercel.json`)

This is a client-side SPA (React Router) combined with serverless API functions, which needs an explicit rewrite rule — otherwise directly visiting or refreshing a client route like `/admin` (or any page other than `/`) 404s, since there's no matching file for Vercel to serve. `vercel.json` rewrites everything except `/api/*` to `/index.html`, letting React Router take over; Vercel still serves real static files (JS/CSS/images) and API routes directly without hitting this rewrite, since it only applies when no matching file/function exists.

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

## Form submissions → email

All six forms (hero quote, `/quote`, `/contact`, `/report-repair`, `/emergency`, `/careers`) now POST to a Vercel serverless function at `api/submit-form.ts`, which saves the lead to Postgres **and** emails a notification via [Resend](https://resend.com) — these two things are fully independent; a submission only fails if *both* fail. So a missing/misconfigured `RESEND_API_KEY` no longer blocks leads from being saved to the admin panel (an earlier version of this function checked for the Resend key first and rejected the whole request before ever touching the database — fixed). Each form includes a hidden honeypot field for basic spam protection.

**To activate email notifications**, set in the Vercel project (Project → Settings → Environment Variables):
- `RESEND_API_KEY` — from resend.com → API Keys
- `NOTIFY_EMAIL` — fallback inbox if nothing's been saved in the admin panel's Settings tab yet (falls back further to `contact@tamesisdevelopment.co.uk` if both are unset)

Currently sends from Resend's shared sandbox address (`onboarding@resend.dev`), which works immediately with no setup. Once a real domain is registered and verified with Resend (a few DNS records), update the `FROM` constant in `api/submit-form.ts` to send from that domain instead — looks more professional and improves deliverability.

## Lead capture

The homepage hero and all 20 individual service pages now have a compact quote-request form (`src/components/HeroQuoteForm.tsx`) — name, phone, service dropdown, submit. On service pages it's pre-filled/locked to that page's service and uses the `compact` variant (~20% narrower, tighter spacing) via `src/components/ServiceHero.tsx`, which also uses the service's own real photo as the hero background. Not yet added to the 160 service×location combo pages — same one-line change (`<ServiceHero service={service} />` in place of the plain `PageHero`) if wanted there too.

## Admin panel — leads dashboard

`/admin` (linked from the footer as "Admin Login") is a lightweight CRM for follow-up, redesigned as two tabs:

**Leads tab**: card-based list (not a dense table) — each lead shows a status-color dot, name, relative time ("2h ago"), form type badge, contact details, service, and message preview at a glance; click a card to expand it into the full submission plus a follow-up notes field. Includes:
- **Summary cards**: total leads, this week, new, won — at a glance without opening anything.
- **Status per lead**: New / Contacted / Quoted / Won / Lost — color-coded, changeable inline, saved immediately.
- **Filter tabs** (with live counts) and a **search box** (name/phone/email).
- **Follow-up notes** per lead, saved separately from the original submission.
- **"Add Sample Leads"** button: inserts 13 realistic example submissions across all form types (including quote requests and callback requests specifically) with varied statuses and dates — safe to click repeatedly.

**Settings tab**: change the email address that receives form-submission notifications, without touching Vercel or code — stored in the `settings` Postgres table and read by `api/submit-form.ts` at send time (falls back to the `NOTIFY_EMAIL` env var if nothing's been saved yet). The Resend API key itself stays as an env var, since that's a one-time technical setup step rather than something that changes day to day.

Requires environment variables in Vercel, plus attaching Postgres storage:

1. **Postgres storage**: uses whatever's attached via Vercel → Storage (currently a Supabase integration named `tamesisstorage`). Vercel's Supabase integration prefixes every variable with the storage resource's name (e.g. `tamesisstorage_POSTGRES_HOST`) rather than the plain `POSTGRES_URL` that `@vercel/postgres` expects by default — the API functions handle this themselves (see `getConnectionString()` near the top of `api/leads.ts`, `api/seed-leads.ts`, `api/submit-form.ts`): they try a few likely full-connection-string variable names first, then fall back to building one from the individual `tamesisstorage_POSTGRES_HOST` / `_DATABASE` / `_USER` / `_PASSWORD` variables. If you ever swap storage providers or the resource gets renamed, check that these still resolve (a `500 "Database not configured"` response means they didn't — check the function's logs for the exact error).
2. **Set admin credentials** (Project → Settings → Environment Variables):
   - `ADMIN_EMAIL` — the login email
   - `ADMIN_PASSWORD` — the login password
   - `ADMIN_PIN` — a second-factor PIN, entered on a separate screen after the password
   - `ADMIN_SESSION_SECRET` — any long random string (used to sign login sessions — e.g. generate one with `openssl rand -hex 32`)

**Important — these are not in the codebase.** Since this GitHub repo is public, credentials are never hardcoded anywhere; they only exist as environment variables in Vercel. Whoever has access to the Vercel project's environment variables can see/change them — that's the actual access boundary, so keep Vercel project access limited to who should be able to log into `/admin`.

Sessions last 12 hours (see `TOKEN_LIFETIME_MS` in `api/admin-login.ts`), then require logging in again. The `/api/leads` endpoint validates every request server-side with a signed token — a stolen/guessed token can't be replayed without the `ADMIN_SESSION_SECRET`. (The token-signing logic is duplicated identically in `api/admin-login.ts` and `api/leads.ts` rather than shared from one file — Vercel's serverless bundler doesn't reliably include relative imports from outside the `/api` folder, so each function is kept self-contained.)

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

## Navigation & header

- **Services mega menu**: hovering "Services" in the desktop nav shows a dropdown grouped into 5 categories (Repairs & Maintenance, Plumbing & Drainage, Bathrooms, Interiors & Finishing, Building & Construction), each service with its icon, plus a "View All Services" link to `/services` (the full services index page is kept). Category assignment lives on each service object in `src/data/content.ts` (`category` field) — add a new service there and it automatically appears in the right mega menu column.
- **Header call icon**: a circular phone icon button sits next to "Request a Quote" in the desktop nav, linking directly to the Job Booking number.
- **Form field icons**: every input/select/textarea across all 6 forms (hero quote, Quote, Contact, Report a Repair, Emergency, Careers) has a matching icon inside the field (name → person icon, phone → phone icon, etc.) — no separate config, just look at each field's icon prop/wrapper in its component file.

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

