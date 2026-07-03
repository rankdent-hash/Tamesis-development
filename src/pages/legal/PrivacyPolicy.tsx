import { LegalPage } from "./LegalPage";
import { company } from "../../data/content";
import { seoMeta } from "../../data/seoMeta";

export function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="July 2026"
      description={seoMeta.privacy.description}
      path="/privacy-policy"
      sections={[
        {
          heading: "Who We Are",
          body: [
            `${company.name} ("we", "us", "our") is a property maintenance and refurbishment contractor based at ${company.addressLines.join(", ")}. This policy explains how we collect, use and protect personal information when you use our website or engage our services.`,
          ],
        },
        {
          heading: "Information We Collect",
          body: [
            "We may collect information you provide directly — such as your name, contact details, property address and details of the work requested — when you submit a quote request, report a repair, apply for a role, or otherwise contact us.",
            "We may also collect limited technical information automatically, such as browser type and pages visited, to help us understand how our website is used.",
          ],
        },
        {
          heading: "How We Use Your Information",
          body: [
            "We use the information you provide to respond to enquiries, schedule and carry out work, process job applications, and meet our contractual and legal obligations.",
            "We do not sell your personal information to third parties.",
          ],
        },
        {
          heading: "Data Retention",
          body: [
            "We retain personal information for as long as necessary to provide our services and to comply with legal, accounting and reporting obligations.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You have the right to request access to, correction of, or deletion of the personal information we hold about you, subject to applicable law. To make a request, please contact us using the details on our Contact page.",
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
