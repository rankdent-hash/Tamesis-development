import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { Illustration } from "../components/Illustration";
import { projectPhotos, unsplashUrl } from "../data/photos";
import { Button } from "../components/ui/button";
import { projects, projectFilters, projectCategoryIcon } from "../data/content";
import { cn } from "../lib/utils";
import { CtaPhoneLine } from "../components/CtaPhoneLine";

export function ProjectsPage() {
  const [filter, setFilter] = useState<(typeof projectFilters)[number]>("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.projects.title} description={seoMeta.projects.description} path="/projects" />
      <Header />
      <main>
        <PageHero
          eyebrow="Our Work"
          title="Featured Projects Across London"
          subtitle="A selection of repairs, refurbishment, maintenance and construction projects completed for housing associations, commercial clients and homeowners across London."
          breadcrumb="Projects"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 mb-12" role="group" aria-label="Filter projects by category">
              {projectFilters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={cn(
                    "rounded-full px-5 py-2.5 text-sm font-semibold border transition-colors",
                    filter === f
                      ? "bg-navy-900 text-white border-navy-900"
                      : "bg-white text-navy-700 border-navy-200 hover:border-navy-900"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <p className="text-slate">No projects found in this category yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => (
                  <a
                    key={project.title}
                    href="/contact"
                    className="group corner-marks rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow"
                  >
                    <div className="overflow-hidden">
                      {projectPhotos[project.title] ? (
                        <img
                          src={unsplashUrl(projectPhotos[project.title])}
                          alt={project.title}
                          className="aspect-[4/3] w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <Illustration
                          icon={projectCategoryIcon[project.category] ?? "HardHat"}
                          label={project.title}
                          className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">
                        {project.category}
                      </span>
                      <h3 className="mt-2 font-display font-semibold text-navy-900 text-lg leading-snug">{project.title}</h3>
                      <span className="mt-2 flex items-center gap-1.5 text-sm text-slate">
                        <MapPin size={14} /> {project.location}
                      </span>
                      <span className="mt-4 inline-flex text-sm font-semibold text-navy-900 group-hover:text-orange-600 transition-colors">
                        Read Case Study &rarr;
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Have a Project in Mind?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (navigate("/quote"))}>
                Get a Free Quote
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => (navigate("/contact"))}>
                Contact Us
              </Button>
            </div>
            <CtaPhoneLine />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
