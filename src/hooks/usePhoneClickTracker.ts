import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackCallClick } from "../lib/trackCallClick";

/**
 * Globally tracks clicks on any <a href="tel:..."> link on the site — the
 * Call Now buttons in the header, footer, sticky mobile bar, hero sections,
 * and every individual landing page. Uses one delegated document-level
 * listener rather than adding an onClick to every phone link individually,
 * so new phone links anywhere on the site are tracked automatically without
 * needing to remember to wire each one up by hand.
 *
 * Mirrors the same delegation pattern as useInternalLinkInterceptor.
 */
export function usePhoneClickTracker() {
  const location = useLocation();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("tel:")) return;

      trackCallClick(href.replace(/^tel:/, ""), location.pathname);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname]);
}
