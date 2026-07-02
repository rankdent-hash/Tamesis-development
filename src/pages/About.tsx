import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { PageHero } from "../components/PageHero";
import { AnimateIn } from "../components/AnimateIn";
import { PlaceholderImage } from "../components/PlaceholderImage";
import { Icon } from "../components/Icon";
import { Button } from "../components/ui/button";
import { stats, values, timeline } from "../data/content";

export function About() {
  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <main>
        <PageHero
          eyebrow="About Tamesis"
          title="London Property Maintenance, Built on Trust Since 2014"
          subtitle="From a small responsive repairs team to ten operational teams covering the whole of London, our focus has never changed: reliable, professional work delivered by people who show up."
          breadcrumb="About Us"
        />

        {/* Stats strip */}
        <section className="bg-navy-900">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-navy-700/60">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center text-center px-6 py-8 lg:py-10">
                <span className="font-accent font-bold text-2xl lg:text-3xl text-white">
                  {stat.value}
                  {stat.suffix}
                </span>
                <span className="mt-1 text-xs text-navy-100/70 font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Our story */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <AnimateIn className="corner-marks">
              <PlaceholderImage
                label="Tamesis founder &amp; site team"
                className="aspect-[4/5] lg:aspect-[5/6] rounded-2xl shadow-card-hover"
              />
            </AnimateIn>
            <AnimateIn delay={0.1}>
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">Our Story</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Founded on a Simple Idea: Do the Job Properly
              </h2>
              <div className="mt-6 space-y-5 text-slate leading-relaxed">
                <p>
                  Tamesis Development Ltd was founded in 2014 with a straightforward aim — bring a genuinely
                  professional standard of property maintenance to London, delivered by directly managed teams rather
                  than a loose network of subcontractors.
                </p>
                <p>
                  That approach has carried us from single responsive repair jobs to long-term planned maintenance
                  contracts with housing associations and local authorities, alongside commercial refurbishment and
                  construction projects across every London borough.
                </p>
                <p>
                  Today, ten operational teams and a dedicated job booking function mean we can respond quickly,
                  scale to large contracts, and still give every client — from a homeowner with a leak to a housing
                  association managing thousands of units — the same level of attention.
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Mission / Vision */}
        <section className="py-24 lg:py-32 bg-navy-50">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid md:grid-cols-2 gap-6">
            <AnimateIn className="rounded-2xl bg-white border border-navy-100 p-10 shadow-card">
              <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <Icon name="Target" size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 font-display font-bold text-navy-900 text-2xl">Our Mission</h3>
              <p className="mt-3 text-slate leading-relaxed">
                To be London&rsquo;s most reliable property maintenance and refurbishment contractor — delivering
                every job to specification, on time, with clear communication throughout.
              </p>
            </AnimateIn>
            <AnimateIn delay={0.1} className="rounded-2xl bg-white border border-navy-100 p-10 shadow-card">
              <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                <Icon name="Eye" size={22} strokeWidth={1.75} />
              </span>
              <h3 className="mt-6 font-display font-bold text-navy-900 text-2xl">Our Vision</h3>
              <p className="mt-3 text-slate leading-relaxed">
                A single trusted contracting partner for every sector we serve — known for consistency at scale,
                from individual repairs to portfolio-wide planned maintenance programmes.
              </p>
            </AnimateIn>
          </div>
        </section>

        {/* Values */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">What Drives Us</span>
              <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
                Our Core Values
              </h2>
            </AnimateIn>

            <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {values.map((value) => (
                <div key={value.name} className="corner-marks rounded-2xl border border-navy-100 bg-white p-7 shadow-card hover:shadow-card-hover transition-shadow">
                  <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-navy-900 text-blue-400">
                    <Icon name={value.icon} size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-display font-semibold text-navy-900 text-base">{value.name}</h3>
                  <p className="mt-2 text-sm text-slate leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 lg:py-32 bg-navy-950 relative overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-60" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
            <AnimateIn className="max-w-2xl">
              <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">Our Growth</span>
              <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance">
                A Decade of Growth Across London
              </h2>
            </AnimateIn>

            <div className="mt-14 relative">
              <div className="hidden lg:block absolute top-0 bottom-0 left-[7px] w-px bg-navy-700" />
              <ol className="space-y-10 lg:space-y-12">
                {timeline.map((item) => (
                  <li key={item.year} className="relative lg:pl-10 flex flex-col lg:flex-row lg:items-baseline gap-1 lg:gap-6">
                    <span className="hidden lg:block absolute left-0 top-1.5 w-4 h-4 rounded-full bg-blue-400 ring-4 ring-navy-950" />
                    <span className="font-accent font-bold text-blue-400 text-lg w-20 shrink-0">{item.year}</span>
                    <div>
                      <h3 className="font-display font-semibold text-white text-lg">{item.title}</h3>
                      <p className="mt-1 text-sm text-navy-100/70 leading-relaxed">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Health & Safety / Quality / Accreditations */}
        <section className="py-24 lg:py-32">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid sm:grid-cols-3 gap-5">
            {[
              { icon: "HardHat", title: "Health & Safety", body: "Every team works to a documented health & safety policy, with RAMS provided for planned works." },
              { icon: "BadgeCheck", title: "Quality Assurance", body: "Jobs are checked against a quality checklist and signed off before we consider a job complete." },
              { icon: "ShieldCheck", title: "Fully Insured", body: "Comprehensive public liability and employer's liability insurance across all operational teams." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-navy-100 bg-navy-50 p-8">
                <span className="flex w-12 h-12 items-center justify-center rounded-xl bg-white text-blue-600 shadow-card">
                  <Icon name={item.icon} size={22} strokeWidth={1.75} />
                </span>
                <h3 className="mt-6 font-display font-semibold text-navy-900 text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-slate leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative py-20 lg:py-28 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-3xl lg:text-4xl leading-tight text-balance max-w-2xl mx-auto">
              Want to Work With a Contractor You Can Rely On?
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button variant="primary" size="lg" onClick={() => (window.location.href = "/quote")}>
                Request a Quote
              </Button>
              <Button variant="outlineLight" size="lg" onClick={() => (window.location.href = "/contact")}>
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
