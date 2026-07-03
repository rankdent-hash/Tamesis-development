import { SectorLayout } from "./SectorLayout";

export function Landlords() {
  return (
    <SectorLayout
      name="Landlords"
      slug="landlords"
      metaDescription="Fast void turnaround and responsive repairs for landlords across London, with fixed transparent quotes and one contractor for every property type."
      heroSubtitle="Fast turnarounds on repairs and void works, whether you manage a single rental property or a growing portfolio across London."
      introHeading="Keeping Your Rental Property Tenant-Ready"
      introParagraphs={[
        "Every day a rental property sits empty or unrepaired costs you money. We prioritise fast response on tenant-reported repairs and void turnaround work, so properties are back to earning as quickly as possible.",
        "Whether it's a single buy-to-let or a growing portfolio, you get the same directly employed engineers and clear, fixed quotes — no surprise costs once work is underway.",
        "We also handle the less glamorous but essential side of being a landlord: certificates, compliance-related repairs and insurance reinstatement work when things go wrong.",
      ]}
      keyPoints={[
        {
          title: "Fast Void Turnaround",
          body: "Repairs, refurbishment and cleaning between tenancies handled quickly to minimise void periods.",
        },
        {
          title: "Responsive Tenant Repairs",
          body: "Tenant-reported issues actioned promptly, keeping tenants satisfied and reducing disputes.",
        },
        {
          title: "Fixed, Transparent Quotes",
          body: "A clear quote before work begins, so you know the cost upfront with no hidden extras.",
        },
        {
          title: "One Contractor, Every Property Type",
          body: "From a single flat to a multi-property portfolio, the same standard of work and communication throughout.",
        },
      ]}
      relevantServiceSlugs={[
        "void-refurbishment",
        "responsive-repairs",
        "plumbing",
        "electrical",
        "insurance-reinstatement",
      ]}
      ctaHeading="Get Your Rental Property Turned Around Faster"
    />
  );
}
