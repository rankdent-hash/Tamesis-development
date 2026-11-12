import { useRef } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { CtaPhoneLine } from "./CtaPhoneLine";
import { ToolsBackdrop } from "./scene3d/ToolsBackdrop";
import logoMark from "../assets/logo-mark.png";

const promises = ["No obligation", "Clear, fixed-price quotes", "Reply within 1 working day"];

export function FinalCta() {
  // The 3D tool orbit is centred on the emblem
  const emblemRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative isolate bg-navy-950 overflow-hidden">
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute inset-0 blueprint-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />
        <div className="absolute right-[2%] top-1/2 h-[560px] w-[560px] -translate-y-1/2 rounded-full bg-blue-500/20 blur-[130px]" />
        <div className="absolute left-[-10%] bottom-[-30%] h-[420px] w-[420px] rounded-full bg-orange-500/10 blur-[130px]" />
      </div>
      <ToolsBackdrop anchorRefs={[emblemRef]} ringScale={1.45} className="-z-10" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-x-10">
        <div className="pt-24 lg:py-32">
          <span className="inline-flex items-center gap-2 text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">
            <span className="h-1.5 w-1.5 rounded-sm bg-orange-500" /> Let&rsquo;s get it fixed
          </span>
          <h2 className="mt-4 font-display font-bold text-white text-3xl lg:text-5xl xl:text-6xl leading-[1.08] text-balance max-w-2xl">
            Looking for a Reliable <span className="text-orange-500">Property Maintenance Partner?</span>
          </h2>
          <p className="mt-6 text-navy-100/75 max-w-xl leading-relaxed">
            Whether you require responsive repairs, planned maintenance, refurbishment or construction services, our
            experienced team is ready to help.
          </p>

          <div className="mt-9 flex flex-wrap gap-4">
            <a
              href="/quote"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-sm font-bold shadow-[0_10px_30px_-8px_rgba(255,116,33,0.65)] hover:bg-orange-400 hover:-translate-y-0.5 transition-all"
            >
              Get a Free Quote
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/contact"
              className="rounded-full border border-white/25 bg-white/5 text-white px-9 py-4 text-sm font-bold hover:bg-white/10 transition-all"
            >
              Contact Us
            </a>
          </div>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2.5">
            {promises.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-navy-100/75 font-medium">
                <CheckCircle2 size={16} className="text-blue-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <CtaPhoneLine />
        </div>

        <div className="flex justify-center py-32 sm:py-40 lg:py-0" aria-hidden="true">
          <div ref={emblemRef} className="relative h-36 w-32 sm:h-52 sm:w-48">
            <div className="absolute -inset-10 rounded-full bg-blue-400/25 blur-3xl" />
            <img
              src={logoMark}
              alt=""
              className="emblem-float relative h-full w-full object-contain drop-shadow-[0_0_28px_rgba(49,204,232,0.55)]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
