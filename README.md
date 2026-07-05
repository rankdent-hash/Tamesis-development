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

`/admin` (linked from the footer as "Admin Login") is a lightweight CRM for follow-up, laid out as a left sidebar + main content area:

**Sidebar sections**: Dashboard (overview + all leads), All Leads, Quote Requests, Callback Requests, Contact Enquiries, Emergency Callouts, Repair Requests, Careers, and Email Settings — each of the form-type sections shows only leads of that type, so e.g. clicking "Emergency Callouts" only shows emergency submissions. All share the same underlying leads data (fetched once) filtered client-side, so switching sections is instant with no extra network calls.

Each leads view includes:
- **Summary cards**: total, this week, new, won — scoped to whatever section you're viewing.
- **Card-based list** — status dot, name, relative time, form type badge, contact, service, message preview; click to expand into the full submission plus a follow-up notes field.
- **Status per lead**: New / Contacted / Quoted / Won / Lost — color-coded, changeable inline, saved immediately.
- **Filter tabs** (with live counts) and a **search box** (name/phone/email).
- **"Remove Sample Leads"** button (Dashboard header, with a confirmation prompt): calls `api/cleanup-sample-leads.ts`, which deletes only rows matching the exact fake phone numbers used by the old sample-data seeder (now removed) — it can never touch a real customer's lead, even by coincidence, since it matches on those specific fabricated values rather than names or dates.
- **Contact field helpers**: phone numbers are larger and bold with a copy-to-clipboard icon; email and address also get a copy icon. Hovering (or clicking, for touch/tablet) a phone number shows a popover with QR codes generated **entirely client-side** (via the `qrcode` package — phone numbers are never sent to a third-party QR API): "Scan to Call" always, plus "Scan to Text" and "Scan WhatsApp" if the number looks like a UK mobile (starts with 07/+447). See `src/components/admin/PhoneField.tsx`.

**Multiple notification emails**: the Email Settings notification field is a chip-style multi-email input — press Enter or comma after typing an address to add it, click the × on a chip to remove it. Stored as a comma-separated list in the `notify_email` setting. Resend sends to all of them natively (its `to` field accepts an array); Web3Forms sends to its account-registered address plus any extras via its `cc` parameter.

**Email Settings** section: manage everything about form-submission notifications directly in the admin panel, no Vercel/code access needed:
- **Notification email** — where submissions get sent.
- **Resend API key** and **Web3Forms API key** — both can be entered and saved here (stored in the `settings` Postgres table), each shown back only as a masked hint (e.g. `••••••••ab12`) once saved, never round-tripped in plaintext. Leaving a key field blank on save keeps whatever's already stored.
- **Email provider** — choose Resend only, Web3Forms only, or both (sends via both for redundancy). Falls back to the `RESEND_API_KEY`/`WEB3FORMS_API_KEY` env vars if nothing's been saved in the panel yet.

Requires environment variables in Vercel, plus attaching Postgres storage:

1. **Postgres storage**: uses whatever's attached via Vercel → Storage (currently a Supabase integration named `tamesisstorage`). Vercel's Supabase integration prefixes every variable with the storage resource's name (e.g. `tamesisstorage_POSTGRES_HOST`) rather than the plain `POSTGRES_URL` that some tooling expects by default — the `getConnectionString()` helper near the top of `api/leads.ts`, `api/seed-leads.ts`, `api/settings.ts`, `api/submit-form.ts` tries a few likely full-connection-string variable names first, then falls back to building one from the individual `tamesisstorage_POSTGRES_HOST` / `_DATABASE` / `_USER` / `_PASSWORD` variables.

   **Uses the standard `pg` (node-postgres) library, not `@vercel/postgres`.** That was a real, confirmed bug: `@vercel/postgres` is built on Neon's serverless driver, which is wired specifically for Neon-hosted databases — when pointed at a correct, working Supabase connection string, it silently substituted a different (Neon-internal) hostname at connection time and failed with `ENOTFOUND`, even though diagnostic logging showed the right host was being passed in. Confirmed by adding logging that printed the exact host being used (`aws-0-us-east-1.pooler.supabase.com`, a valid Supabase pooler address) immediately before the connection attempt failed while trying to reach a completely different, hardcoded host. Switching to `pg`, which makes a normal TCP connection to whatever host you give it, resolved this.


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

## Reviews carousel

`src/components/ReviewsCarousel.tsx` — a sliding carousel (4 cards visible on desktop, 2 on tablet, ~1.2 on mobile with a peek of the next card) showing up to 15 reviews from the `reviews` array in `content.ts`, with prev/next buttons plus native touch/swipe scrolling. Used on the homepage and on every service page.

**Important**: the current 15 reviews are the same placeholder-style testimonials used elsewhere on the site (not fabricated to look like specific real customers, no invented names presented as verified reviewers) — genuine reviews (e.g. from Ninja Plumbers' Google Business Profile, if that's the intended source) need to be supplied as actual text (not a Google share link — those are blocked from automated fetching, and reviews shouldn't be scraped/fabricated at scale regardless) before publishing. Swap the `reviews` array contents once real reviews are provided; no component changes needed.

## Copywriting pass

Hero headline/subheading rewritten for stronger conversion (leads with the fast-response/fixed-price/directly-employed hook that research showed matters most to this audience), and the primary CTA button label changed from "Request a Quote" to "Get a Free Quote" sitewide (the Quote page's own heading and the Contact form's dropdown option were left as "Request a Quote" since those describe the destination/category, not a persuasive button). The shared `getServiceContent()` generator in `content.ts` was also strengthened — since it drives all 20 service pages and all 160 service×location combo pages, this one edit improves conversion copy across all of them at once, rather than needing 180 individual rewrites.

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

