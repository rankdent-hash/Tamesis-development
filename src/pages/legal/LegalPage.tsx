import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { PageHero } from "../../components/PageHero";
import { Seo } from "../../components/Seo";

export function LegalPage({
  title,
  updated,
  description,
  path,
  sections,
}: {
  title: string;
  updated: string;
  description: string;
  path: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={title} description={description} path={path} />
      <Header />
      <main>
        <PageHero eyebrow="Legal" title={title} subtitle={`Last updated: ${updated}`} breadcrumb={title} />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6 lg:px-8 space-y-12">
            {sections.map((section) => (
              <div key={section.heading}>
                <h2 className="font-display font-bold text-navy-900 text-xl">{section.heading}</h2>
                <div className="mt-4 space-y-4 text-slate leading-relaxed">
                  {section.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
