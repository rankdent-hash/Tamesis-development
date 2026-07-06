import { useEffect, useState } from "react";
import { Phone, MessageCircle, X } from "lucide-react";
import { company } from "../data/content";
import { HeroQuoteForm } from "./HeroQuoteForm";

export function StickyMobileCall() {
  const [contactOpen, setContactOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = contactOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [contactOpen]);

  return (
    <>
      <div
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2.5 px-3 pt-2.5"
        style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
      >
        <a
          href={`tel:${company.phoneJobBooking.replace(/\s/g, "")}`}
          className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-white bg-navy-900 text-white py-3 text-sm font-bold"
        >
          <Phone size={16} /> Call Now
        </a>
        <button
          type="button"
          onClick={() => setContactOpen(true)}
          className="flex-1 flex items-center justify-center gap-2 rounded-full border-2 border-white bg-orange-500 text-navy-950 py-3 text-sm font-bold"
        >
          <MessageCircle size={16} /> Contact Us
        </button>
      </div>

      {contactOpen && (
        <div
          className="lg:hidden fixed inset-0 z-[60] bg-navy-950/60 flex items-end"
          onClick={() => setContactOpen(false)}
        >
          <div
            className="w-full max-h-[88vh] overflow-y-auto rounded-t-2xl bg-paper p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                aria-label="Close"
                className="flex items-center justify-center w-8 h-8 rounded-full text-slate-light hover:bg-navy-50 hover:text-navy-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <HeroQuoteForm compact />
          </div>
        </div>
      )}
    </>
  );
}
