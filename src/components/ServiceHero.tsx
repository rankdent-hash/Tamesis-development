import { ChevronRight } from "lucide-react";
import { HeroQuoteForm } from "./HeroQuoteForm";
import type { Service } from "../data/content";
import { servicePhotos, unsplashUrl } from "../data/photos";

export function ServiceHero({ service }: { service: Service }) {
  const photo = servicePhotos[service.slug];

  return (
    <section className="relative pt-32 sm:pt-36 lg:pt-44 pb-16 sm:pb-20 lg:pb-24 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-navy-900">
        {photo && (
          <img src={unsplashUrl(photo)} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/92 via-navy-950/82 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/35 to-navy-950/65" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-center">
        <div>
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-navy-100/60 font-medium mb-5">
            <a href="/" className="hover:text-orange-400 transition-colors">Home</a>
            <ChevronRight size={12} />
            <a href="/services" className="hover:text-orange-400 transition-colors">Services</a>
            <ChevronRight size={12} />
            <span className="text-navy-100/90">{service.name}</span>
          </nav>

          <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">Services</span>
          <h1 className="mt-3 font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-5xl leading-[1.1] text-balance max-w-2xl">
            {service.name} in London
          </h1>
          <p className="mt-5 text-base sm:text-lg text-navy-100/75 max-w-xl leading-relaxed">
            Professional {service.name.toLowerCase()} across London, delivered by directly employed engineers — for
            housing associations, local authorities, commercial clients, landlords and homeowners.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="/quote"
              className="rounded-full bg-orange-500 text-navy-950 px-8 py-4 text-sm font-bold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
            >
              Request a Quote
            </a>
            <a
              href="/contact"
              className="rounded-full border border-white/30 text-white px-8 py-4 text-sm font-bold hover:bg-white/10 transition-all"
            >
              Contact Us
            </a>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <HeroQuoteForm compact presetService={service.name} />
        </div>
      </div>
    </section>
  );
}
