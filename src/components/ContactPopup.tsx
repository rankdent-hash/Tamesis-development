import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { X, Copy, Check, MessageCircle, MessageSquareText } from "lucide-react";

type ContactMode = "call" | "mobile";

interface ContactPopupProps {
  open: boolean;
  onClose: () => void;
  mode: ContactMode;
  label: string; // e.g. "Job Booking", "Management", "WhatsApp"
  phoneNumber: string; // formatted, e.g. "020 3488 3737" or "07379 021500"
}

function toE164(phoneNumber: string): string {
  const digits = phoneNumber.replace(/\s/g, "");
  return digits.startsWith("0") ? `+44${digits.slice(1)}` : digits;
}

export function ContactPopup({ open, onClose, mode, label, phoneNumber }: ContactPopupProps) {
  const [copied, setCopied] = useState(false);
  const [mobileTab, setMobileTab] = useState<"whatsapp" | "sms">("whatsapp");

  useEffect(() => {
    if (!open) return;
    setCopied(false);
    setMobileTab("whatsapp");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const e164 = toE164(phoneNumber);
  const qrValue =
    mode === "call"
      ? `tel:${e164}`
      : mobileTab === "whatsapp"
        ? `https://wa.me/${e164.replace("+", "")}`
        : `sms:${e164}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — copy button simply won't confirm, non-critical
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Contact ${label}`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs rounded-2xl bg-white shadow-card-hover p-6 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-light hover:bg-navy-50 hover:text-navy-900 transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="font-display font-bold text-navy-900 text-base mb-1">{label}</h3>
        <p className="text-xs text-slate-light mb-4">
          {mode === "call"
            ? "Scan with your phone to call, or copy the number"
            : mobileTab === "whatsapp"
              ? "Scan to open WhatsApp, or copy the number"
              : "Scan to send a text, or copy the number"}
        </p>

        {mode === "mobile" && (
          <div className="flex rounded-full border-2 border-navy-900 p-0.5 mb-4 text-xs font-semibold">
            <button
              onClick={() => setMobileTab("whatsapp")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${
                mobileTab === "whatsapp" ? "bg-orange-500 text-navy-950" : "text-navy-700"
              }`}
            >
              <MessageCircle size={13} /> WhatsApp
            </button>
            <button
              onClick={() => setMobileTab("sms")}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-1.5 transition-colors ${
                mobileTab === "sms" ? "bg-orange-500 text-navy-950" : "text-navy-700"
              }`}
            >
              <MessageSquareText size={13} /> Text
            </button>
          </div>
        )}

        <div className="mx-auto w-40 h-40 flex items-center justify-center rounded-xl border-2 border-navy-900 bg-white p-2 mb-4">
          <QRCode value={qrValue} size={144} style={{ width: "100%", height: "100%" }} />
        </div>

        <div className="font-display font-bold text-navy-900 text-lg mb-4">{phoneNumber}</div>

        <button
          onClick={handleCopy}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 text-white px-5 py-2.5 text-sm font-semibold hover:bg-navy-800 transition-colors"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy Number"}
        </button>
      </div>
    </div>
  );
}
