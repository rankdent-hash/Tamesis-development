export const SITE_URL = "https://www.tamesisdevelopment.co.uk";
export const SITE_NAME = "Tamesis Development Ltd";

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceJsonLd(name: string, description: string, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name: `${name} | ${SITE_NAME}`,
    description,
    url: `${SITE_URL}${path}`,
    areaServed: {
      "@type": "City",
      name: "London",
    },
    provider: {
      "@type": "LocalBusiness",
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}
