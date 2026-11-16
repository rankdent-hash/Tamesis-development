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
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex gap-2.5 pt-2.5"
        style={{
          paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom, 0px))",
          paddingLeft: "calc(0.75rem + env(safe-area-inset-left, 0px))",
          paddingRight: "calc(0.75rem + env(safe-area-inset-right, 0px))",
        }}
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
            className="w-full max-h-[88dvh] overflow-y-auto overscroll-contain rounded-t-2xl bg-paper pt-5 pl-[calc(1.25rem+env(safe-area-inset-left,0px))] pr-[calc(1.25rem+env(safe-area-inset-right,0px))] pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end mb-1">
              <button
                type="button"
                onClick={() => setContactOpen(false)}
                aria-label="Close"
                className="flex items-center justify-center w-11 h-11 -mr-2 -mt-2 rounded-full text-slate-light hover:bg-navy-50 hover:text-navy-900 transition-colors"
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
