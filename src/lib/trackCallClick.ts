export function trackCallClick(phoneNumber: string, pagePath: string) {
  // Fire-and-forget: never blocks or delays the actual tel: dial action,
  // and a failure here should never be visible to the site visitor.
  try {
    fetch("/api/call-clicks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phoneNumber, pagePath }),
      keepalive: true, // survives the page navigating away right after the click
    }).catch(() => {});
  } catch {
    // no-op
  }

  // Also surface it as a GA4 event, since gtag is already loaded sitewide —
  // free extra visibility in Analytics alongside the admin panel view.
  if (typeof window.gtag === "function") {
    window.gtag("event", "phone_click", {
      phone_number: phoneNumber,
      page_path: pagePath,
    });
  }
}
