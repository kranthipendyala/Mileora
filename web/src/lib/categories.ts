/**
 * Server-side category fetcher with graceful fallback. The home page + /services
 * page are Server Components that need to render even when CI3 isn't reachable
 * (local dev without the API running). When the fetch fails we serve a static
 * fallback list that mirrors the seeded categories from migration 012.
 */

import { apiPublic } from "./api-client";

export type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  sort_order: number;
  active_guide_count?: number;
  active_service_count?: number;
};

// Static fallback — kept in sync with migration 012 seed. The home page renders
// these when CI3 is down so dev/preview never shows an empty grid.
const FALLBACK_CATEGORIES: Category[] = [
  { id: 1, parent_id: null, name: "Vedic Astrology", slug: "astrology",       icon: "Sparkles",   description: "Birth chart analysis, dasha periods, planetary remedies — rooted in 5,000-year-old jyotisha tradition.",                            sort_order: 1, active_guide_count: 0, active_service_count: 0 },
  { id: 2, parent_id: null, name: "Numerology",      slug: "numerology",      icon: "Calculator", description: "Decode your life path, destiny number, and lucky vibrations from your name and date of birth.",                                  sort_order: 2, active_guide_count: 0, active_service_count: 0 },
  { id: 3, parent_id: null, name: "Vasthu Shastra",  slug: "vasthu",          icon: "Home",       description: "Align your home or office with cosmic energies. Compass-based vasthu audit and remedies.",                                       sort_order: 3, active_guide_count: 0, active_service_count: 0 },
  { id: 4, parent_id: null, name: "Tamil Jothisyam", slug: "jothisyam",       icon: "Sun",        description: "South Indian Vedic astrology with rasi, navamsa, and traditional Tamil panchangam guidance.",                                 sort_order: 4, active_guide_count: 0, active_service_count: 0 },
  { id: 5, parent_id: null, name: "Online Puja",     slug: "puja",            icon: "Flame",      description: "Book authentic pujas at famous temples. Live stream, sankalpam in your name, prasad delivered home.",                          sort_order: 5, active_guide_count: 0, active_service_count: 0 },
  { id: 6, parent_id: null, name: "Kundli Matching", slug: "kundli-matching", icon: "Heart",      description: "Vedic kundli matching with 36-guna porutham. Free instant report plus detailed expert analysis.",                            sort_order: 6, active_guide_count: 0, active_service_count: 0 },
  { id: 7, parent_id: null, name: "Tarot Reading",   slug: "tarot",           icon: "Layers",     description: "Tarot card readings for love, career, and decision-making clarity.",                                                          sort_order: 7, active_guide_count: 0, active_service_count: 0 },
  { id: 8, parent_id: null, name: "Daily Horoscope", slug: "horoscope",       icon: "Star",       description: "Personalized daily, weekly, and monthly horoscopes by your rasi.",                                                              sort_order: 8, active_guide_count: 0, active_service_count: 0 },
];

export async function getActiveCategories(opts?: { limit?: number }): Promise<{ rows: Category[]; live: boolean }> {
  try {
    const r = await apiPublic.get<{ data: Category[] }>("/categories", { revalidate: 60 });
    const rows = Array.isArray(r?.data) ? r.data : [];
    if (rows.length === 0) return { rows: FALLBACK_CATEGORIES.slice(0, opts?.limit ?? 9), live: false };
    return { rows: opts?.limit ? rows.slice(0, opts.limit) : rows, live: true };
  } catch {
    return { rows: FALLBACK_CATEGORIES.slice(0, opts?.limit ?? 9), live: false };
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const r = await apiPublic.get<{ data: Category }>(`/categories/${slug}`, { revalidate: 60 });
    return r?.data ?? null;
  } catch {
    return FALLBACK_CATEGORIES.find((c) => c.slug === slug) ?? null;
  }
}
