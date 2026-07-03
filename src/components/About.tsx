import { Illustration } from "./Illustration";
import { AnimateIn } from "./AnimateIn";

export function About() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <AnimateIn className="corner-marks">
          <Illustration
            icon="HardHat"
            label="Tamesis engineers & office"
            className="aspect-[4/5] lg:aspect-[5/6] rounded-2xl shadow-card-hover"
          />
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <span className="text-xs font-accent uppercase tracking-widest text-blue-600 font-semibold">About Tamesis</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Built on Quality. Trusted Across London.
          </h2>

          <div className="mt-6 space-y-5 text-slate leading-relaxed">
            <p>
              Founded in 2014, Tamesis Development Ltd has become one of London&rsquo;s trusted property maintenance and
              refurbishment contractors.
            </p>
            <p>
              We deliver responsive repairs, planned maintenance and construction services for housing associations, local
              authorities, managing agents, commercial organisations and residential clients.
            </p>
            <p>Every project is delivered with professionalism, clear communication and attention to detail.</p>
          </div>

          <a
            href="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            About Us
          </a>
        </AnimateIn>
      </div>
    </section>
  );
}
