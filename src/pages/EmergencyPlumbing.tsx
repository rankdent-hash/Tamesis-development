import { Phone, CheckCircle2, Clock, Droplets, AlertTriangle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "How fast can you get to me?",
    a: "For a genuine emergency — active flooding, no heating in cold weather, a burst pipe — we prioritise your job and aim to have an engineer on the way the same day, often within hours. Call us directly for the fastest response.",
  },
  {
    q: "What counts as an emergency?",
    a: "Water you can't stop, no heating or hot water in cold weather, a blocked drain that's backing up into the property, or a leak causing active damage. If you're not sure, call us — we'd rather confirm it can wait than have you sit with a worsening problem.",
  },
  {
    q: "Do you charge more for emergency callouts?",
    a: "We'll always give you a clear price before any work begins — no surprises. Call us and we'll be straightforward with you about cost before anyone gets in a van.",
  },
  {
    q: "Are your engineers directly employed?",
    a: "Yes — every engineer who attends is directly employed by Tamesis Development Ltd, not a subcontractor found on the day. That's part of why our response times stay consistent.",
  },
];

export function EmergencyPlumbing() {
  const path = "/services/emergency-plumbing";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Emergency Plumber London — Fast Response, Any Time"
        description="Burst pipe, flooding, no heating? Our directly employed emergency plumbers respond fast across London. Call now or request a callback."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Emergency Plumbing", path },
          ]),
          faqJsonLd(faqs),
          serviceJsonLd("Emergency Plumbing", "Fast-response emergency plumbing across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Emergency Plumbing"
          title="Burst Pipe? Flooding? We're On Our Way."
          subtitle="Directly employed emergency plumbers, dispatched fast across every London borough — day or night. Call now and speak to a real person, not a call centre."
          photo="photo-1749532125405-70950966b0e5"
          urgent
          presetService="Plumbing and Drainage"
        />

        {/* What we handle as emergencies */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              If It Can't Wait, Neither Do We
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Droplets, title: "Burst or leaking pipes", body: "Water you can't stop with the isolation valve or stopcock." },
                { icon: AlertTriangle, title: "No heating or hot water", body: "Especially urgent in cold weather, for elderly or vulnerable residents." },
                { icon: Clock, title: "Backed-up drains", body: "Water or sewage coming back up through a fixture." },
                { icon: CheckCircle2, title: "Hidden leaks causing damage", body: "Damp patches, ceiling stains, or a rapidly rising water bill." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                    <item.icon size={20} strokeWidth={1.75} />
                  </span>
                  <div>
                    <h3 className="font-display font-semibold text-navy-900 text-sm">{item.title}</h3>
                    <p className="mt-1 text-sm text-slate leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-sm text-slate">
              Not sure if it's urgent? Read our guide:{" "}
              <a href="/blog/signs-you-need-an-emergency-plumber-in-london" className="text-orange-600 font-semibold hover:underline">
                5 Signs You Need an Emergency Plumber
              </a>
              . Or just call — we'd rather you ask than guess.
            </p>
          </div>
        </section>

        {/* Simple process */}
        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center">What Happens When You Call</h2>
            <div className="mt-10 grid sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "You call us", body: "Speak to a real person, describe the problem, get honest advice." },
                { step: "2", title: "We dispatch fast", body: "Our nearest available directly employed engineer is sent to you." },
                { step: "3", title: "Fixed, with a clear price", body: "You'll know the cost before any work begins — no surprises." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <span className="inline-flex w-10 h-10 items-center justify-center rounded-full bg-orange-500 text-navy-950 font-display font-bold">
                    {item.step}
                  </span>
                  <h3 className="mt-3 font-display font-semibold text-navy-900">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-10">Common Questions</h2>
            <Faq items={faqs} />
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Water Won't Wait — Neither Should You
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
