import { SectorLayout } from "./SectorLayout";

export function HousingAssociations() {
  return (
    <SectorLayout
      name="Housing Associations"
      slug="housing-associations"
      metaDescription="Responsive repairs, void turnaround and planned maintenance for housing association stock across London, with SLA-driven reporting and resident-sensitive delivery."
      heroSubtitle="A responsive repairs and planned maintenance partner for housing association stock across London, with the reporting and consistency your compliance obligations demand."
      introHeading="Delivering Repairs and Maintenance at Portfolio Scale"
      introParagraphs={[
        "Housing associations need a contractor who can handle high volumes of works orders without the quality or communication slipping — whether that's a single reported repair or a rolling planned maintenance programme across an estate.",
        "Our seventeen operational teams and dedicated job booking function mean works orders are logged, actioned and tracked from first report through to sign-off, with clear status updates available throughout.",
        "We understand that housing association work comes with a duty of care to residents. Our engineers are trained to work respectfully and communicate clearly in occupied homes, and our reporting gives your team the visibility needed for audits and resident satisfaction tracking.",
      ]}
      keyPoints={[
        {
          title: "SLA-Driven Response Times",
          body: "Repairs are prioritised and actioned against agreed response-time targets, with escalation paths for emergency works.",
        },
        {
          title: "Works Order Tracking & Reporting",
          body: "Clear status updates from first report to completion, giving your team the visibility needed for internal reporting.",
        },
        {
          title: "Void Turnaround at Scale",
          body: "Dedicated capacity for void property works, helping keep re-letting times down across your stock.",
        },
        {
          title: "Resident-Sensitive Delivery",
          body: "Engineers trained to communicate clearly and work respectfully in occupied homes, minimising disruption to residents.",
        },
      ]}
      relevantServiceSlugs={[
        "responsive-repairs",
        "void-refurbishment",
        "damp-mould",
        "planned-maintenance",
        "bathroom-refurbishment",
      ]}
      ctaHeading="Looking for a Repairs & Maintenance Partner for Your Stock?"
    />
  );
}
