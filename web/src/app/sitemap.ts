import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
// import { apiPublic } from "@/lib/api-client";

const STATIC_PATHS = [
  "/",
  "/astrology",
  "/numerology",
  "/vasthu",
  "/jothisyam",
  "/puja",
  "/astrologers",
  "/free/kundli",
  "/free/numerology",
  "/free/horoscope",
  "/free/compatibility",
  "/about",
  "/contact",
  "/blog",
  "/legal/terms",
  "/legal/privacy",
  "/legal/refunds",
  "/legal/disclaimer",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((p) => ({
    url: siteUrl(p),
    lastModified: now,
    changeFrequency: p === "/" ? "daily" : "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));

  // Dynamic entries — uncomment once API is reachable.
  // const astrologers = await apiPublic.get<{ data: { slug: string; updated_at: string }[] }>(
  //   "/astrologers?perPage=1000&fields=slug,updated_at",
  //   { revalidate: 3600 }
  // );
  // const astroEntries = astrologers.data.map((a) => ({
  //   url: siteUrl(`/astrologers/${a.slug}`),
  //   lastModified: new Date(a.updated_at),
  //   changeFrequency: "weekly" as const,
  //   priority: 0.6,
  // }));

  return [...staticEntries];
}
