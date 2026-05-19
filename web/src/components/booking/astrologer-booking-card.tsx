"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, Video, Phone, MessageCircle } from "lucide-react";
import { CouponField, type CouponApplied } from "./coupon-field";
import { formatINR } from "@/lib/mock-data";

type Mode = "Video" | "Voice" | "Chat";
const SLOTS = ["10:30 AM", "12:00 PM", "2:30 PM", "4:00 PM", "6:30 PM", "8:00 PM"];

export function AstrologerBookingCard({
  pricePaise,
  sessionMinutes,
  astrologerName,
}: {
  pricePaise: number;
  sessionMinutes: number;
  astrologerName: string;
}) {
  const [mode, setMode] = useState<Mode>("Video");
  const [slot, setSlot] = useState<string | null>(null);
  const [coupon, setCoupon] = useState<CouponApplied>(null);
  const finalPaise = coupon ? coupon.finalPaise : pricePaise;

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 shadow-[var(--shadow-glow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Book a session</p>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{formatINR(finalPaise)}</p>
        {coupon && (
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text-muted)] line-through">
            {formatINR(pricePaise)}
          </p>
        )}
      </div>
      <p className="text-sm text-[color:var(--color-text-muted)]">
        <Clock className="mr-1 inline h-3.5 w-3.5 -translate-y-px" aria-hidden /> {sessionMinutes}-minute session
      </p>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {[{ Icon: Video, label: "Video" as const }, { Icon: Phone, label: "Voice" as const }, { Icon: MessageCircle, label: "Chat" as const }].map(({ Icon, label }) => (
          <button
            key={label}
            type="button"
            onClick={() => setMode(label)}
            className={`flex flex-col items-center gap-1 rounded-lg border py-3 text-xs transition-colors ${
              mode === label
                ? "border-[color:var(--color-gold-500)] bg-[color:var(--color-gold-500)]/10 text-[color:var(--color-gold-100)]"
                : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]"
            }`}
            aria-pressed={mode === label}
          >
            <Icon className={`h-4 w-4 ${mode === label ? "text-[color:var(--color-gold-300)]" : "text-[color:var(--color-gold-300)]"}`} aria-hidden /> {label}
          </button>
        ))}
      </div>

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

      <div className="mt-5 border-t border-[color:var(--color-border)]/60 pt-4">
        <CouponField amountPaise={pricePaise} bookingType="consultation" onChange={setCoupon} />
      </div>

      <Link
        href="#"
        className="mt-6 block rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-center text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
        aria-label={`Continue booking ${astrologerName} for ${formatINR(finalPaise)}`}
      >
        Continue · {formatINR(finalPaise)}
      </Link>
      <p className="mt-3 text-center text-xs text-[color:var(--color-text-muted)]">Free cancellation up to 1 hour before</p>
    </div>
  );
}
