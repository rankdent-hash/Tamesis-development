import { MapPin } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { PlaceholderImage } from "../components/PlaceholderImage";
import { AnimateIn } from "../components/AnimateIn";
import { Button } from "../components/ui/button";

const boroughs = [
  "Westminster", "Camden", "Islington", "Hackney", "Tower Hamlets", "Greenwich",
  "Lewisham", "Southwark", "Lambeth", "Wandsworth", "Hammersmith & Fulham", "Kensington & Chelsea",
  "Brent", "Ealing", "Hounslow", "Richmond upon Thames", "Kingston upon Thames", "Merton",
  "Sutton", "Croydon", "Bromley", "Bexley", "Barking & Dagenham", "Redbridge",
  "Newham", "Waltham Forest", "Haringey", "Enfield", "Barnet", "Harrow",
  "Hillingdon", "Havering",
];

export function Coverage() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <PageHero
          eyebrow="Coverage"
          title="Coverage Across Every London Borough"
          subtitle="Our ten operational teams mean we can respond quickly wherever you are in Greater London — from responsive repairs to planned, portfolio-wide maintenance."
          breadcrumb="Coverage Areas"
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-start">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Service Area</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                All 32 London Boroughs
              </h2>
              <p className="mt-5 text-slate leading-relaxed max-w-lg">
                Whether it's a single property or a portfolio spread across multiple boroughs, our teams are
                positioned to cover the whole of Greater London for both emergency repairs and planned works.
              </p>

              <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3">
                {boroughs.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-sm text-navy-800 font-medium">
                    <MapPin size={14} className="text-orange-500 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-9">
                <Button variant="primary" onClick={() => (window.location.href = "/quote")}>
                  Request a Quote
                </Button>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1} className="corner-marks lg:sticky lg:top-32">
              <PlaceholderImage label="Greater London coverage map" className="aspect-square rounded-2xl shadow-card-hover" />
            </AnimateIn>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Not Sure If We Cover Your Area?
            </h2>
            <p className="mt-4 text-navy-100/75 max-w-xl mx-auto">
              Get in touch — chances are we already do.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = "/contact")}>
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
