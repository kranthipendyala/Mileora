"use client";

import { useState } from "react";
import { Star, EyeOff, Flag, Eye } from "lucide-react";

type Review = {
  id: number;
  type: "astrologer" | "puja" | "report";
  target_name: string;
  user_name: string;
  rating: number;
  title?: string;
  body: string;
  status: "published" | "hidden" | "flagged";
  created_at: string;
};

const MOCK: Review[] = [
  { id: 1, type: "astrologer", target_name: "Pandit Suresh Iyer", user_name: "Anitha R.", rating: 5, title: "Pinpoint accurate", body: "He predicted the exact month my career would shift. It happened. Worth every rupee.", status: "published", created_at: "2026-05-15" },
  { id: 2, type: "puja", target_name: "Kashi Rudrabhishek", user_name: "Ravi K.", rating: 5, body: "Live stream was crystal clear. Felt deeply moving.", status: "published", created_at: "2026-05-14" },
  { id: 3, type: "astrologer", target_name: "Dr. Meera Shastri", user_name: "Meera S.", rating: 4, body: "Calm, evidence-led reading. No drama.", status: "published", created_at: "2026-05-13" },
  { id: 4, type: "astrologer", target_name: "Acharya Rajesh Kumar", user_name: "Vikram T.", rating: 1, title: "Felt rushed", body: "Reading was too generic. Didn't address my specific question.", status: "flagged", created_at: "2026-05-12" },
  { id: 5, type: "puja", target_name: "Mahalakshmi Puja", user_name: "Sandhya R.", rating: 5, body: "Prasad arrived in 3 days, beautifully packed.", status: "hidden", created_at: "2026-05-10" },
];

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(MOCK);
  const [filter, setFilter] = useState<"all" | Review["status"]>("all");

  const visible = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);

  function setStatus(id: number, status: Review["status"]) {
    setReviews((all) => all.map((r) => (r.id === id ? { ...r, status } : r)));
    // TODO: apiUser('admin').post(`/reviews/${id}/hide`) or .put(`/reviews/${id}`, { status })
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Hide spam, address flagged reviews, monitor sentiment.</p>
        </div>
        <div className="flex gap-1">
          {(["all", "published", "flagged", "hidden"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs ${
                filter === f
                  ? "bg-rose-500 text-white"
                  : "border border-[color:var(--color-border)] bg-[color:var(--color-surface)] text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <ul className="mt-8 space-y-3">
        {visible.length === 0 && (
          <li className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-text-muted)]">
            No reviews match this filter.
          </li>
        )}
        {visible.map((r) => (
          <li key={r.id} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-[color:var(--color-text)]">{r.user_name}</span>
                  <span className="text-[color:var(--color-text-muted)]">on</span>
                  <span className="text-[color:var(--color-text)]">{r.target_name}</span>
                  <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-2 py-0.5 text-[10px] uppercase text-[color:var(--color-text-muted)]">{r.type}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] uppercase ${
                    r.status === "published" ? "bg-emerald-400/10 text-emerald-200" :
                    r.status === "flagged" ? "bg-rose-400/10 text-rose-200" :
                    "bg-[color:var(--color-bg)] text-[color:var(--color-text-muted)]"
                  }`}>{r.status}</span>
                </div>
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-[color:var(--color-gold-300)] text-[color:var(--color-gold-300)]" aria-hidden />
                  ))}
                  {Array.from({ length: 5 - r.rating }).map((_, i) => (
                    <Star key={`e${i}`} className="h-3.5 w-3.5 text-[color:var(--color-border)]" aria-hidden />
                  ))}
                </div>
                {r.title && <p className="mt-2 font-medium text-[color:var(--color-text)]">{r.title}</p>}
                <p className="mt-1 text-sm text-[color:var(--color-text)]/90">{r.body}</p>
                <p className="mt-2 text-[10px] uppercase tracking-wider text-[color:var(--color-text-muted)]">{r.created_at}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                {r.status !== "published" && (
                  <button type="button" onClick={() => setStatus(r.id, "published")} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 p-1.5 text-emerald-300 hover:border-emerald-400/40" aria-label="Publish">
                    <Eye className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
                {r.status !== "hidden" && (
                  <button type="button" onClick={() => setStatus(r.id, "hidden")} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 p-1.5 text-[color:var(--color-text-muted)] hover:border-[color:var(--color-gold-500)]" aria-label="Hide">
                    <EyeOff className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
                {r.status !== "flagged" && (
                  <button type="button" onClick={() => setStatus(r.id, "flagged")} className="rounded-md border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 p-1.5 text-rose-300 hover:border-rose-400/40" aria-label="Flag">
                    <Flag className="h-3.5 w-3.5" aria-hidden />
                  </button>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
