import type { Metadata } from "next";
import { siteUrl } from "./utils";

export const SITE = {
  name: "Mileora",
  tagline: "Astrology, Numerology, Vasthu, Jothisyam & Puja",
  description:
    "Trusted Vedic astrologers, free kundli, numerology readings, vasthu consultation, and online puja booking — all in one place.",
  twitter: "@mileora",
  themeColor: "#0b0a14",
  ogLocale: "en_IN",
};

type SeoInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article" | "profile";
};

export function buildMetadata({
  title,
  description = SITE.description,
  path = "/",
  image = "/opengraph-image",
  noindex = false,
  type = "website",
}: SeoInput = {}): Metadata {
  const fullTitle = title ? `${title} — ${SITE.name}` : `${SITE.name} — ${SITE.tagline}`;
  const url = siteUrl(path);

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(siteUrl()),
    alternates: { canonical: url },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
    openGraph: {
      type,
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: SITE.ogLocale,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: SITE.twitter,
      title: fullTitle,
      description,
      images: [image],
    },
    icons: {
      icon: "/favicon.ico",
      apple: "/icons/apple-touch-icon.png",
    },
    manifest: "/manifest.webmanifest",
  };
}
