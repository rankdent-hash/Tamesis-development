import { MapPin } from "lucide-react";
import { projects, projectCategoryIcon } from "../data/content";
import { Illustration } from "./Illustration";

export function Projects() {
  return (
    <section className="py-24 lg:py-32 bg-navy-50">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Our Work</span>
            <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
              Featured Projects
            </h2>
          </div>
          <a
            href="/projects"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-6 py-3 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            View All Projects
          </a>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <a key={project.title} href="/projects" className="group corner-marks rounded-2xl overflow-hidden bg-white shadow-card hover:shadow-card-hover transition-shadow">
              <div className="overflow-hidden">
                <Illustration
                  icon={projectCategoryIcon[project.category] ?? "HardHat"}
                  label={project.title}
                  className="aspect-[4/3] transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">
                  {project.category}
                </span>
                <h3 className="mt-2 font-display font-semibold text-navy-900 text-lg leading-snug">{project.title}</h3>
                <span className="mt-2 flex items-center gap-1.5 text-sm text-slate">
                  <MapPin size={14} /> {project.location}
                </span>
                <span className="mt-4 inline-flex text-sm font-semibold text-navy-900 group-hover:text-blue-600 transition-colors">
                  Read Case Study &rarr;
                </span>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <a
            href="/projects"
            className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold"
          >
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}
