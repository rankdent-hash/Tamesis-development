import { Phone, Star, ShieldCheck, HardHat } from "lucide-react";
import { HeroQuoteForm } from "./HeroQuoteForm";
import { unsplashUrl } from "../data/photos";
import { company } from "../data/content";

export function ConversionHero({
  eyebrow,
  title,
  subtitle,
  photo,
  urgent = false,
  presetService,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  photo: string;
  urgent?: boolean;
  presetService?: string;
}) {
  const telHref = `tel:${company.phoneJobBooking.replace(/\s/g, "")}`;

  return (
    <section className="relative pt-24 sm:pt-28 lg:pt-32 pb-14 sm:pb-16 lg:pb-20 overflow-hidden bg-navy-950">
      <div className="absolute inset-0 bg-navy-900">
        <img src={unsplashUrl(photo)} alt="" className="absolute inset-0 w-full h-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/93 via-navy-950/85 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/88 via-navy-950/45 to-navy-950/70" />
      </div>

      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-8">
        {/* Trust bar — above everything, per conversion research */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-6 text-[13px] font-medium text-navy-100/85">
          <span className="flex items-center gap-1.5">
            <Star size={14} className="text-orange-400 fill-orange-400" /> 4.6★ from 535+ reviews
          </span>
          <span className="flex items-center gap-1.5">
            <HardHat size={14} className="text-orange-400" /> Directly employed engineers
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-orange-400" /> Fully insured
          </span>
        </div>

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start">
          <div>
            {urgent && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-400/40 text-red-300 px-3 py-1 text-xs font-bold uppercase tracking-wide mb-4">
                24/7 Emergency Response
              </span>
            )}
            <span className="text-xs font-accent uppercase tracking-widest text-blue-400 font-semibold">{eyebrow}</span>
            <h1 className="mt-3 font-display font-extrabold text-white text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.1] text-balance">
              {title}
            </h1>
            <p className="mt-5 text-base sm:text-lg text-navy-100/80 max-w-xl leading-relaxed">{subtitle}</p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href={telHref}
                className={
                  urgent
                    ? "inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-8 py-4 text-base font-bold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
                    : "inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-7 py-3.5 text-sm font-bold shadow-card hover:bg-orange-400 hover:shadow-card-hover transition-all"
                }
              >
                <Phone size={urgent ? 20 : 16} /> Call Now — {company.phoneJobBooking}
              </a>
              {!urgent && (
                <a
                  href="#quote-form"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-7 py-3.5 text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Get a Free Quote
                </a>
              )}
            </div>
            {urgent && (
              <p className="mt-4 text-sm text-navy-100/60">
                Prefer not to call? <a href="#quote-form" className="text-orange-400 font-semibold hover:underline">Send us the details</a> and we'll call you back.
              </p>
            )}
          </div>

          <div id="quote-form" className="flex justify-center lg:justify-end scroll-mt-28">
            <HeroQuoteForm compact presetService={presetService} />
          </div>
        </div>
      </div>
    </section>
  );
}
