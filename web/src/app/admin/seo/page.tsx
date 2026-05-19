"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, EyeOff } from "lucide-react";

type SeoPage = {
  id: number;
  path: string;
  meta_title: string;
  meta_description: string;
  noindex: 0 | 1;
  updated_at: string;
};

const INITIAL: SeoPage[] = [
  { id: 1, path: "/",            meta_title: "Mileora — Astrology, Numerology, Vasthu, Jothisyam & Puja", meta_description: "Trusted Vedic astrologers, free kundli, numerology readings, vasthu consultation, and online puja booking — all in one place.", noindex: 0, updated_at: "2026-05-01" },
  { id: 2, path: "/astrology",   meta_title: "Vedic Astrology — Birth Chart, Dasha & Remedies",            meta_description: "Authentic Vedic astrology readings on Mileora. Get your kundli analyzed, understand dasha periods, and receive personalized remedies from verified guides.", noindex: 0, updated_at: "2026-04-22" },
  { id: 3, path: "/puja",        meta_title: "Online Puja Booking — Authentic Rituals at Famous Temples", meta_description: "Book authentic pujas at India's most sacred temples — live stream, sankalpam in your name, prasad delivered. Kashi Vishwanath, Tirupati, Mahalakshmi & more.",  noindex: 0, updated_at: "2026-04-20" },
  { id: 4, path: "/free/kundli", meta_title: "Free Online Kundli — Vedic Birth Chart in 60 Seconds",      meta_description: "Get your free Vedic kundli (birth chart) with rasi, navamsa, current dasha period and personalized predictions. No payment, no signup needed.",                noindex: 0, updated_at: "2026-04-18" },
  { id: 5, path: "/admin/seo",   meta_title: "—",                                                          meta_description: "—",                                                                                                                                                                  noindex: 1, updated_at: "2026-04-01" },
];

export default function AdminSeo() {
  const [pages, setPages] = useState<SeoPage[]>(INITIAL);
  const [editing, setEditing] = useState<SeoPage | null>(null);
  const [show, setShow] = useState(false);

  function onSave(p: SeoPage) {
    setPages((all) => {
      const existing = all.find((x) => x.id === p.id);
      if (existing) return all.map((x) => (x.id === p.id ? p : x));
      return [...all, p];
    });
    setShow(false);
    setEditing(null);
    // TODO: apiUser('admin').put('/admin/seo', p)
  }
  function onDelete(id: number) {
    setPages((all) => all.filter((p) => p.id !== id));
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">SEO overrides</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Per-URL meta title, description, noindex toggle. Falls back to page defaults when no override is set.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShow(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden /> New override
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">Path</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {pages.map((p) => (
              <tr key={p.id} className="hover:bg-[color:var(--color-bg)]/40">
                <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-gold-100)]">{p.path}</td>
                <td className="px-4 py-3">
                  <p className="truncate text-[color:var(--color-text)]">{p.meta_title}</p>
                  <p className="mt-1 truncate text-xs text-[color:var(--color-text-muted)]">{p.meta_description}</p>
                </td>
                <td className="px-4 py-3">
                  {p.noindex === 1 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-xs text-rose-200">
                      <EyeOff className="h-3 w-3" aria-hidden /> noindex
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-[color:var(--color-text-muted)]">{p.updated_at}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex gap-1">
                    <button type="button" onClick={() => { setEditing(p); setShow(true); }} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Edit">
                      <Edit2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                    <button type="button" onClick={() => onDelete(p.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-rose-400/10 hover:text-rose-300" aria-label="Delete">
                      <Trash2 className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {show && (
        <SeoEditor
          initial={editing}
          nextId={Math.max(0, ...pages.map((p) => p.id)) + 1}
          onCancel={() => { setShow(false); setEditing(null); }}
          onSave={onSave}
        />
      )}
    </>
  );
}

function SeoEditor({ initial, nextId, onCancel, onSave }: {
  initial: SeoPage | null; nextId: number; onCancel: () => void; onSave: (p: SeoPage) => void;
}) {
  const [path, setPath] = useState(initial?.path ?? "");
  const [title, setTitle] = useState(initial?.meta_title ?? "");
  const [desc, setDesc] = useState(initial?.meta_description ?? "");
  const [noindex, setNoindex] = useState(initial?.noindex === 1);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!path.startsWith("/")) return;
    onSave({
      id: initial?.id ?? nextId,
      path,
      meta_title: title,
      meta_description: desc,
      noindex: noindex ? 1 : 0,
      updated_at: new Date().toISOString().slice(0, 10),
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-2xl border border-rose-400/30 bg-[color:var(--color-surface)] p-6 sm:p-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">{initial ? "Edit override" : "New SEO override"}</h2>
        <div className="mt-5 grid gap-4">
          <Field label="Path (must start with /)">
            <input value={path} onChange={(e) => setPath(e.target.value)} placeholder="/astrology" className="input" />
          </Field>
          <Field label="Meta title (50–60 chars ideal)">
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" maxLength={200} />
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{title.length} chars</p>
          </Field>
          <Field label="Meta description (150–160 chars ideal)">
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={3} className="input" />
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{desc.length} chars</p>
          </Field>
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text)]">
            <input type="checkbox" checked={noindex} onChange={(e) => setNoindex(e.target.checked)} />
            Add <code>noindex</code> meta (hide from search engines)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text)] hover:border-rose-400/60">Cancel</button>
          <button type="submit" className="rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-400">Save</button>
        </div>
        <style>{`
          .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.9rem; outline:none; }
          .input:focus { border-color:rgba(244,63,94,.6); box-shadow:0 0 0 3px rgba(244,63,94,.15); }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
