import { Phone, Flame, ShieldCheck, Thermometer, Wrench, Droplets, ClipboardCheck } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { unsplashUrl } from "../data/photos";
import { company } from "../data/content";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

// GAS_SAFE_NUMBER — set this to the real registration number when available.
// Left empty the page still states, truthfully, that we are Gas Safe registered;
// it just omits the number rather than rendering a placeholder. Filling this in
// is a one-line change and needs no other edits.
const GAS_SAFE_NUMBER = "";

const faqs = [
  {
    q: "I have hot water but no heating — what does that mean?",
    a: "It usually points to the diverter valve, the pump, or a thermostat fault rather than the boiler itself. The boiler is still firing for hot water, so the heat simply isn't reaching your radiators. It is one of the more common faults we see and usually a same-visit fix.",
  },
  {
    q: "I have heating but no hot water — is that different?",
    a: "Yes, and it points somewhere else. On a combi it is often the diverter valve stuck the other way or a failed hot water thermistor. On a system boiler with a cylinder it is more likely the cylinder thermostat or a motorised valve. We diagnose which before quoting.",
  },
  {
    q: "My boiler pressure keeps dropping — should I worry?",
    a: "Repressurising once or twice a year is normal. Doing it weekly is not — it means water is escaping somewhere, either from a small system leak or a failed expansion vessel or pressure relief valve. Worth investigating before it damages anything.",
  },
  {
    q: "Why is my boiler making banging or kettling noises?",
    a: "Kettling is usually limescale or sludge on the heat exchanger, which London's hard water accelerates. Banging can be trapped air or the pump. Both are fixable, and both get worse and more expensive if left.",
  },
  {
    q: "Are your engineers Gas Safe registered?",
    a: `Yes. All gas work is carried out by Gas Safe registered engineers${
      GAS_SAFE_NUMBER ? ` — registration number ${GAS_SAFE_NUMBER}` : ""
    }. By law only Gas Safe registered engineers may install, service or repair gas appliances, and you are welcome to ask to see the ID card on arrival.`,
  },
  {
    q: "Do you give a fixed price before starting?",
    a: "Always. We diagnose the fault, confirm the cost with you, and only then start work. No hourly meter running while we investigate.",
  },
  {
    q: "Do you cover landlord gas safety checks?",
    a: "Yes. We carry out annual gas safety checks and issue the CP12 certificate, alongside boiler servicing for managed portfolios. Landlords are legally required to have every gas appliance checked every 12 months by a Gas Safe registered engineer.",
  },
  {
    q: "Do you replace radiators, or only repair them?",
    a: "Both. Cold-at-the-bottom radiators usually need a power flush rather than replacing, so we will tell you honestly which one you actually need before selling you the bigger job.",
  },
];

const symptoms = [
  { icon: Thermometer, title: "No heating or hot water", body: "The most common winter call-out. We diagnose whether it is the boiler, the pump, a valve or the thermostat." },
  { icon: Droplets, title: "Boiler pressure dropping", body: "Repeated repressurising means a leak, a failed expansion vessel, or a faulty pressure relief valve." },
  { icon: Flame, title: "Boiler locked out or error code", body: "Lockouts have a cause. We read the fault, fix the underlying issue, and reset it properly." },
  { icon: Wrench, title: "Radiators cold at the bottom", body: "Sludge build-up restricting flow. Usually resolved with a power flush rather than new radiators." },
  { icon: ShieldCheck, title: "Banging, kettling or whistling", body: "Limescale on the heat exchanger or trapped air. London's hard water makes this common." },
  { icon: ClipboardCheck, title: "Annual service due", body: "Servicing keeps the boiler efficient, protects the manufacturer warranty, and catches faults early." },
];

export function BoilerHeatingRepair() {
  const path = "/services/boiler-heating-repair";
  const telHref = `tel:${company.phoneJobBooking.replace(/\s/g, "")}`;

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Boiler Repair & Heating Engineers London — Gas Safe"
        description="No heating or hot water? Gas Safe registered engineers repair boilers, radiators and central heating across London. Fixed price before we start. £25 off your call-out."
        path={path}
        image={unsplashUrl("photo-1621983209352-c2880ac507b2", "auto=format&fit=crop&q=80&w=1200&h=630")}
        jsonLd={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Boiler & Heating Repair", path },
          ]),
          faqJsonLd(faqs),
          serviceJsonLd(
            "Boiler Repair, Servicing & Central Heating Engineers",
            "Gas Safe registered boiler repair, annual servicing, radiator repairs and power flushing across London.",
            path
          ),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Boiler & Central Heating"
          title="No Heat or Hot Water? Gas Safe Engineers, Same Day."
          subtitle="Boiler breakdowns, radiator faults, power flushing and annual servicing — diagnosed properly and fixed at a price agreed before we start. Directly employed Gas Safe registered engineers across every London borough."
          photo="photo-1621983209352-c2880ac507b2"
          urgent
          presetService="Plumbing and Drainage"
        />

        {/* Gas Safe is the single strongest trust signal on a boiler page — it sits high, directly under the hero. */}
        <section className="py-10 border-b border-navy-100 bg-white">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 rounded-2xl border border-navy-100 bg-navy-50/60 p-6">
              <span className="flex w-14 h-14 shrink-0 items-center justify-center rounded-xl bg-navy-900 text-amber-400">
                <ShieldCheck size={26} strokeWidth={1.75} />
              </span>
              <div className="text-center sm:text-left">
                <h2 className="font-display font-bold text-navy-900 text-lg">
                  Gas Safe registered{GAS_SAFE_NUMBER ? ` — number ${GAS_SAFE_NUMBER}` : ""}
                </h2>
                <p className="mt-1.5 text-sm text-slate leading-relaxed">
                  Only Gas Safe registered engineers may legally install, service or repair gas appliances in the UK. Every
                  engineer we send carries their ID card, and you are welcome to check it on arrival or verify us on the Gas
                  Safe Register.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-5xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              What We Get Called Out To
            </h2>
            <p className="mt-4 text-center text-slate max-w-2xl mx-auto leading-relaxed">
              Most heating faults fall into a handful of patterns. We diagnose which one you have before quoting, rather
              than guessing at the cost over the phone.
            </p>
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {symptoms.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card"
                >
                  <span className="flex w-11 h-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <item.icon size={20} strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-display font-semibold text-navy-900 text-sm">{item.title}</h3>
                  <p className="mt-1.5 text-sm text-slate leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20 bg-white border-y border-navy-100">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Boiler, Radiator & Central Heating Work
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-4">
              {[
                "Boiler breakdown diagnosis and repair",
                "Combi, system and conventional boilers",
                "Annual boiler servicing",
                "Landlord gas safety checks and CP12 certificates",
                "Central heating power flushing",
                "Radiator repairs, replacement and rebalancing",
                "Thermostat and heating control faults",
                "Motorised and diverter valve replacement",
                "Pump replacement and circulation faults",
                "Hot water cylinder and immersion repairs",
                "Expansion vessel and pressure faults",
                "Frozen or blocked condensate pipes",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3 py-2 border-b border-navy-100/70">
                  <Flame size={16} className="mt-0.5 shrink-0 text-orange-500" strokeWidth={2} />
                  <span className="text-sm text-slate leading-relaxed">{line}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-3xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center mb-4">
              Heating Problems, Explained
            </h2>
            <p className="text-center text-slate mb-10 leading-relaxed">
              The questions we get asked most often on the phone, answered honestly.
            </p>
            <Faq items={faqs} />
          </div>
        </section>

        <section className="relative py-16 lg:py-20 bg-navy-950 overflow-hidden">
          <div className="absolute inset-0 blueprint-grid opacity-50" />
          <div className="relative mx-auto max-w-2xl px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">
              Get Your Heating Back On Today
            </h2>
            <p className="mt-4 text-navy-100/80 leading-relaxed">
              Speak to our booking team and we will get a Gas Safe engineer to you. £25 off your call-out charge.
            </p>
            <a
              href={telHref}
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
