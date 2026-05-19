"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { CouponField, type CouponApplied } from "./coupon-field";
import { formatINR } from "@/lib/mock-data";

export function PujaBookingCard({ pricePaise, pujaName }: { pricePaise: number; pujaName: string }) {
  const [coupon, setCoupon] = useState<CouponApplied>(null);
  const finalPaise = coupon ? coupon.finalPaise : pricePaise;

  return (
    <div className="rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-6 shadow-[var(--shadow-glow)]">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">Book this puja</p>
      <div className="mt-2 flex items-baseline gap-3">
        <p className="font-[family-name:var(--font-cormorant)] text-5xl text-gradient-gold">{formatINR(finalPaise)}</p>
        {coupon && (
          <p className="font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text-muted)] line-through">
            {formatINR(pricePaise)}
          </p>
        )}
      </div>
      <p className="text-sm text-[color:var(--color-text-muted)]">includes prasad delivery</p>

      <div className="mt-6 space-y-3">
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Choose date</span>
          <div className="mt-1.5 flex items-center gap-2 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5">
            <Calendar className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden />
            <input type="date" className="flex-1 bg-transparent text-sm text-[color:var(--color-text)] outline-none" />
          </div>
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Your name (sankalpam)</span>
          <input
            type="text"
            placeholder="Full name as per official ID"
            className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">Gotra (optional)</span>
          <input
            type="text"
            placeholder="e.g. Bharadwaja"
            className="mt-1.5 w-full rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2.5 text-sm text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
          />
        </label>
      </div>

      <div className="mt-5 border-t border-[color:var(--color-border)]/60 pt-4">
        <CouponField amountPaise={pricePaise} bookingType="puja" onChange={setCoupon} />
      </div>

      <Link
        href="#"
        className="mt-6 block rounded-md bg-[color:var(--color-gold-500)] px-4 py-3 text-center text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
        aria-label={`Book ${pujaName} for ${formatINR(finalPaise)}`}
      >
        Book puja · {formatINR(finalPaise)}
      </Link>
      <p className="mt-3 text-center text-xs text-[color:var(--color-text-muted)]">Secure checkout via Razorpay</p>
    </div>
  );
}
