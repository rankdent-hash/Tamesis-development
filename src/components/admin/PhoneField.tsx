import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Phone, MessageSquare, QrCode } from "lucide-react";
import { CopyButton } from "./CopyButton";

function normalizePhone(raw: string): { e164: string; isMobile: boolean } {
  const digits = raw.replace(/[^\d+]/g, "");
  let e164: string;
  if (digits.startsWith("+44")) {
    e164 = digits;
  } else if (digits.startsWith("44")) {
    e164 = "+" + digits;
  } else if (digits.startsWith("0")) {
    e164 = "+44" + digits.slice(1);
  } else {
    e164 = digits.startsWith("+") ? digits : "+" + digits;
  }
  const nationalPart = e164.replace("+44", "");
  const isMobile = nationalPart.startsWith("7");
  return { e164, isMobile };
}

function QrTile({ label, icon: Icon, data }: { label: string; icon: typeof Phone; data: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(data, { width: 120, margin: 1, color: { dark: "#0E1611", light: "#FAF8F4" } })
      .then((url) => {
        if (!cancelled) setSrc(url);
      })
      .catch(() => {
        if (!cancelled) setSrc(null);
      });
    return () => {
      cancelled = true;
    };
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-1.5 w-[104px]">
      {src ? (
        <img src={src} alt={`QR code — ${label}`} className="w-24 h-24 rounded-lg border border-navy-100" />
      ) : (
        <div className="w-24 h-24 rounded-lg border border-navy-100 bg-navy-50 animate-pulse" />
      )}
      <span className="flex items-center gap-1 text-[11px] font-medium text-navy-700 text-center leading-tight">
        <Icon size={11} className="shrink-0" /> {label}
      </span>
    </div>
  );
}

export function PhoneField({ phone }: { phone: string }) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { e164, isMobile } = normalizePhone(phone);

  useEffect(() => {
    if (!open) return;
    const handleClickAway = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickAway);
    return () => document.removeEventListener("mousedown", handleClickAway);
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative inline-block"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpen((v) => !v);
          }}
          className="font-semibold text-base text-navy-900 hover:text-orange-600 transition-colors"
        >
          {phone}
        </button>
        <CopyButton value={phone} label="phone number" />
      </div>

      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute left-0 top-full mt-2 z-30 rounded-2xl border-2 border-navy-900 bg-white shadow-card-hover p-4 flex gap-3"
        >
          <QrTile label="Scan to Call" icon={Phone} data={`tel:${e164}`} />
          {isMobile && (
            <>
              <QrTile label="Scan to Text" icon={MessageSquare} data={`sms:${e164}`} />
              <QrTile label="Scan WhatsApp" icon={QrCode} data={`https://wa.me/${e164.replace("+", "")}`} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
