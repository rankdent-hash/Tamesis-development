import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Intercepts clicks on plain <a href="/..."> tags (internal, same-origin
 * links) and routes them through React Router instead of letting the
 * browser do a full page reload. External links, tel:/mailto:, hash
 * links, download links, and modified clicks (ctrl/cmd/shift/middle-click,
 * or target="_blank") are left alone so the browser handles them normally.
 *
 * This lets the whole site use ordinary <a href="/path"> markup (simpler
 * to write and safer to refactor) while still getting instant SPA
 * navigation, rather than converting every anchor to <Link> by hand.
 */
export function useInternalLinkInterceptor() {
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return; // left click only
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let browser handle new-tab etc.

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href) return;
      if (href.startsWith("#") || href.startsWith("tel:") || href.startsWith("mailto:")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;

      e.preventDefault();
      navigate(url.pathname + url.search + url.hash);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [navigate]);
}
