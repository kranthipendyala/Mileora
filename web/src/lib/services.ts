/**
 * Server-side fetcher for a guide's services on the public astrologer profile.
 * Falls back to a deterministic mock derived from the astrologer's legacy
 * single-price field so the booking flow never breaks if CI3 is down OR if
 * the guide hasn't declared any services yet.
 */

import { apiPublic } from "./api-client";
import { ASTROLOGERS, type Astrologer } from "./mock-data";

export type GuideService = {
  id: number;
  guide_id: number;
  category_id: number;
  category_name: string;
  category_slug: string;
  category_icon: string | null;
  name: string;
  description: string | null;
  base_price_paise: number;
  discounted_price_paise: number | null;
  price_unit: "fixed" | "per_session" | "per_hour" | "per_report";
  duration_minutes: number;
  delivery_mode: "video" | "voice" | "chat" | "in_person" | "async_report" | "online_puja";
  is_active: 0 | 1;
};

/** When CI3 isn't reachable, synthesize 2–3 plausible services from the
 *  astrologer's specialties + legacy single-session price so the booking
 *  card has something to render. */
function fallbackServicesFor(astrologer: Astrologer | undefined): GuideService[] {
  if (!astrologer) return [];
  const base = astrologer.pricePaise;
  const sessionMins = astrologer.sessionMinutes;
  const primary = (astrologer.specialties[0] ?? "Vedic").toLowerCase();

  const categoryFor = (s: string): { id: number; name: string; slug: string; icon: string } => {
    const m = s.toLowerCase();
    if (m.includes("numerolog")) return { id: 2, name: "Numerology",       slug: "numerology",       icon: "Calculator" };
    if (m.includes("vasthu"))    return { id: 3, name: "Vasthu Shastra",   slug: "vasthu",           icon: "Home" };
    if (m.includes("jothi"))     return { id: 4, name: "Tamil Jothisyam",  slug: "jothisyam",        icon: "Sun" };
    if (m.includes("tarot"))     return { id: 7, name: "Tarot Reading",    slug: "tarot",            icon: "Layers" };
    if (m.includes("compat"))    return { id: 6, name: "Kundli Matching",  slug: "kundli-matching",  icon: "Heart" };
    return { id: 1, name: "Vedic Astrology", slug: "astrology", icon: "Sparkles" };
  };

  const cat = categoryFor(primary);

  return [
    {
      id: 1, guide_id: 0, category_id: cat.id, category_name: cat.name, category_slug: cat.slug, category_icon: cat.icon,
      name: `${sessionMins}-min ${cat.name} Reading`,
      description: "Focused live consultation covering your immediate question with practical remedies.",
      base_price_paise: base, discounted_price_paise: null,
      price_unit: "per_session", duration_minutes: sessionMins, delivery_mode: "video", is_active: 1,
    },
    {
      id: 2, guide_id: 0, category_id: cat.id, category_name: cat.name, category_slug: cat.slug, category_icon: cat.icon,
      name: "Annual Forecast (60 min + PDF)",
      description: "Deep-dive 12-month varshphal with monthly do's and don'ts. Written PDF included.",
      base_price_paise: Math.round(base * 2.4), discounted_price_paise: Math.round(base * 2),
      price_unit: "per_session", duration_minutes: 60, delivery_mode: "video", is_active: 1,
    },
    {
      id: 3, guide_id: 0, category_id: 6, category_name: "Kundli Matching", category_slug: "kundli-matching", category_icon: "Heart",
      name: "Express Kundli Matching (PDF)",
      description: "36-guna porutham analysis delivered as a PDF within 24 hours. No live call.",
      base_price_paise: Math.round(base * 0.5), discounted_price_paise: null,
      price_unit: "per_report", duration_minutes: 60, delivery_mode: "async_report", is_active: 1,
    },
  ];
}

export async function getServicesForAstrologer(slug: string): Promise<{ rows: GuideService[]; live: boolean }> {
  try {
    const r = await apiPublic.get<{ data: GuideService[] }>(`/astrologers/${slug}/services`, { revalidate: 60 });
    const rows = Array.isArray(r?.data) ? r.data : [];
    if (rows.length > 0) return { rows, live: true };
    // CI3 reachable but guide hasn't added services yet — synthesize from legacy fields.
    return { rows: fallbackServicesFor(ASTROLOGERS.find((a) => a.slug === slug)), live: true };
  } catch {
    return { rows: fallbackServicesFor(ASTROLOGERS.find((a) => a.slug === slug)), live: false };
  }
}
