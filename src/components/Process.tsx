import { process } from "../data/content";
import { AnimateIn } from "./AnimateIn";

export function Process() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> How It Works
          </span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
            From first call to <span className="text-orange-600">signed-off job</span>
          </h2>
        </AnimateIn>

        <div className="mt-16 lg:mt-20 relative grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {/* Dashed route linking the four steps on desktop */}
          <div
            className="hidden lg:block absolute top-0 left-[12.5%] right-[12.5%] border-t-2 border-dashed border-navy-900/15"
            aria-hidden="true"
          />
          {process.map((item, i) => (
            <AnimateIn key={item.step} delay={i * 0.1} className="relative h-full">
              <div className="relative h-full rounded-3xl border border-navy-100 bg-white px-6 pb-7 pt-14 shadow-card text-center transition-transform duration-300 hover:-translate-y-1.5">
                {/* Extruded step block — sits half out of the card */}
                <span className="step-block absolute left-1/2 top-0 flex h-16 w-16 items-center justify-center rounded-2xl font-accent text-2xl font-semibold text-navy-950">
                  {item.step.padStart(2, "0")}
                </span>
                <h3 className="font-display font-semibold text-navy-900 text-lg">{item.title}</h3>
                <p className="mt-2.5 text-sm text-slate leading-relaxed">{item.description}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
