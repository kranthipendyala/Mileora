"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";

type Coupon = {
  id: number;
  code: string;
  discount_type: "flat" | "percent";
  discount_value: number;
  applies_to: "all" | "consultation" | "puja" | "report";
  min_amount_paise: number;
  usage_limit: number | null;
  used: number;
  starts_at: string | null;
  expires_at: string | null;
  is_active: 0 | 1;
};

const MOCK: Coupon[] = [
  { id: 1, code: "MILEORA50", discount_type: "percent", discount_value: 50, applies_to: "all",         min_amount_paise: 50000, usage_limit: 1000, used: 412, starts_at: null, expires_at: "2026-06-30", is_active: 1 },
  { id: 2, code: "NEWUSER",   discount_type: "flat",    discount_value: 20000, applies_to: "all",       min_amount_paise: 30000, usage_limit: null, used: 184, starts_at: null, expires_at: null,        is_active: 1 },
  { id: 3, code: "WELCOME",   discount_type: "percent", discount_value: 15, applies_to: "consultation", min_amount_paise: 0,     usage_limit: 5000, used: 1820, starts_at: null, expires_at: null,        is_active: 1 },
  { id: 4, code: "DIWALI24",  discount_type: "percent", discount_value: 25, applies_to: "puja",         min_amount_paise: 100000, usage_limit: 500, used: 500, starts_at: "2024-10-20", expires_at: "2024-11-05", is_active: 0 },
];

function fmtINR(p: number) { return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p / 100); }

export default function AdminCoupons() {
  const [coupons] = useState<Coupon[]>(MOCK);

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Coupons</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Promo codes — flat / percentage, with caps, scopes, and validity windows.</p>
        </div>
        <button type="button" className="inline-flex items-center gap-1.5 rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400">
          <Plus className="h-3.5 w-3.5" aria-hidden /> New coupon
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Applies to</th>
              <th className="px-4 py-3">Min order</th>
              <th className="px-4 py-3">Used</th>
              <th className="px-4 py-3">Expires</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-[color:var(--color-gold-100)]">{c.code}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">
                  {c.discount_type === "percent" ? `${c.discount_value}%` : fmtINR(c.discount_value)}
                </td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{c.applies_to}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{c.min_amount_paise ? fmtINR(c.min_amount_paise) : "—"}</td>
                <td className="px-4 py-3 text-[color:var(--color-text)]">{c.used} / {c.usage_limit ?? "∞"}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{c.expires_at ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    c.is_active === 1 ? "bg-emerald-400/10 text-emerald-200" : "bg-[color:var(--color-bg)] text-[color:var(--color-text-muted)]"
                  }`}>{c.is_active === 1 ? "active" : "inactive"}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button type="button" className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Edit">
                      <Edit2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button type="button" className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-rose-400/10 hover:text-rose-300" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-[color:var(--color-text-muted)]">
        Demo data — wire <code>/api/v1/admin/coupons</code> (CRUD endpoints to add) for live data.
      </p>
    </>
  );
}
