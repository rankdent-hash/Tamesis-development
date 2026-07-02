# Tamesis Development Ltd — Website

Vite + React + TypeScript + Tailwind CSS v4. Built to hand-code the homepage now,
then connect to Lovable via GitHub sync (Lovable > Settings > GitHub > "Connect
existing repo") instead of generating it with prompts — this avoids spending
Lovable credits on layout/structure, and leaves credits for content edits,
copy tweaks, and new pages afterwards.

## Structure

```
src/
  components/   one file per homepage section (Header, Hero, Services, ...)
  data/         content.ts — all copy, stats, services, sectors, etc. in one place
  hooks/        useCountUp.ts — animated stat counters
```

Edit `src/data/content.ts` to change company details, services, sectors,
stats, reviews, or nav links without touching component code.

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

1. Push this repo to GitHub (see instructions given alongside this project).
2. In Lovable, create a new project and choose "Import from GitHub" (or, in
   an existing empty project, go to Settings → GitHub → Connect and select
   this repo).
3. Lovable will sync the repo and you can continue editing visually/with
   prompts from there — further AI edits will only touch what you ask for,
   rather than regenerating the whole site.
4. Any commits pushed to GitHub afterwards (by you or Claude) will sync back
   into Lovable, and vice versa.

## Pages still to build

The homepage is complete per spec. Still outstanding, per the original site
structure doc: About, individual Service pages (one per service using the
same layout: hero / overview / what we do / common issues / process / why
choose us / FAQs / CTA), Sectors landing + sub-pages, Projects portfolio,
Reviews, Careers, Contact, and location + service-location SEO pages.
