import { useState } from "react";
import {
  ChevronDown,
  Home as HomeIcon,
  Info,
  Mail,
  FileText,
  Star,
  Briefcase,
  Newspaper,
  MapPin,
  Rocket,
  BookOpen,
  Scale,
  Phone,
} from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { Icon } from "../components/Icon";
import { services, sectors, locations, londonRegions } from "../data/content";

function SiteCard({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="corner-marks group flex items-start gap-3 rounded-2xl bg-white border border-navy-100 p-5 shadow-card hover:shadow-card-hover transition-all"
    >
      <span className="flex w-10 h-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-orange-500 group-hover:text-white transition-colors">
        {icon}
      </span>
      <div className="min-w-0">
        <span className="block font-display font-semibold text-navy-900 text-sm leading-snug">{title}</span>
        {subtitle && <span className="block mt-0.5 text-xs text-slate-light leading-snug">{subtitle}</span>}
      </div>
    </a>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
  tint = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  tint?: boolean;
}) {
  return (
    <section className={tint ? "py-14 lg:py-16 bg-navy-50" : "py-14 lg:py-16"}>
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">{eyebrow}</span>
        <h2 className="mt-2 font-display font-bold text-navy-900 text-2xl sm:text-3xl leading-tight">{title}</h2>
        {description && <p className="mt-2 text-sm text-slate max-w-2xl leading-relaxed">{description}</p>}
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}

function RegionAccordion() {
  const [open, setOpen] = useState<string | null>(londonRegions[0].region);

  return (
    <div className="space-y-3">
      {londonRegions.map((group) => {
        const areas = locations.filter((l) => l.borough && (group.boroughs as readonly string[]).includes(l.borough));
        const isOpen = open === group.region;
        return (
          <div key={group.region} className="rounded-2xl border border-navy-100 bg-white overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : group.region)}
              className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left"
            >
              <span className="flex items-center gap-2.5">
                <MapPin size={16} className="text-orange-500 shrink-0" />
                <span className="font-display font-semibold text-navy-900 text-sm">{group.region}</span>
                <span className="text-xs text-slate-light">({areas.length} areas)</span>
              </span>
              <ChevronDown size={16} className={`text-slate-light transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            {isOpen && (
              <div className="px-5 pb-4 flex flex-wrap gap-2">
                {areas.map((a) => (
                  <a
                    key={a.slug}
                    href={`/property-maintenance/${a.slug}`}
                    className="rounded-full border border-navy-100 px-3 py-1.5 text-xs font-medium text-navy-700 hover:border-orange-400 hover:text-orange-600 transition-colors"
                  >
                    {a.name}
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SiteExplorer() {
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Site Explorer"
        description="A visual map of every page on the Tamesis Development Ltd website — services, sectors, coverage areas, campaign landing pages, and more."
        path="/site-explorer"
      />
      <Header />
      <main>
        <PageHero
          eyebrow="Site Explorer"
          title="Every Page, Visually Organised"
          subtitle="A live map of the site's structure — services, sectors, coverage, and campaign landing pages, always in sync with what's actually live. Looking for a plain link list instead? Try the text sitemap."
          breadcrumb="Site Explorer"
        />

        <Section eyebrow="Start Here" title="Core Pages">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SiteCard icon={<HomeIcon size={18} strokeWidth={1.75} />} title="Home" href="/" />
            <SiteCard icon={<Info size={18} strokeWidth={1.75} />} title="About Us" href="/about" />
            <SiteCard icon={<Mail size={18} strokeWidth={1.75} />} title="Contact" href="/contact" />
            <SiteCard icon={<FileText size={18} strokeWidth={1.75} />} title="Get a Quote" href="/quote" />
            <SiteCard icon={<Phone size={18} strokeWidth={1.75} />} title="Emergency Callout" href="/emergency" />
            <SiteCard icon={<FileText size={18} strokeWidth={1.75} />} title="Report a Repair" href="/report-repair" />
            <SiteCard icon={<Star size={18} strokeWidth={1.75} />} title="Reviews" href="/reviews" />
            <SiteCard icon={<Rocket size={18} strokeWidth={1.75} />} title="Projects" href="/projects" />
            <SiteCard icon={<Briefcase size={18} strokeWidth={1.75} />} title="Careers" href="/careers" />
            <SiteCard icon={<Newspaper size={18} strokeWidth={1.75} />} title="News" href="/news" />
            <SiteCard icon={<BookOpen size={18} strokeWidth={1.75} />} title="Blog" subtitle="24 posts, CMS-managed" href="/blog" />
            <SiteCard icon={<MapPin size={18} strokeWidth={1.75} />} title="Coverage" href="/coverage" />
          </div>
        </Section>

        <Section
          eyebrow="Campaign Pages"
          title="Landing Pages"
          description="Dedicated, conversion-focused pages built for specific Google Ads campaigns — separate from the main service pages, matched precisely to what each ad promises."
          tint
        >
          <div className="grid sm:grid-cols-3 gap-4">
            <SiteCard
              icon={<Phone size={18} strokeWidth={1.75} />}
              title="Emergency Plumbing"
              subtitle="Plumbing campaign — emergency ad group"
              href="/services/emergency-plumbing"
            />
            <SiteCard
              icon={<Icon name="Droplets" size={18} strokeWidth={1.75} />}
              title="Blocked Drains"
              subtitle="Plumbing campaign — drains ad group"
              href="/services/blocked-drains"
            />
            <SiteCard
              icon={<Icon name="ShieldCheck" size={18} strokeWidth={1.75} />}
              title="Landlord Plumbing"
              subtitle="Plumbing campaign — landlord ad group"
              href="/services/landlord-plumbing"
            />
          </div>
        </Section>

        <Section eyebrow="16 Pages, 4 Categories" title="Services">
          {(["Repairs & Maintenance", "Plumbing & Drainage", "Bathrooms & Interiors", "Building & Specialist"] as const).map(
            (category) => (
              <div key={category} className="mb-8 last:mb-0">
                <h3 className="text-xs font-accent uppercase tracking-widest text-slate-light font-semibold mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {services
                    .filter((s) => s.category === category)
                    .map((s) => (
                      <SiteCard
                        key={s.slug}
                        icon={<Icon name={s.icon} size={18} strokeWidth={1.75} />}
                        title={s.name}
                        href={`/services/${s.slug}`}
                      />
                    ))}
                </div>
              </div>
            )
          )}
        </Section>

        <Section eyebrow="Who We Work With" title="Sectors" tint>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {sectors.map((s) => (
              <SiteCard key={s.slug} icon={<Icon name={s.icon} size={18} strokeWidth={1.75} />} title={s.name} href={`/sectors/${s.slug}`} />
            ))}
          </div>
        </Section>

        <Section
          eyebrow={`${locations.length} Areas`}
          title="Coverage Areas"
          description="Grouped by region — click a region to see its areas. 8 flagship areas also have dedicated service x location combo pages."
        >
          <RegionAccordion />
        </Section>

        <Section eyebrow="Reference" title="Legal & Other" tint>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            <SiteCard icon={<Scale size={18} strokeWidth={1.75} />} title="Privacy Policy" href="/privacy-policy" />
            <SiteCard icon={<Scale size={18} strokeWidth={1.75} />} title="Cookie Policy" href="/cookie-policy" />
            <SiteCard icon={<Scale size={18} strokeWidth={1.75} />} title="Terms & Conditions" href="/terms" />
            <SiteCard icon={<FileText size={18} strokeWidth={1.75} />} title="Text Sitemap" subtitle="Plain link list" href="/sitemap" />
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
