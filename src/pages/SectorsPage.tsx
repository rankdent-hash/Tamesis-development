import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Seo } from "../components/Seo";
import { seoMeta } from "../data/seoMeta";
import { Footer } from "../components/Footer";
import { SectorHero } from "../components/SectorHero";
import { AnimateIn } from "../components/AnimateIn";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/button";
import { sectors } from "../data/content";
import { sectorsIndexPhoto } from "../data/photos";
import { CtaPhoneLine } from "../components/CtaPhoneLine";

export function SectorsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-paper">
      <Seo title={seoMeta.sectors.title} description={seoMeta.sectors.description} path="/sectors" />
      <Header />
      <main>
        <SectorHero
          title="A Single Reliable Contractor, Whatever the Sector"
          subtitle="From housing association contracts to individual homeowner repairs, we bring the same directly managed teams and the same standard of workmanship to every sector we serve."
          breadcrumb="Sectors"
          photo={sectorsIndexPhoto}
        />

        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector, i) => (
                <AnimateIn key={sector.name} delay={i * 0.05} className="corner-marks rounded-2xl border border-navy-100 bg-white p-9 shadow-card hover:shadow-card-hover transition-shadow flex flex-col">
                  <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-navy-900 text-blue-400">
                    <Icon name={sector.icon} size={22} strokeWidth={1.75} />
                  </span>
                  <h2 className="mt-6 font-display font-semibold text-navy-900 text-xl">{sector.name}</h2>
                  <p className="mt-3 text-sm text-slate leading-relaxed flex-1">{sector.description}</p>
                  <a
                    href={`/sectors/${sector.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Learn More
                    <ArrowRight size={14} />
                  </a>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
            <AnimateIn>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Why Sector Clients Choose Us</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Built to Handle Volume Without Losing Quality
              </h2>
              <p className="mt-5 text-slate leading-relaxed max-w-lg">
                Whether it&rsquo;s a single-unit repair or a portfolio-wide planned maintenance programme, our ten
                operational teams and dedicated job booking function mean works orders are actioned quickly and
                tracked from first contact to sign-off.
              </p>
              <div className="mt-8">
                <Button variant="primary" onClick={() => (navigate("/quote"))}>
                  Discuss a Contract
                </Button>
              </div>
            </AnimateIn>
            <AnimateIn delay={0.1} className="grid grid-cols-2 gap-4">
              {[
                { label: "Operational Teams", value: "10" },
                { label: "Completed Projects", value: "3,200+" },
                { label: "Years Experience", value: "12+" },
                { label: "Average Rating", value: "4.6+" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl bg-white border border-navy-100 p-6 text-center shadow-card">
                  <span className="font-accent font-bold text-2xl text-navy-900">{stat.value}</span>
                  <span className="block mt-1 text-xs text-slate uppercase tracking-wide font-medium">{stat.label}</span>
                </div>
              ))}
            </AnimateIn>
          </div>
        </section>

        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Ready to Discuss Your Sector&rsquo;s Requirements?
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
