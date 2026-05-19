/**
 * Vercel serverless function — single catch-all proxy in front of the
 * CodeIgniter 3 origin. Adds:
 *   - uniform CORS (browser POSTs from mileora.com without preflight headaches)
 *   - GET caching at the Vercel edge for read-heavy endpoints
 *   - JWT + server-key header forwarding
 *   - Strips hop-by-hop headers
 *
 * Rewrite is configured in vercel.json: /api/* → /api/proxy?path=*
 *
 * Required env vars (set in Vercel project settings):
 *   ORIGIN_URL           e.g. https://api.mileora.com/api/v1
 *   ALLOWED_ORIGINS      e.g. https://mileora.com,https://www.mileora.com
 *   MILEORA_SERVER_KEY   server-to-server key matching CI3's MILEORA_SERVER_API_KEY
 */

import type { VercelRequest, VercelResponse } from "@vercel/node";

const ORIGIN_URL = process.env.ORIGIN_URL ?? "";
const ALLOWED = (process.env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const SERVER_KEY = process.env.MILEORA_SERVER_KEY ?? "";

// Endpoints that are safe to cache at the edge (public reads only)
const CACHE_PATHS: Array<{ match: RegExp; sMaxAge: number; swr: number }> = [
  { match: /^astrologers(\?.*)?$/,     sMaxAge: 300,  swr: 3600 },
  { match: /^astrologers\/[^/]+$/,     sMaxAge: 600,  swr: 86400 },
  { match: /^pujas(\?.*)?$/,           sMaxAge: 600,  swr: 86400 },
  { match: /^pujas\/[^/]+$/,           sMaxAge: 600,  swr: 86400 },
  { match: /^cities(\?.*)?$/,          sMaxAge: 3600, swr: 86400 },
  { match: /^cities\/[^/]+$/,          sMaxAge: 3600, swr: 86400 },
  { match: /^search\/(astrologers|pujas|articles)(\?.*)?$/, sMaxAge: 60, swr: 300 },
];

const HOP_BY_HOP = new Set([
  "connection", "keep-alive", "proxy-authenticate", "proxy-authorization",
  "te", "trailer", "transfer-encoding", "upgrade",
]);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ---- CORS ----
  const origin = (req.headers.origin as string) || "";
  if (origin && ALLOWED.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Mileora-Key");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (!ORIGIN_URL) {
    res.status(500).json({ error: "ORIGIN_URL not configured" });
    return;
  }

  const path = String(req.query.path ?? "");
  const search = req.url?.includes("?") ? "?" + req.url.split("?")[1] : "";
  // Strip our own ?path= from the forwarded query string
  const forwardedSearch = search.replace(/(\?|&)path=[^&]*/, "").replace(/^&/, "?") || "";

  const target = `${ORIGIN_URL.replace(/\/$/, "")}/${path}${forwardedSearch}`;

  const forwardHeaders: Record<string, string> = {
    "Content-Type": (req.headers["content-type"] as string) || "application/json",
    Accept: "application/json",
  };
  const auth = req.headers.authorization;
  if (typeof auth === "string") forwardHeaders.Authorization = auth;

  // If the caller is a Vercel server function (no Authorization), attach the
  // server-to-server key. Browser fetches that need JWT will already include
  // Authorization above.
  if (!forwardHeaders.Authorization && SERVER_KEY) {
    forwardHeaders["X-Mileora-Key"] = SERVER_KEY;
  }

  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = JSON.stringify(req.body ?? {});
  }

  try {
    const upstream = await fetch(target, {
      method: req.method,
      headers: forwardHeaders,
      body,
    });

    // Pass through status + body
    res.status(upstream.status);

    upstream.headers.forEach((value, key) => {
      if (HOP_BY_HOP.has(key.toLowerCase())) return;
      if (key.toLowerCase() === "content-encoding") return; // node will re-encode
      res.setHeader(key, value);
    });

    // Add edge cache for whitelisted paths
    if (req.method === "GET") {
      const match = CACHE_PATHS.find((c) => c.match.test(path + forwardedSearch));
      if (match) {
        res.setHeader(
          "Cache-Control",
          `public, s-maxage=${match.sMaxAge}, stale-while-revalidate=${match.swr}`
        );
      }
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.send(buf);
  } catch (err) {
    res.status(502).json({
      error: "Upstream unreachable",
      detail: err instanceof Error ? err.message : String(err),
    });
  }
}
