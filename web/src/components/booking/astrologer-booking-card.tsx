"use client";

import { useState } from "react";
import Link from "next/link";
import { Video, Phone, MessageCircle, FileText, MapPin, Flame } from "lucide-react";
import { CouponField, type CouponApplied } from "./coupon-field";
import { formatINR } from "@/lib/mock-data";
import type { GuideService } from "@/lib/services";

const SLOTS = ["10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "6:30 PM", "8:00 PM"];

const MODE_ICON: Record<GuideService["delivery_mode"], React.ComponentType<{ className?: string }>> = {
  video:         Video,
  voice:         Phone,
  chat:          MessageCircle,
  in_person:     MapPin,
  async_report:  FileText,
  online_puja:   Flame,
};

const MODE_LABEL: Record<GuideService["delivery_mode"], string> = {
  video:         "Video call",
  voice:         "Voice call",
  chat:          "Chat",
  in_person:     "In person",
  async_report:  "Async PDF",
  online_puja:   "Live puja stream",
};

export function AstrologerBookingCard({
  services,
  astrologerName,
}: {
  services: GuideService[];
  astrologerName: string;
}) {
  const [selectedId, setSelectedId] = useState<number | null>(services[0]?.id ?? null);
  const [slot, setSlot] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<CouponApplied>(null);

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-6 text-center">
        <p className="text-sm text-[color:var(--color-text-muted)]">
          {astrologerName} hasn't listed any services yet.
        </p>
        <Link
          href="/astrologers"
          className="mt-4 inline-block text-sm text-[color:var(--color-gold-100)] hover:underline"
        >
          Browse other guides →
        </Link>
      </div>
    );
  }

  const selected = services.find((s) => s.id === selectedId) ?? services[0];
  const basePaise = selected.discounted_price_paise ?? selected.base_price_paise;
  const finalPaise = coupon ? coupon.finalPaise : basePaise;
  const isAsync = selected.delivery_mode === "async_report";

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 shadow-[var(--shadow-glow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">
        Pick a service
      </p>

      {/* Service picker */}
      <ul className="mt-3 space-y-2" role="radiogroup" aria-label="Available services">
        {services.map((s) => {
          const Icon = MODE_ICON[s.delivery_mode];
          const active = s.id === selectedId;
          const price = s.discounted_price_paise ?? s.base_price_paise;
          const isDiscounted = s.discounted_price_paise && s.discounted_price_paise < s.base_price_paise;
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => { setSelectedId(s.id); setSlot(null); }}
                aria-pressed={active}
                role="radio"
                aria-checked={active}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${
                  active
                    ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/40 hover:border-[color:var(--color-gold-500)]/60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <Icon className={`h-3.5 w-3.5 ${active ? "text-[color:var(--color-gold-300)]" : "text-[color:var(--color-text-muted)]"}`} aria-hidden />
                      <span className={`text-[10px] uppercase tracking-wider ${active ? "text-[color:var(--color-gold-100)]" : "text-[color:var(--color-text-muted)]"}`}>
                        {s.category_name}
                      </span>
                    </div>
                    <p className={`mt-1 text-sm font-medium ${active ? "text-[color:var(--color-text)]" : "text-[color:var(--color-text)]/90"}`}>
                      {s.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[color:var(--color-text-muted)]">
                      {s.duration_minutes} min · {MODE_LABEL[s.delivery_mode]}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {isDiscounted && (
                      <p className="text-[10px] text-[color:var(--color-text-muted)] line-through">
                        {formatINR(s.base_price_paise)}
                      </p>
                    )}
                    <p className={`text-sm font-medium ${active ? "text-gradient-gold" : "text-[color:var(--color-text)]"}`}>
                      {formatINR(price)}
                    </p>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Slot picker (hidden for async delivery) */}
      {!isAsync && (
        <div className="mt-5 space-y-2 text-sm">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Pick a time today</p>
          <div className="grid grid-cols-3 gap-2">
            {SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSlot(t)}
                className={`rounded-md border py-2 text-xs transition-colors ${
                  slot === t
                    ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"
                    : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)] hover:text-[color:var(--color-gold-100)]"
                }`}
                aria-pressed={slot === t}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Coupon */}
      <div className="mt-5 border-t border-[color:var(--color-border)]/60 pt-4">
        <CouponField amountPaise={basePaise} bookingType="consultation" onChange={setCoupon} />
      </div>

      {/* Total */}
      <div className="mt-5 flex items-baseline justify-between border-t border-[color:var(--color-border)]/60 pt-4">
        <span className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">Total</span>
        <div className="text-right">
          {coupon && coupon.finalPaise < basePaise && (
            <p className="text-xs text-[color:var(--color-text-muted)] line-through">{formatINR(basePaise)}</p>
          )}
          <p className="font-[family-name:var(--font-cormorant)] text-4xl text-gradient-gold">{formatINR(finalPaise)}</p>
        </div>
      </div>

      <Link
        href="#"
        className="mt-5 block rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-center text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
        aria-label={`Continue booking "${selected.name}" with ${astrologerName} for ${formatINR(finalPaise)}`}
      >
        {isAsync ? "Order report" : "Continue"} · {formatINR(finalPaise)}
      </Link>
      <p className="mt-3 text-center text-xs text-[color:var(--color-text-muted)]">
        {isAsync ? "Delivered within 24 hours" : "Free cancellation up to 1 hour before"}
      </p>

      {!isAsync && slot && (
        <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-[color:var(--color-gold-300)]">
          Selected · {slot}
        </p>
      )}
    </div>
  );
}
