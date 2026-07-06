import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Seo } from "../components/Seo";
import { services, sectors, locations, londonRegions } from "../data/content";

function LinkColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display font-bold text-navy-900 text-lg mb-4">{title}</h2>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="text-sm text-slate hover:text-orange-600 hover:underline transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SitemapPage() {
  const mainPages = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Sectors", href: "/sectors" },
    { label: "Coverage Areas", href: "/coverage" },
    { label: "Blog", href: "/blog" },
    { label: "Projects", href: "/projects" },
    { label: "Reviews", href: "/reviews" },
    { label: "News", href: "/news" },
    { label: "Careers", href: "/careers" },
    { label: "Contact Us", href: "/contact" },
    { label: "Request a Quote", href: "/quote" },
    { label: "Report a Repair", href: "/report-repair" },
    { label: "Emergency Callout", href: "/emergency" },
  ];

  const legalPages = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Cookie Policy", href: "/cookie-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Sitemap"
        description="A full list of every page on the Tamesis Development Ltd website — services, sectors, and areas we cover across London."
        path="/sitemap"
      />
      <Header />
      <main>
        <PageHero
          eyebrow="Sitemap"
          title="Site Map"
          subtitle="Every page on this site in one place. Looking for our XML sitemap instead? It's at /sitemap.xml, referenced in robots.txt for search engines."
          breadcrumb="Sitemap"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
              <LinkColumn title="Main Pages" links={mainPages} />
              <LinkColumn
                title="Services"
                links={services.map((s) => ({ label: s.name, href: `/services/${s.slug}` }))}
              />
              <LinkColumn
                title="Sectors"
                links={sectors.map((s) => ({ label: s.name, href: `/sectors/${s.slug}` }))}
              />
              <LinkColumn title="Legal" links={legalPages} />
            </div>

            <div className="mt-16 pt-16 border-t border-navy-100">
              <h2 className="font-display font-bold text-navy-900 text-2xl mb-8">
                Areas We Cover ({locations.length} London Locations)
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10">
                {londonRegions.map((group) => {
                  const regionLocations = locations.filter(
                    (l) => l.borough && (group.boroughs as readonly string[]).includes(l.borough)
                  );
                  return (
                    <LinkColumn
                      key={group.region}
                      title={group.region}
                      links={regionLocations.map((l) => ({
                        label: l.name,
                        href: `/property-maintenance/${l.slug}`,
                      }))}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
