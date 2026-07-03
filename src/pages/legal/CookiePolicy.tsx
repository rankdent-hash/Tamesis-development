import { LegalPage } from "./LegalPage";
import { company } from "../../data/content";

export function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="July 2026"
      sections={[
        {
          heading: "What Are Cookies",
          body: [
            "Cookies are small text files placed on your device when you visit a website. They help the site function correctly and can also be used to understand how visitors use the site.",
          ],
        },
        {
          heading: "How We Use Cookies",
          body: [
            "We use essential cookies required for the website to function, and may use analytics cookies to understand how visitors interact with our site, so we can improve it over time.",
            "We do not use cookies to sell your personal information.",
          ],
        },
        {
          heading: "Managing Cookies",
          body: [
            "Most web browsers allow you to control cookies through their settings, including blocking or deleting them. Restricting cookies may affect the functionality of this website.",
          ],
        },
        {
          heading: "Contact",
          body: [`If you have questions about this policy, please contact us at ${company.email}.`],
        },
      ]}
    />
  );
}
