import { ArrowRight, Box, ClipboardCheck, PoundSterling, Users } from "lucide-react";
import { AnimateIn } from "./AnimateIn";
import { ServiceShowcase } from "./house3d/ServiceShowcase";

const points = [
  {
    icon: Users,
    title: "Our own engineers",
    body: "Directly employed teams — not whoever is free from a subcontractor pool.",
  },
  {
    icon: PoundSterling,
    title: "A clear price first",
    body: "We assess the work and give you a clear scope and quote before we start.",
  },
  {
    icon: ClipboardCheck,
    title: "Signed off and followed up",
    body: "Every job is quality checked, and we follow up to confirm you're satisfied.",
  },
];

export function About() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-blue-400/15 blur-[120px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <AnimateIn className="relative">
          <ServiceShowcase />
          <span className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full bg-navy-950/85 backdrop-blur px-3.5 py-2 text-[10px] font-accent uppercase tracking-widest text-blue-300 shadow-lg">
            <Box size={13} className="text-orange-400" /> Live 3D · pick a service below
          </span>
        </AnimateIn>

        <AnimateIn delay={0.1}>
          <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> About Ninja Fix
          </span>
          <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
            Built on Quality. <span className="text-orange-600">Trusted Across London.</span>
          </h2>

          <div className="mt-6 space-y-4 text-slate leading-relaxed">
            <p>
              Founded in 2019, Ninja Fix has become one of London&rsquo;s trusted property maintenance and refurbishment
              contractors.
            </p>
            <p>
              We deliver responsive repairs, planned maintenance and construction services for housing associations,
              local authorities, managing agents, commercial organisations and residential clients — every project
              delivered with professionalism, clear communication and attention to detail.
            </p>
          </div>

          <ul className="mt-8 space-y-3">
            {points.map((p) => (
              <li
                key={p.title}
                className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-4 shadow-card transition-transform hover:-translate-y-0.5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                  <p.icon size={20} strokeWidth={1.75} />
                </span>
                <span>
                  <span className="block font-display font-semibold text-navy-900">{p.title}</span>
                  <span className="mt-0.5 block text-sm text-slate leading-relaxed">{p.body}</span>
                </span>
              </li>
            ))}
          </ul>

          <a
            href="/about"
            className="group mt-9 inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            About Us
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </AnimateIn>
      </div>
    </section>
  );
}
