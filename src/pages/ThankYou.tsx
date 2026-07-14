import { useEffect } from "react";
import { CheckCircle2, Phone } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Seo } from "../components/Seo";
import { company } from "../data/content";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Google Ads conversion — fires once, right after any form on the site is
// successfully submitted (quote, contact, report a repair, emergency
// callout, careers), since every one of them redirects here on success.
// Conversion action: "Contact" — AW-18308624211 / 8DUwCOGMs9AcENPenZpE
const GOOGLE_ADS_CONVERSION_SEND_TO = "AW-18308624211/8DUwCOGMs9AcENPenZpE";

export function ThankYou() {
  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: GOOGLE_ADS_CONVERSION_SEND_TO,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-paper">
      <Seo
        title="Thank You"
        description="Thank you for your submission — we'll be in touch shortly."
        path="/thank-you"
        noindex
      />
      <Header />
      <main>
        <section className="pt-40 pb-24 lg:pt-52 lg:pb-32">
          <div className="mx-auto max-w-[700px] px-6 lg:px-8 text-center">
            <span className="inline-flex w-16 h-16 items-center justify-center rounded-full bg-green-50 text-green-600">
              <CheckCircle2 size={32} />
            </span>
            <h1 className="mt-6 font-display font-extrabold text-navy-900 text-3xl sm:text-4xl leading-tight text-balance">
              Thank You — We've Received Your Request
            </h1>
            <p className="mt-5 text-slate leading-relaxed">
              A member of our team will review the details and get back to you within 1 working day. If it's
              urgent, please call us directly and we'll help right away.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <a
                href="/"
                className="inline-flex items-center justify-center rounded-full bg-orange-500 text-white px-9 py-4 text-sm font-bold shadow-card hover:bg-orange-600 hover:shadow-card-hover transition-all"
              >
                Back to Homepage
              </a>
              <a
                href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 rounded-full border-2 border-navy-900 text-navy-900 px-7 py-3.5 text-sm font-bold hover:bg-navy-900 hover:text-white transition-all"
              >
                <Phone size={16} /> Call {company.phoneJobBooking}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
