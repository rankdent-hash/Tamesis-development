import { ArrowRight, ClipboardCheck, PoundSterling, Users } from "lucide-react";
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
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        <AnimateIn className="grid lg:grid-cols-2 gap-6 lg:gap-16 lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-700 font-semibold">
              <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> About Ninja Fix
            </span>
            <h2 className="mt-4 font-display font-bold text-navy-900 text-3xl lg:text-5xl leading-[1.1] text-balance">
              Built on Quality. <span className="text-orange-600">Trusted Across London.</span>
            </h2>
          </div>
          <div className="space-y-4 text-slate leading-relaxed">
            <p>
              Founded in 2019, Ninja Fix has become one of London&rsquo;s trusted property maintenance and refurbishment
              contractors, delivering responsive repairs, planned maintenance and construction services for housing
              associations, local authorities, managing agents, commercial organisations and residential clients.
            </p>
            <p className="font-semibold text-navy-900">Take the tour below to see what we do in every part of a home.</p>
          </div>
        </AnimateIn>

        <AnimateIn delay={0.1} className="mt-12">
          <ServiceShowcase />
        </AnimateIn>

        <ul className="mt-8 grid md:grid-cols-3 gap-4">
          {points.map((p) => (
            <li
              key={p.title}
              className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-5 shadow-card transition-transform hover:-translate-y-0.5"
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

        <div className="mt-10 text-center">
          <a
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
          >
            About Us
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
