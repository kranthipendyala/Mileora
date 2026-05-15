import type { Metadata } from "next";
import { Mail, MessageCircle, Phone, MapPin, Clock } from "lucide-react";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, breadcrumbJsonLd } from "@/components/seo/json-ld";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = buildMetadata({
  title: "Contact Mileora",
  description:
    "Reach the Mileora team — by email, WhatsApp, phone, or the form below. Real humans on chat 24×7, never bots.",
  path: "/contact",
});

const CHANNELS = [
  { Icon: Mail, label: "Email", value: "info@magnusconference.com", href: "mailto:info@magnusconference.com" },
  { Icon: MessageCircle, label: "WhatsApp", value: "+91 98XXX XXXXX", href: "https://wa.me/919800000000" },
  { Icon: Phone, label: "Phone", value: "+91 98XXX XXXXX", href: "tel:+919800000000" },
];

export default function Contact() {
  return (
    <div className="bg-cosmic">
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />

      <section className="bg-grain relative isolate overflow-hidden px-4 pt-20 pb-16 sm:px-6 lg:px-8 lg:pt-24">
        <div className="absolute -top-40 left-1/2 -z-10 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(212,160,23,0.18),transparent)]" />
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">We're here to help</p>
          <h1 className="mt-3 font-[family-name:var(--font-cormorant)] text-5xl leading-tight tracking-tight sm:text-6xl">
            Talk to a <span className="text-gradient-gold">real human</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-[color:var(--color-text-muted)]">
            Bookings, refunds, technical issues, partnership enquiries — we read and respond to every message.
          </p>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            {/* Channels */}
            <div className="space-y-4">
              {CHANNELS.map(({ Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center gap-4 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5 transition-colors hover:border-[color:var(--color-gold-500)]/60"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-bg)]/80 ring-1 ring-[color:var(--color-gold-500)]/30">
                    <Icon className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
                  </div>
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</p>
                    <p className="mt-0.5 text-[color:var(--color-text)]">{value}</p>
                  </div>
                </a>
              ))}

              <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Office</p>
                    <p className="mt-1 text-[color:var(--color-text)]">
                      Mileora, c/o Magnus Conference<br />
                      Anna Salai, Chennai 600 002<br />
                      Tamil Nadu, India
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex gap-3">
                  <Clock className="mt-1 h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Support hours</p>
                    <p className="mt-1 text-[color:var(--color-text)]">Chat 24×7 · Phone 8am–10pm IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-7 shadow-[var(--shadow-glow)] sm:p-9">
              <h2 className="font-[family-name:var(--font-cormorant)] text-3xl">Send us a message</h2>
              <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">We typically reply within 2 hours during business hours.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
