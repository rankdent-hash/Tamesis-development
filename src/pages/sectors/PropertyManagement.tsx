import { SectorLayout } from "./SectorLayout";

export function PropertyManagement() {
  return (
    <SectorLayout
      name="Property Management Companies"
      heroSubtitle="One reliable contractor across your entire managed portfolio, so you're not juggling different tradespeople for every building, block or leaseholder issue."
      introHeading="A Single Point of Contact Across Your Portfolio"
      introParagraphs={[
        "Managing multiple buildings usually means managing multiple contractors — different standards, different response times, different invoicing. We work as a single, consistent contractor across your whole portfolio instead.",
        "From leaseholder-reported repairs to communal area maintenance, our teams are set up to handle a steady flow of works orders across different sites without losing track of any of them.",
        "Every job is logged and tracked, so when a leaseholder or resident chases an update, your team has a clear answer — not a guess.",
      ]}
      keyPoints={[
        {
          title: "Portfolio-Wide Contractor Relationship",
          body: "One point of contact for repairs and maintenance across every building in your portfolio, rather than a different tradesperson per site.",
        },
        {
          title: "Fast Turnaround on Leaseholder Issues",
          body: "Responsive repairs handled quickly, reducing the number of chasing calls your management team has to field.",
        },
        {
          title: "Communal Area Maintenance",
          body: "Ongoing maintenance and refurbishment of shared spaces — hallways, stairwells, communal bathrooms and more.",
        },
        {
          title: "Transparent Job Tracking",
          body: "Clear visibility on every works order, so you can give leaseholders and residents accurate updates.",
        },
      ]}
      relevantServiceSlugs={[
        "responsive-repairs",
        "leak-detection",
        "painting-decorating",
        "drain-unblocking",
        "bathroom-repairs",
      ]}
      ctaHeading="Simplify Maintenance Across Your Managed Portfolio"
    />
  );
}
