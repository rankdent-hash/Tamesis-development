import { Phone, DoorClosed } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { unsplashUrl } from "../data/photos";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "My UPVC door won't lock or is hard to lock — what's wrong?",
    a: "Usually the door has dropped slightly on its hinges, misaligning the locking points with the keep on the frame. This is a common, fixable adjustment rather than a sign the door needs replacing.",
  },
  {
    q: "Why has my UPVC door started dragging on the frame or floor?",
    a: "Almost always the hinges need adjusting — UPVC doors settle slightly over time, especially in the first year or two, and the hinges are designed to be adjusted rather than the door replaced.",
  },
  {
    q: "Can you adjust the door without replacing any parts?",
    a: "In most cases yes — hinge and lock adjustment is a straightforward job using the door's existing adjustable hinges. We'll only recommend replacing parts if they're genuinely worn or damaged.",
  },
  {
    q: "How long does a UPVC door adjustment take?",
    a: "Usually well within our one-hour minimum call-out — most adjustments are quick once we've identified exactly where the door has moved.",
  },
];

export function UpvcDoorAdjustment() {
  const path = "/services/upvc-door-adjustment";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="UPVC Door Adjustment & Repair London"
        description="UPVC door dragging, sticking, or hard to lock? Directly employed engineers adjust and repair UPVC doors across London, fixed pricing."
        path={path}
        image={unsplashUrl("photo-1561297331-a9c00b9c2c44", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "UPVC Door Adjustment", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("UPVC Door Adjustment & Repair", "UPVC door adjustment and repair across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="UPVC Doors"
          title="UPVC Door Dragging, Sticking, or Won't Lock?"
          subtitle="Most UPVC door problems are a quick hinge and lock adjustment, not a replacement — directly employed engineers, fixed pricing confirmed before we start."
          photo="photo-1561297331-a9c00b9c2c44"
          presetService="Carpentry and Joinery"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Common UPVC Door Problems We Fix
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { title: "Door drags on the frame or floor", body: "Usually the hinges have dropped slightly — an adjustable fix, not a replacement." },
                { title: "Hard to lock, or the key sticks", body: "The locking points are often misaligned with the keep, correctable with hinge adjustment." },
                { title: "Draughty around the edges", body: "Often the door isn't sitting flush in the frame anymore — adjustment usually resolves it." },
                { title: "Handle feels loose or stiff", body: "Can be the handle mechanism itself or a symptom of the door being slightly out of alignment." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <DoorClosed size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-navy-900 text-sm">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate">
              Wooden door instead? See our{" "}
              <a href="/tamesis-carpenter" className="text-orange-600 font-semibold hover:underline">general carpentry and door repair service</a>.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Why Adjustment Before Replacement
            </h2>
            <p className="mt-4 text-center text-slate leading-relaxed">
              UPVC doors are built with adjustable hinges specifically because doors settle slightly over time — through
              temperature changes, general use, and the property itself settling. In the vast majority of cases, a dragging or
              hard-to-lock UPVC door needs a proper adjustment, not a replacement. We check the hinges, the locking mechanism, and
              how the door sits in the frame before recommending anything more involved.
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-10">Common Questions</h2>
            <Faq items={faqs} />
          </div>
        </section>

        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Get Your Door Adjusted Properly
            </h2>
            <a
              href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
              className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all"
            >
              <Phone size={20} /> Call Now — {company.phoneJobBooking}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
