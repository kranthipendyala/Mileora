import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "@/styles/globals.css";
import { buildMetadata, SITE } from "@/lib/seo";
import { JsonLd, orgJsonLd, websiteJsonLd } from "@/components/seo/json-ld";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PublicChrome } from "@/components/layout/public-chrome";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = buildMetadata();

export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="min-h-dvh bg-cosmic relative overflow-x-hidden">
        <JsonLd data={[orgJsonLd(), websiteJsonLd()]} />
        <PublicChrome header={<Header />} footer={<Footer />}>
          {children}
        </PublicChrome>
      </body>
    </html>
  );
}
