import { Phone, Lightbulb, Plug, CheckCircle2, ArrowRight } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConversionHero } from "../components/ConversionHero";
import { Faq } from "../components/Faq";
import { Seo } from "../components/Seo";
import { company } from "../data/content";
import { unsplashUrl, handymanSubPhotos } from "../data/photos";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "../lib/seo";

const faqs = [
  { q: "What counts as a \"minor\" electrical job?", a: "Small, straightforward tasks like replacing a light fitting, a socket, or a switch — carried out safely by trained engineers. Anything involving the consumer unit, new circuits, or a full rewire goes to our dedicated electrical team." },
  { q: "Is this work certified?", a: "Straightforward like-for-like replacements are carried out safely as standard. If your job needs formal certification (for a landlord EICR, for instance), we'll advise and route it to our qualified electrical team." },
  { q: "Can I bundle this with other small jobs?", a: "Yes — small electrical tasks are commonly combined with other handyman jobs in a single visit." },
  { q: "Do you provide a fixed price before starting?", a: "Always. We'll confirm the cost before any work begins." },
];

export function MinorElectricalRepairs() {
  const path = "/services/minor-electrical-repairs";
  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Minor Electrical Jobs London — Light Fittings, Sockets & More"
        description="Small electrical jobs — light fittings, sockets, switches — bundled into a handyman visit or handled on their own. Directly employed engineers."
        path={path}
        jsonLd={[
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Minor Electrical Repairs", path }]),
          faqJsonLd(faqs),
          serviceJsonLd("Minor Electrical Repairs", "Small electrical repair jobs across London.", path),
        ]}
      />
      <Header />
      <main>
        <ConversionHero
          eyebrow="Handyman — Minor Electrical"
          title="Small Electrical Jobs, Done Safely."
          subtitle="Light fittings, sockets, and switches — handled by trained engineers, on their own or bundled with your other small jobs."
          photo={handymanSubPhotos["minor-electrical-repairs"]}
          presetService="Handyman Services"
        />

        <div className="mx-auto max-w-4xl px-6 lg:px-8 -mt-8 relative">
          <figure className="corner-marks overflow-hidden rounded-2xl shadow-card-hover">
            <img
              src={unsplashUrl(handymanSubPhotos["minor-electrical-repairs"])}
              alt="Handyman safely replacing a light fitting or socket in a London home"
              title="Minor Electrical Repairs — Tamesis Development Ltd"
              className="w-full aspect-[16/9] object-cover"
              loading="lazy"
            />
            <figcaption className="px-5 py-3 bg-white text-xs text-slate-light leading-relaxed">
              Light fittings, sockets and switches replaced safely by our trained handyman team.
            </figcaption>
          </figure>
        </div>

        <section className="py-16 lg:py-20">
          <div className="mx-auto max-w-4xl px-6 lg:px-8">
            <h2 className="font-display font-bold text-navy-900 text-2xl sm:text-3xl text-center text-balance">
              Small Jobs, Handled Safely
            </h2>
            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {[
                { icon: Lightbulb, title: "Light fittings", body: "Replacements and straightforward installations." },
                { icon: Plug, title: "Sockets & switches", body: "Like-for-like replacements, done properly." },
                { icon: ArrowRight, title: "Bundle with other jobs", body: "Works well alongside other handyman tasks in one visit." },
                { icon: CheckCircle2, title: "Fixed price, every time", body: "You'll know the cost before we start." },
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
              Need a full rewire, fault finding, or an EICR? Visit our{" "}
              <a href="/services/electrical" className="text-orange-600 font-semibold hover:underline">full electrical services</a> page instead.
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
            <h2 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight text-balance">Get Your Small Electrical Job Sorted</h2>
            <a href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`} className="mt-7 inline-flex items-center gap-2.5 rounded-full bg-orange-500 text-navy-950 px-9 py-4 text-base font-bold shadow-card hover:bg-orange-400 transition-all">
              <Phone size={20} /> Call Now — {company.phoneJobBooking}
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
