// Forwards a copy of each form submission to GoHighLevel via the Supabase
// "jotform-bridge" function the developer set up. This is ADDITIVE to the
// site's own lead pipeline (submitForm -> /api/submit-form -> Postgres +
// email) — it never replaces it, and a failure here must never block or
// affect the real submission. Fire-and-forget, same pattern as
// trackCallClick.ts.
//
// IMPORTANT UNKNOWN: the bridge is named "jotform-bridge", which strongly
// suggests it expects a payload shaped like a native HTML form POST
// (application/x-www-form-urlencoded), not JSON — so that's what this
// sends. What's NOT known from here is the exact field names the bridge
// expects to map into GoHighLevel (JotForm's own exports often use
// non-obvious names like "q3_name"). This uses plain, conventional names
// (name, email, phone, message, formType) as a best-effort default. Worth
// confirming with whoever built the bridge that these land in the right
// GoHighLevel fields — see the chat explanation for how to verify this.

const GOHIGHLEVEL_BRIDGE_URL =
  "https://qothszqaaorozkduovfr.supabase.co/functions/v1/jotform-bridge?form_id=ee8b9bb1-e172-4969-831d-0378332f4f82";

export function sendToGoHighLevel(fields: Record<string, string>) {
  try {
    const body = new URLSearchParams(fields);
    fetch(GOHIGHLEVEL_BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // no-op — this integration must never break the real form submission
  }
}
