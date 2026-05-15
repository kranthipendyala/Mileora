import { siteUrl } from "@/lib/utils";
import { SITE } from "@/lib/seo";

type Props = { data: Record<string, unknown> | Record<string, unknown>[] };

export function JsonLd({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const orgJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: siteUrl(),
  logo: siteUrl("/icons/icon-512.png"),
  sameAs: [
    "https://www.facebook.com/mileora",
    "https://www.instagram.com/mileora",
    "https://www.youtube.com/@mileora",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "info@magnusconference.com",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Tamil", "Hindi"],
    },
  ],
});

export const websiteJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: siteUrl(),
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteUrl()}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: it.name,
    item: siteUrl(it.path),
  })),
});

export const serviceJsonLd = (name: string, description: string, path: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: { "@type": "Organization", name: SITE.name, url: siteUrl() },
  areaServed: { "@type": "Country", name: "India" },
  url: siteUrl(path),
});

export const faqJsonLd = (faqs: { q: string; a: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
