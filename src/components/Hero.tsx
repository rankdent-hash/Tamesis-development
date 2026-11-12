import { useRef } from "react";
import { ArrowRight, CheckCircle2, Phone, Star } from "lucide-react";
import { motion } from "framer-motion";
import { HeroQuoteForm } from "./HeroQuoteForm";
import { ContactLink } from "./ContactLink";
import { ToolsBackdrop } from "./scene3d/ToolsBackdrop";
import { company } from "../data/content";

const badges = ["Directly employed engineers", "Fixed-price quotes", "Fully insured", "London-wide coverage"];

export function Hero() {
  // The 3D tool orbit wraps whichever of these is on screen: the quote form
  // on desktop; on phones and tablets (where the form is full-width and
  // there's nothing to orbit) it gets its own stage around the rating.
  const formRef = useRef<HTMLDivElement>(null);
  const mobileAnchorRef = useRef<HTMLAnchorElement>(null);

  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pt-32 sm:pt-36 lg:pt-44 pb-28 sm:pb-32 lg:pb-40">
      {/* Ambient light — cyan from the logo, a warm orange counter-glow */}
      <div className="absolute inset-0 -z-20" aria-hidden="true">
        <div className="absolute -top-48 right-[-12%] h-[760px] w-[760px] rounded-full bg-blue-500/20 blur-[150px]" />
        <div className="absolute top-[30%] left-[-14%] h-[520px] w-[520px] rounded-full bg-orange-500/[0.09] blur-[150px]" />
        <div className="absolute inset-0 blueprint-grid opacity-25 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <ToolsBackdrop anchorRefs={[mobileAnchorRef, formRef]} floor className="-z-10" />

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8 grid lg:grid-cols-2 gap-0 lg:gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2.5 rounded-full border border-blue-400/30 bg-navy-900/70 backdrop-blur px-4 py-1.5 text-[11px] sm:text-xs font-accent uppercase tracking-widest text-blue-300 mb-6 lg:mb-8">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            Property Maintenance &amp; Refurbishment · Since 2019
          </div>

          <h1 className="font-display font-extrabold text-white text-[2.1rem] sm:text-5xl lg:text-[3.1rem] xl:text-[3.5rem] leading-[1.06] text-balance">
            London Property Repairs &amp; Maintenance —{" "}
            <span className="text-orange-500">Done Right, First Time</span>
          </h1>

          <p className="mt-5 lg:mt-6 text-base lg:text-[17px] text-navy-100/80 max-w-xl leading-relaxed">
            Fast response, fixed-price quotes and directly employed engineers — not subcontractors — trusted since 2019
            by housing associations, local authorities, landlords and homeowners across London.
          </p>

          <div className="mt-8 lg:mt-10 flex flex-row flex-nowrap items-center gap-3 sm:gap-4">
            <a
              href="/quote"
              className="group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 text-center rounded-full bg-orange-500 text-navy-950 px-5 sm:px-8 py-3.5 sm:py-4 text-sm font-bold shadow-[0_10px_30px_-8px_rgba(255,116,33,0.65)] hover:bg-orange-400 hover:-translate-y-0.5 transition-all"
            >
              Get a Free Quote
              <ArrowRight size={16} className="hidden sm:block transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/report-repair"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center text-center rounded-full border border-white/25 bg-white/5 backdrop-blur text-white px-5 sm:px-8 py-3.5 sm:py-4 text-sm font-bold hover:bg-white/10 hover:border-white/40 transition-all"
            >
              Book a Repair
            </a>
            {/* Desktop/tablet only — phones already get the sticky call bar
                (StickyMobileCall) fixed to the bottom of the screen. */}
            <ContactLink
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              mode="call"
              label="Job Booking"
              phoneNumber={company.phoneJobBooking}
              ariaLabel={`Call Job Booking on ${company.phoneJobBooking}`}
              className="hidden md:inline-flex items-center justify-center w-[52px] h-[52px] rounded-full border border-white/25 bg-white/5 backdrop-blur text-white hover:bg-white/10 transition-all shrink-0"
            >
              <Phone size={20} strokeWidth={2} />
            </ContactLink>
          </div>

          <div className="mt-8 lg:mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href="/reviews"
              className="hidden lg:inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur px-4 py-3 hover:border-white/25 transition-colors"
            >
              <span className="font-accent text-2xl font-semibold text-white leading-none">4.6</span>
              <span className="flex flex-col gap-1">
                <span className="flex text-orange-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
                <span className="text-xs text-navy-100/70 leading-none">from 535+ Google reviews</span>
              </span>
            </a>

            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {badges.map((badge) => (
                <li key={badge} className="flex items-center gap-2 text-[13px] text-navy-100/75 font-medium">
                  <CheckCircle2 size={15} className="text-blue-400 shrink-0" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>

          {/* Phones/tablets: the hexagon and orbiting tools frame the rating */}
          <div className="lg:hidden flex justify-center pt-[132px] pb-[104px]">
            <a ref={mobileAnchorRef} href="/reviews" className="flex w-[170px] flex-col items-center text-center">
              <span className="font-accent text-[2.6rem] font-semibold text-white leading-none">4.6</span>
              <span className="mt-2.5 flex text-orange-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </span>
              <span className="mt-2 text-[11px] text-navy-100/75 leading-tight">535+ Google reviews</span>
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
        >
          <div ref={formRef} className="relative w-full max-w-md lg:max-w-[23.5rem]">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-blue-400/25 blur-3xl" aria-hidden="true" />
            <HeroQuoteForm />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
