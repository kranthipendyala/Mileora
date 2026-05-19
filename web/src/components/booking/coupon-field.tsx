"use client";

import { useState } from "react";
import { Tag, X, Check } from "lucide-react";
import { formatINR } from "@/lib/mock-data";

type QuoteOk = { ok: true; code: string; discount_paise: number; final_paise: number };
type QuoteErr = { ok: false; reason: string };
export type CouponApplied = { code: string; discountPaise: number; finalPaise: number } | null;

// TODO: replace mockQuote with fetch('/api/coupons/quote', { method: 'POST', body: JSON.stringify({code, amount_paise, booking_type}) })
async function mockQuote(code: string, amount_paise: number, _booking_type: string): Promise<QuoteOk | QuoteErr> {
  await new Promise((r) => setTimeout(r, 350));
  const c = code.toUpperCase().trim();
  if (c === "MILEORA50") {
    const discount = Math.min(Math.floor(amount_paise * 0.5), 50000); // 50% off, capped at ₹500
    return { ok: true, code: c, discount_paise: discount, final_paise: amount_paise - discount };
  }
  if (c === "NEWUSER") {
    const discount = Math.min(20000, amount_paise);
    return { ok: true, code: c, discount_paise: discount, final_paise: amount_paise - discount };
  }
  if (c === "WELCOME") {
    const discount = Math.min(Math.floor(amount_paise * 0.15), 30000);
    return { ok: true, code: c, discount_paise: discount, final_paise: amount_paise - discount };
  }
  return { ok: false, reason: "CODE_INVALID" };
}

const REASON_TEXT: Record<string, string> = {
  CODE_INVALID:   "That code isn't valid",
  EXPIRED:        "This coupon has expired",
  NOT_YET_ACTIVE: "This coupon isn't active yet",
  MIN_AMOUNT:     "Booking amount is below the minimum for this coupon",
  TYPE_MISMATCH:  "This coupon doesn't apply to this kind of booking",
  LIMIT_REACHED:  "This coupon has been used its maximum number of times",
};

export function CouponField({
  amountPaise,
  bookingType,
  onChange,
}: {
  amountPaise: number;
  bookingType: "consultation" | "puja" | "report";
  onChange: (applied: CouponApplied) => void;
}) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState<CouponApplied>(null);
  const [error, setError] = useState<string | null>(null);

  async function apply(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || busy) return;
    setBusy(true);
    setError(null);
    const q = await mockQuote(code.trim(), amountPaise, bookingType);
    setBusy(false);
    if (q.ok) {
      const a = { code: q.code, discountPaise: q.discount_paise, finalPaise: q.final_paise };
      setApplied(a);
      onChange(a);
    } else {
      setError(REASON_TEXT[q.reason] ?? "Coupon not accepted");
    }
  }

  function remove() {
    setApplied(null);
    setCode("");
    setError(null);
    onChange(null);
  }

  if (applied) {
    return (
      <div className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-300" aria-hidden />
            <span className="font-mono text-sm text-emerald-200">{applied.code}</span>
            <span className="text-xs text-[color:var(--color-text-muted)]">
              − {formatINR(applied.discountPaise)} off
            </span>
          </div>
          <button
            type="button"
            onClick={remove}
            className="rounded p-1 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]"
            aria-label="Remove coupon"
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-gold-100)] hover:underline"
      >
        <Tag className="h-3.5 w-3.5" aria-hidden /> Have a coupon?
      </button>
    );
  }

  return (
    <form onSubmit={apply} className="space-y-2">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
          Coupon code
        </span>
        <div className="mt-1.5 flex gap-2">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="MILEORA50"
            className="flex-1 rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-2 text-sm uppercase tracking-wider text-[color:var(--color-text)] outline-none focus:border-[color:var(--color-gold-500)]"
            autoFocus
          />
          <button
            type="submit"
            disabled={busy || !code.trim()}
            className="rounded-md bg-[color:var(--color-gold-500)] px-3 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-50"
          >
            {busy ? "…" : "Apply"}
          </button>
        </div>
      </label>
      {error && <p className="text-xs text-rose-300">{error}</p>}
      <p className="text-[10px] text-[color:var(--color-text-muted)]">
        Try: <span className="font-mono">MILEORA50</span> · <span className="font-mono">NEWUSER</span> · <span className="font-mono">WELCOME</span>
      </p>
    </form>
  );
}
