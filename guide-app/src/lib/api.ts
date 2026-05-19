/**
 * Guide-side API client. Hits the same CI3 backend as the web + customer app
 * but uses the guide JWT (stored separately so a single phone could in
 * principle hold both a customer + guide identity on the same device).
 */

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2/Mileora/api/index.php/api/v1";
const APP_KEY = process.env.EXPO_PUBLIC_MILEORA_APP_KEY ?? "";

let bearer: string | null = null;
export function setGuideToken(t: string | null) { bearer = t; }
export function getGuideToken(): string | null { return bearer; }

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-Mileora-Key": APP_KEY,
  };
  if (bearer) headers.Authorization = `Bearer ${bearer}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`API ${res.status} ${res.statusText} ${path}`);
  }
  return (await res.json()) as T;
}

export const api = {
  get:    <T>(path: string)                  => request<T>("GET",    path),
  post:   <T>(path: string, body: unknown)   => request<T>("POST",   path, body),
  put:    <T>(path: string, body: unknown)   => request<T>("PUT",    path, body),
  delete: <T>(path: string)                  => request<T>("DELETE", path),
};
