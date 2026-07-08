import { useEffect } from "react";
import { SITE_URL, SITE_NAME } from "../lib/seo";
import { company } from "../data/content";

export function SiteSchema() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-site-jsonld", "true");
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      telephone: company.phoneJobBooking,
      email: company.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: "48 Fulham High Street, Upper Level",
        addressLocality: "London",
        postalCode: "SW6 3LQ",
        addressCountry: "GB",
      },
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Greater London",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.6",
        reviewCount: "520",
      },
      foundingDate: "2019",
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
