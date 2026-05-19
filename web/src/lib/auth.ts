/**
 * Three independent auth scopes — same pattern as Servora.
 * Each role has its own token + profile in localStorage so a user can
 * be logged in as a customer + admin in different tabs simultaneously.
 *
 * NOTE: localStorage is bundle-side (XSS-readable). For production
 * consider migrating high-trust tokens (admin, guide) to HTTP-only
 * cookies set by the Next.js BFF.
 */

export type Role = "user" | "guide" | "admin";

type Profile = { id: number; name: string; phone?: string; email?: string; role: Role };

const KEYS: Record<Role, { token: string; profile: string }> = {
  user:   { token: "mileora_user_token",   profile: "mileora_user_profile" },
  guide: { token: "mileora_guide_token", profile: "mileora_guide_profile" },
  admin:  { token: "mileora_admin_token",  profile: "mileora_admin_profile" },
};

function isBrowser() {
  return typeof window !== "undefined";
}

export function setSession(role: Role, token: string, profile: Profile) {
  if (!isBrowser()) return;
  localStorage.setItem(KEYS[role].token, token);
  localStorage.setItem(KEYS[role].profile, JSON.stringify(profile));
}

export function getToken(role: Role): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEYS[role].token);
}

export function getProfile(role: Role): Profile | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(KEYS[role].profile);
  try {
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function clearSession(role: Role) {
  if (!isBrowser()) return;
  localStorage.removeItem(KEYS[role].token);
  localStorage.removeItem(KEYS[role].profile);
}

export function isAuthed(role: Role): boolean {
  return !!getToken(role);
}
