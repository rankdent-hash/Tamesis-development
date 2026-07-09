import { Phone, Droplets, RefreshCw, Wrench, CheckCircle2 } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  {
    q: "My toilet won't stop running — is that urgent?",
    a: "It's not dangerous, but it can waste a significant amount of water and money the longer it's left. Usually a quick fix — a faulty flapper valve or float is the most common cause.",
  },
  {
    q: "My toilet won't flush at all — what's wrong?",
    a: "Often a broken flush handle, snapped chain, or low water level in the tank. We can diagnose and fix it in a single visit in most cases.",
  },
  {
    q: "Can you fix a blocked toilet?",
    a: "Yes — if a plunger hasn't cleared it, we can. Persistent or recurring blockages sometimes point to a bigger drainage issue, which we'll identify honestly rather than just clearing the symptom.",
  },
  {
    q: "Do you provide a fixed price before starting?",
    a: "Always. We'll assess the issue and confirm the cost before any work begins.",
  },
];

export function ToiletRepairs() {
  const path = "/services/toilet-repairs";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Toilet Repair London — Running, Blocked or Won't Flush"
        description="Running, blocked, or won't flush? Directly employed engineers fix toilet problems fast, fixed price, across London."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Toilet Repairs", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Toilet Repairs", "Toilet repairs across London — running, blocked, or won't flush.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Toilet Repairs"
          title="Toilet Playing Up? We'll Sort It Fast."
          subtitle="Running, won't flush, or blocked — directly employed engineers, usually fixed in a single visit, across every London borough."
          photo="photo-1749532125405-70950966b0e5"
          presetService="Plumbing and Drainage"
        />

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Whatever the Toilet Problem, We've Seen It
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: RefreshCw, title: "Running toilet", body: "Faulty flapper or float valve, usually a quick, inexpensive fix." },
                { icon: Wrench, title: "Won't flush", body: "Broken handle, snapped chain, or low tank water level — diagnosed properly." },
                { icon: Droplets, title: "Blocked toilet", body: "Cleared professionally, with an honest answer if it's a bigger issue." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "You'll know the cost before we start — no surprises." },
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
              Get Your Toilet Fixed Today
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
