/**
 * Thin fetch wrapper for talking to the CodeIgniter 3 REST API.
 *
 * Use `apiPublic` from Server Components for unauthenticated GETs (cached by Next).
 * Use `apiServer` from Route Handlers for server-side calls that need the server key
 * (e.g. lead capture, payment verify) — these never run in the browser.
 */

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
