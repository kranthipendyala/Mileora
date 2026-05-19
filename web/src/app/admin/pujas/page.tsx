"use client";

import Link from "next/link";
import { PUJAS } from "@/lib/mock-data";

export default function AdminPujas() {
  return (
    <>
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Pujas</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Manage the puja catalog — featured, pricing, schedules.</p>
        </div>
        <button type="button" className="rounded-md bg-rose-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-rose-400">
          + New puja
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Puja</th>
              <th className="px-4 py-3">Temple</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {PUJAS.map((p) => (
              <tr key={p.slug} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 text-[color:var(--color-text)]">{p.name}</td>
                <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{p.temple}, {p.city}</td>
                <td className="px-4 py-3 text-[color:var(--color-gold-100)]">₹{Math.round(p.pricePaise / 100)}</td>
                <td className="px-4 py-3">
                  {p.featured ? <span className="rounded-full bg-[color:var(--color-gold-500)]/10 px-2 py-0.5 text-xs text-[color:var(--color-gold-100)]">featured</span> : <span className="text-xs text-[color:var(--color-text-muted)]">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/puja/${p.slug}`} className="text-xs text-[color:var(--color-gold-100)] underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
