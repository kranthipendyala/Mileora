const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2/Mileora/api/index.php/api/v1";
const APP_KEY = process.env.EXPO_PUBLIC_MILEORA_APP_KEY ?? "";

let bearer: string | null = null;
export function setAuthToken(t: string | null) { bearer = t; }

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
  get:  <T>(path: string) => request<T>("GET", path),
  post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
};
