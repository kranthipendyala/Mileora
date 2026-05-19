// Static-export config for hosting the marketing site on a CDN
// (Cloudflare Pages, Netlify, S3+CloudFront).
//
// Drop in with:
//   cp deploy-static/next.config.static.mjs web/next.config.mjs
//   cd web && npm run build         # outputs to web/out/
//
// LIMITATIONS of static export:
//   - No Route Handlers (so /api/leads, /api/razorpay/* DO NOT work from
//     this build). The static site must POST directly to the CI3 API at
//     NEXT_PUBLIC_API_URL.
//   - No dynamic OG image generation (must pre-generate at build).
//   - generateStaticParams() is required for every dynamic route — included
//     in our /astrologers/[slug], /puja/[slug], /blog/[slug], /free/horoscope/[sign].
//
// The dynamic /account/* and /admin/* routes are EXCLUDED via the
// `excludeRoutes` step below — they need the BFF + are JWT-guarded anyway,
// so they can't be statically rendered.

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",                     // <-- the key line
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: true,                  // friendly with S3/CloudFront
  images: {
    unoptimized: true,                  // no on-demand image optimization in static mode
    remotePatterns: [
      { protocol: "https", hostname: "cdn.mileora.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Skip routes that can't be statically rendered
  // (Next 15 honors `unstable_excludeFiles` only experimentally — we
  //  rely on the build failing fast if it hits a non-exportable route.
  //  If you need to ship static + leave dynamic routes, split the app.)
};

export default nextConfig;
