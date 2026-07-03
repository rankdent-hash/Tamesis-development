import { SectorLayout } from "./SectorLayout";

export function CommercialClients() {
  return (
    <SectorLayout
      name="Commercial Clients"
      slug="commercial-clients"
      metaDescription="Commercial refurbishment and maintenance planned around your trading hours, delivering commercial-grade finishes across London."
      heroSubtitle="Refurbishment and maintenance planned around your trading hours, so your premises stay open and operational while the work gets done."
      introHeading="Refurbishment That Keeps You Trading"
      introParagraphs={[
        "Commercial premises can rarely afford to close for maintenance or refurbishment work. We plan around your operating hours — including evening, weekend and out-of-hours working where needed — so the work happens without disrupting your business.",
        "From office refits to ongoing maintenance contracts, we act as a single contractor covering everything from minor repairs to full refurbishment projects, backed by proper project management on larger jobs.",
        "Finishes are delivered to a commercial standard — this isn't domestic-grade work adapted for offices, it's built for the wear and presentation commercial spaces need.",
      ]}
      keyPoints={[
        {
          title: "Work Scheduled Around Trading Hours",
          body: "Out-of-hours and phased working available so your business can keep operating while we work.",
        },
        {
          title: "Minimal Disruption Planning",
          body: "Site logistics planned in advance to reduce noise, dust and disruption to staff and customers.",
        },
        {
          title: "Commercial-Grade Finishes",
          body: "Work delivered to a standard built for commercial wear, footfall and presentation.",
        },
        {
          title: "Single Contractor, Full Scope",
          body: "One contractor for both day-to-day maintenance and larger refurbishment projects — no need to manage multiple suppliers.",
        },
      ]}
      relevantServiceSlugs={[
        "commercial-refurbishment",
        "electrical",
        "construction",
        "planned-maintenance",
        "painting-decorating",
      ]}
      ctaHeading="Plan a Commercial Refurbishment or Maintenance Contract"
    />
  );
}
