import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { AppRoutes } from "./App";

/**
 * Build-time only (scripts/prerender.mjs): renders a route to HTML so the
 * browser can paint the header, hero text and call-to-actions straight from
 * index.html, before any JavaScript has downloaded. Lazy sections render as
 * their placeholders and load on the client as before.
 */
export function render(url: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </StrictMode>
  );
}
