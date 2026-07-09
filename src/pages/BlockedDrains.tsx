import { Phone, CheckCircle2, Camera, Wrench, ShieldCheck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "How quickly can you unblock a drain?",
    a: "Most blocked drains are cleared same-day. If the drain is actively backing up into the property, tell us when you call and we'll treat it as urgent.",
  },
  {
    q: "Will you tell me why it keeps blocking?",
    a: "Yes. If a drain has blocked more than once, it usually has an underlying cause — root ingress, a misaligned pipe, a partial collapse. We'll be straightforward about whether a simple clearance will do, or whether it's worth investigating properly with a camera survey.",
  },
  {
    q: "Do you provide a fixed price before starting?",
    a: "Always. We'll assess the blockage and confirm the cost before any work begins.",
  },
  {
    q: "What if the blockage turns out to be more serious?",
    a: "We'll tell you honestly, show you what we've found, and give you a clear quote for the actual fix — not just keep re-clearing the same recurring problem.",
  },
];

export function BlockedDrains() {
  const path = "/services/blocked-drains";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Blocked Drain Unblocking London — Same-Day Service"
        description="Blocked or backed-up drain? Our directly employed engineers clear it fast and tell you honestly if there's an underlying cause. Fixed price, same-day service across London."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blocked Drains", path },
          ]),
          faqJsonLd(faqs),
          serviceJsonLd("Drain Unblocking", "Same-day blocked drain clearance across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Drain Unblocking"
          title="Blocked Drain? Cleared Fast, Same Day."
          subtitle="Directly employed engineers, fixed-price quote before we start, and an honest answer if there's a bigger problem behind the blockage. Serving every London borough."
          photo="photo-1521207418485-99c705420785"
          presetService="Plumbing and Drainage"
        />

        {/* What's included */}
        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Blocked Sinks, Toilets and Drains — Sorted Properly
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Wrench, title: "Standard clearance", body: "Fat, hair and everyday blockages cleared quickly with the right equipment." },
                { icon: Camera, title: "CCTV drain surveys", body: "For recurring blockages, we can see exactly what's happening inside the pipe." },
                { icon: ShieldCheck, title: "Root cause fixes", body: "Root ingress, misaligned joints or partial collapse — diagnosed and fixed, not just cleared." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "You'll know the cost before we start — no surprise call-out add-ons." },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 rounded-2xl border border-navy-100 bg-white p-6 shadow-card">
                  <span className="flex w-11 h-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
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
              Drain kept blocking before? Read{" "}
              <a href="/blog/why-drains-keep-blocking-and-how-to-actually-stop-it" className="text-orange-600 font-semibold hover:underline">
                why drains keep blocking and how to actually stop it
              </a>
              .
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-navy-50">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center">How It Works</h2>
            <div className="mt-10 grid sm:grid-cols-3 gap-6">
              {[
                { step: "1", title: "Book your slot", body: "Call or request a callback — same-day appointments available." },
                { step: "2", title: "We assess and quote", body: "Clear, fixed price confirmed before any work begins." },
                { step: "3", title: "Cleared and explained", body: "Drain running freely, and a straight answer if there's more going on." },
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
              Get Your Drain Cleared Today
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
