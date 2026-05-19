/**
 * Thin fetch wrapper for talking to the CodeIgniter 3 REST API.
 *
 * Three flavors:
 *  - apiPublic  — unauthenticated GETs from Server Components (Next caching)
 *  - apiServer  — server-to-server with the server key (BFF route handlers only)
 *  - apiUser    — browser fetches with the JWT auto-attached from localStorage
 *                 (uses the role-specific token from lib/auth.ts)
 */

import type { Role } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost/Mileora/api/index.php/api/v1";

type FetchOpts = Omit<RequestInit, "body"> & {
  body?: unknown;
  revalidate?: number | false;
  tags?: string[];
};

async function request<T>(path: string, opts: FetchOpts = {}, headers: Record<string, string> = {}): Promise<T> {
  const url = `${API_URL.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
  const init: RequestInit = {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(opts.headers as Record<string, string> | undefined),
      ...headers,
    },
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
    next: { revalidate: opts.revalidate, tags: opts.tags },
  };
  const res = await fetch(url, init);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status} ${res.statusText} ${path}: ${text}`);
  }
  return (await res.json()) as T;
}

export const apiPublic = {
  get: <T>(path: string, opts?: FetchOpts) => request<T>(path, { ...opts, method: "GET" }),
};

export const apiServer = {
  get: <T>(path: string, opts?: FetchOpts) =>
    request<T>(path, { ...opts, method: "GET" }, { "X-Mileora-Key": process.env.MILEORA_SERVER_API_KEY ?? "" }),
  post: <T>(path: string, body: unknown, opts?: FetchOpts) =>
    request<T>(path, { ...opts, method: "POST", body }, { "X-Mileora-Key": process.env.MILEORA_SERVER_API_KEY ?? "" }),
};

/**
 * Browser-side API client with auto-attached JWT. Lazily reads the token
 * from localStorage on each call so a logout takes effect immediately.
 */
function bearerHeaders(role: Role): Record<string, string> {
  if (typeof window === "undefined") return {};
  const key = `mileora_${role}_token`;
  const token = window.localStorage.getItem(key);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function apiUser(role: Role = "user") {
  return {
    get:    <T>(path: string, opts?: FetchOpts) => request<T>(path, { ...opts, method: "GET"    }, bearerHeaders(role)),
    post:   <T>(path: string, body: unknown, opts?: FetchOpts) => request<T>(path, { ...opts, method: "POST",   body }, bearerHeaders(role)),
    put:    <T>(path: string, body: unknown, opts?: FetchOpts) => request<T>(path, { ...opts, method: "PUT",    body }, bearerHeaders(role)),
    patch:  <T>(path: string, body: unknown, opts?: FetchOpts) => request<T>(path, { ...opts, method: "PATCH",  body }, bearerHeaders(role)),
    delete: <T>(path: string, opts?: FetchOpts) => request<T>(path, { ...opts, method: "DELETE" }, bearerHeaders(role)),
  };
}

/** Standard envelope returned by every Mileora CI3 endpoint. */
export type Envelope<T> = { data: T; meta?: Record<string, unknown> };
