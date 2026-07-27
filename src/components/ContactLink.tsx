import { useState, type ReactNode, type MouseEvent } from "react";
import { ContactPopup } from "./ContactPopup";

// Tailwind's md breakpoint (768px) — below this we treat the visitor as
// being on a phone already, where a normal tel:/wa.me click just works and
// a QR-code popup would be pointless (you can't usefully scan a code with
// the same device it's shown on). At md and above, tapping a phone number
// on a desktop or tablet usually does nothing useful, so we intercept and
// offer a QR code to scan with an actual phone, plus a copy button.
const MOBILE_BREAKPOINT_QUERY = "(max-width: 767px)";

interface ContactLinkProps {
  href: string;
  mode: "call" | "mobile";
  label: string;
  phoneNumber: string;
  className?: string;
  ariaLabel?: string;
  target?: string;
  rel?: string;
  children: ReactNode;
}

export function ContactLink({ href, mode, label, phoneNumber, className, ariaLabel, target, rel, children }: ContactLinkProps) {
  const [open, setOpen] = useState(false);

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const isMobile = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
    if (isMobile) return; // let the normal tel:/wa.me navigation happen
    e.preventDefault();
    setOpen(true);
  };

  return (
    <>
      <a href={href} onClick={handleClick} className={className} aria-label={ariaLabel} target={target} rel={rel}>
        {children}
      </a>
      <ContactPopup open={open} onClose={() => setOpen(false)} mode={mode} label={label} phoneNumber={phoneNumber} />
    </>
  );
}
