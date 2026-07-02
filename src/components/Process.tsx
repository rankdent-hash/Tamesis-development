import { process } from "../data/content";

export function Process() {
  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-teal-600 font-semibold">How It Works</span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-4xl leading-tight text-balance">
            Our Process
          </h2>
        </div>

        <div className="mt-16 relative grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          <div className="hidden lg:block absolute top-6 left-[12.5%] right-[12.5%] h-px bg-navy-100" />
          {process.map((item) => (
            <div key={item.step} className="relative text-center flex flex-col items-center">
              <span className="relative z-10 flex w-12 h-12 items-center justify-center rounded-full bg-navy-900 text-teal-400 font-mono font-semibold text-lg">
                {item.step}
              </span>
              <h3 className="mt-5 font-display font-semibold text-navy-900 text-lg">{item.title}</h3>
              <p className="mt-2 text-sm text-slate leading-relaxed max-w-[220px]">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
