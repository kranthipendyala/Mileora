"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Bell, MessageCircle, MapPin, Sparkles, ArrowRight } from "lucide-react";
import { MOCK_NOTIFICATIONS, MOCK_ADDRESSES, MOCK_THREADS } from "@/lib/mock-account";
import { ASTROLOGERS, formatINR } from "@/lib/mock-data";

// TODO: replace with apiUser('user').get<Envelope<...>>('/dashboard')
function useDashboard() {
  return {
    upcoming: [
      { id: "MIL-1042", title: "Vedic reading with Pandit Suresh", at: "Today, 4:30 PM", price: "₹999" },
      { id: "MIL-1041", title: "Kashi Rudrabhishek puja",          at: "Tomorrow, 8:00 AM", price: "₹2,511" },
    ],
    unread_notifications: MOCK_NOTIFICATIONS.filter((n) => !n.read_at).length,
    unread_messages: MOCK_THREADS.reduce((s, t) => s + t.unread, 0),
    saved_addresses: MOCK_ADDRESSES.length,
    suggested: ASTROLOGERS.slice(0, 3),
  };
}

export default function AccountOverview() {
  const d = useDashboard();

  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">
        Namaste, <span className="text-gradient-gold">Anitha</span>
      </h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Everything about your Mileora journey, in one place.</p>

      {/* Stat strip */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard Icon={Calendar} label="Upcoming bookings" value={String(d.upcoming.length)} />
        <StatCard Icon={Bell} label="Unread notifications" value={String(d.unread_notifications)} accent={d.unread_notifications > 0} />
        <StatCard Icon={MessageCircle} label="Unread messages" value={String(d.unread_messages)} accent={d.unread_messages > 0} />
        <StatCard Icon={MapPin} label="Saved addresses" value={String(d.saved_addresses)} />
      </div>

      {/* Upcoming */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Upcoming</h2>
          <Link href="/account/bookings" className="text-sm text-[color:var(--color-gold-100)] hover:underline">
            All bookings →
          </Link>
        </div>
        <div className="mt-4 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
          {d.upcoming.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-[color:var(--color-text-muted)]">No upcoming bookings.</p>
          ) : (
            d.upcoming.map((b) => (
              <Link key={b.id} href="#" className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[color:var(--color-bg)]/40">
                <div className="min-w-0">
                  <p className="truncate text-[color:var(--color-text)]">{b.title}</p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">{b.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[color:var(--color-gold-100)]">{b.at}</p>
                  <p className="text-xs text-[color:var(--color-text-muted)]">{b.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      {/* Suggested guides */}
      <section className="mt-10">
        <div className="flex items-end justify-between">
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">Suggested for you</h2>
          <Link href="/astrologers" className="text-sm text-[color:var(--color-gold-100)] hover:underline">
            Browse all →
          </Link>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {d.suggested.map((a) => (
            <Link
              key={a.slug}
              href={`/astrologers/${a.slug}`}
              className="group flex gap-3 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gold-500)]/60"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
                <Image src={a.photo} alt={a.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-[color:var(--color-text)]">{a.name}</p>
                <p className="truncate text-xs text-[color:var(--color-text-muted)]">{a.tagline}</p>
                <p className="mt-1 text-xs text-[color:var(--color-gold-100)]">{formatINR(a.pricePaise)} / session</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 self-center text-[color:var(--color-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[color:var(--color-gold-100)]" aria-hidden />
            </Link>
          ))}
        </div>
      </section>

      {/* CTAs */}
      <section className="mt-10 grid gap-4 md:grid-cols-2">
        <Link
          href="/free/kundli"
          className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 hover:border-[color:var(--color-gold-500)]/60"
        >
          <Sparkles className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
          <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl">Get your free kundli</p>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Vedic birth chart in 60 seconds.</p>
        </Link>
        <Link
          href="/account/chats"
          className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6 hover:border-[color:var(--color-gold-500)]/60"
        >
          <MessageCircle className="h-5 w-5 text-[color:var(--color-gold-300)]" aria-hidden />
          <p className="mt-3 font-[family-name:var(--font-cormorant)] text-2xl">Open your conversations</p>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            {d.unread_messages > 0 ? `${d.unread_messages} unread message${d.unread_messages > 1 ? "s" : ""}` : "All caught up"}
          </p>
        </Link>
      </section>
    </>
  );
}

function StatCard({ Icon, label, value, accent = false }: {
  Icon: React.ComponentType<{ className?: string }>; label: string; value: string; accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-5 ${
      accent ? "border-[color:var(--color-gold-500)]/40 bg-[color:var(--color-gold-500)]/5" : "border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60"
    }`}>
      <Icon className="h-5 w-5 text-[color:var(--color-gold-300)]" />
      <p className="mt-3 font-[family-name:var(--font-cormorant)] text-3xl text-[color:var(--color-text)]">{value}</p>
      <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{label}</p>
    </div>
  );
}
