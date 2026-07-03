import { SectorLayout } from "./SectorLayout";

export function LocalAuthorities() {
  return (
    <SectorLayout
      name="Local Authorities"
      heroSubtitle="Framework-ready contracting for council housing stock, void properties and public buildings, delivered with the transparency and reporting local authority procurement requires."
      introHeading="A Contractor Built for Public Sector Delivery"
      introParagraphs={[
        "Working with local authorities means delivering to a standard that holds up to scrutiny — clear costings, documented processes, and consistent quality whether the job is a single council flat repair or a public building refurbishment.",
        "We deliver responsive repairs, void turnaround and planned maintenance for council housing stock, alongside maintenance and refurbishment work in community and public buildings.",
        "Our directly employed teams and structured job booking process mean works orders are logged and actioned consistently, giving your team a clear audit trail from instruction to completion.",
      ]}
      keyPoints={[
        {
          title: "Procurement-Ready Reporting",
          body: "Transparent costings and documented processes that hold up to the scrutiny of public sector procurement and audit.",
        },
        {
          title: "Void Property Turnaround",
          body: "Fast, well-documented void works to help reduce time between tenancies across council housing stock.",
        },
        {
          title: "Public Building Maintenance",
          body: "Maintenance and refurbishment capability for community centres, offices and other public-facing buildings.",
        },
        {
          title: "Community-Sensitive Delivery",
          body: "Work scheduled and carried out with awareness of the communities and residents affected by the works.",
        },
      ]}
      relevantServiceSlugs={[
        "planned-maintenance",
        "void-refurbishment",
        "construction",
        "commercial-refurbishment",
        "electrical",
      ]}
      ctaHeading="Discuss a Council Housing or Public Building Contract"
    />
  );
}
