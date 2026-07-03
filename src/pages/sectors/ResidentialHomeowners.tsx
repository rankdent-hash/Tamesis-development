import { SectorLayout } from "./SectorLayout";

export function ResidentialHomeowners() {
  return (
    <SectorLayout
      name="Residential Homeowners"
      slug="residential-homeowners"
      metaDescription="Professional property maintenance and refurbishment for London homeowners — from a single repair to a full bathroom or kitchen refurbishment."
      heroSubtitle="The same professional standard we bring to housing association contracts, brought to individual family homes — from a single repair to a full refurbishment."
      introHeading="Professional Standards, Brought to Your Home"
      introParagraphs={[
        "You shouldn't need a large contract to get a professional standard of work. We bring the same directly employed engineers, clear quoting and quality checks to individual homeowner jobs as we do to our largest contracts.",
        "Whether it's a leaking tap, a full bathroom refurbishment or a home extension, our engineers work tidily and respectfully in your home, and keep you informed throughout.",
        "There are no hidden costs — you get a clear quote before anything starts, and a quality check once the work is done.",
      ]}
      keyPoints={[
        {
          title: "Clear, Fixed Quotes",
          body: "A straightforward quote before work begins, so you know exactly what to expect — no surprise costs.",
        },
        {
          title: "Tidy, Respectful Engineers",
          body: "Our teams protect your property, work cleanly, and leave your home as they found it.",
        },
        {
          title: "Small Repairs to Full Refurbishment",
          body: "From a single leaking tap to a complete bathroom or kitchen refurbishment — one contractor for it all.",
        },
        {
          title: "Aftercare Included",
          body: "Every job is checked before we consider it complete, with follow-up support if anything needs revisiting.",
        },
      ]}
      relevantServiceSlugs={[
        "bathroom-refurbishment",
        "carpentry-joinery",
        "painting-decorating",
        "plumbing",
        "flooring-repairs",
      ]}
      ctaHeading="Get a Quote for Work on Your Home"
    />
  );
}
