import { LegalPage } from "./LegalPage";
import { company } from "../../data/content";
import { seoMeta } from "../../data/seoMeta";

export function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      updated="July 2026"
      description={seoMeta.terms.description}
      path="/terms"
      sections={[
        {
          heading: "Introduction",
          body: [
            `These terms govern your use of the ${company.name} website and, alongside any separately agreed contract or works order, the services we provide.`,
          ],
        },
        {
          heading: "Quotes & Works Orders",
          body: [
            "Quotes are provided based on the information available at the time and may be subject to revision following a site survey. Work will only proceed once a quote or works order has been agreed.",
          ],
        },
        {
          heading: "Payment",
          body: [
            "Payment terms will be agreed as part of each individual contract, quote or works order and may vary between residential, commercial and contract clients.",
          ],
        },
        {
          heading: "Liability & Insurance",
          body: [
            "We hold public liability and employer's liability insurance across our operational teams. Our liability in relation to any work carried out is limited in accordance with the terms agreed for that work.",
          ],
        },
        {
          heading: "Website Use",
          body: [
            "Content on this website is provided for general information about our services and does not constitute a binding offer. We take reasonable care to keep information accurate but do not guarantee it is complete or error-free.",
          ],
        },
        {
          heading: "Governing Law",
          body: ["These terms are governed by the laws of England and Wales."],
        },
        {
          heading: "Contact",
          body: [`Questions about these terms can be directed to ${company.email}.`],
        },
      ]}
    />
  );
}
