import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, Flame, Calculator, Home, Sun, ArrowRight } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = buildMetadata({
  title: "Book a Service — What would you like guidance on?",
  description: "Book an astrologer, online puja, numerology reading, vasthu audit, or jothisyam consultation on Mileora.",
  path: "/book",
});

const OPTIONS = [
  { Icon: Sparkles, title: "Talk to an astrologer", desc: "Vedic, jothisyam, KP — live consultation by call or video.", href: "/astrologers", price: "from ₹599" },
  { Icon: Flame, title: "Book an online puja", desc: "Authentic temple pujas, live streamed in your name.", href: "/puja", price: "from ₹511" },
  { Icon: Calculator, title: "Numerology reading", desc: "Decode your life path, destiny, lucky numbers.", href: "/numerology", price: "from ₹799" },
  { Icon: Home, title: "Vasthu audit", desc: "Compass-based audit of your home or office.", href: "/vasthu", price: "from ₹999" },
  { Icon: Sun, title: "Tamil jothisyam", desc: "South Indian Vedic reading in Tamil or English.", href: "/jothisyam", price: "from ₹999" },
];

export default function BookLanding() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Book", path: "/book" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-12 sm:px-6 lg:px-8 lg:pt-28">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Book a Mileora service</p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            What would you like <span className="text-gradient-gold">guidance on?</span>
          </h1>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-4">
          {OPTIONS.map(({ Icon, title, desc, href, price }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-5 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 transition-all hover:border-[color:var(--color-gold-500)]/60 sm:p-6"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[color:var(--color-bg)]/80 ring-1 ring-[color:var(--color-gold-500)]/30">
                <Icon className="h-6 w-6 text-[color:var(--color-gold-300)]" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-text)]">{title}</h3>
                  <span className="hidden text-sm text-[color:var(--color-gold-100)] sm:inline">{price}</span>
                </div>
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">{desc}</p>
              </div>
              <ArrowRight className="h-5 w-5 shrink-0 text-[color:var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[color:var(--color-gold-100)]" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
