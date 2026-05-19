"use client";

import { useState } from "react";
import * as Lucide from "lucide-react";
import { Plus, Edit2, Archive, RotateCcw, Eye, EyeOff } from "lucide-react";

type Category = {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: 0 | 1;
};

const INITIAL: Category[] = [
  { id: 1, parent_id: null, name: "Vedic Astrology",  slug: "astrology",       icon: "Sparkles",   description: "Birth chart, dasha, planetary remedies.",                            meta_title: "Vedic Astrology — Birth Chart, Dasha & Remedies", meta_description: null, sort_order: 1, is_active: 1 },
  { id: 2, parent_id: null, name: "Numerology",       slug: "numerology",      icon: "Calculator", description: "Life path, destiny, lucky vibrations.",                              meta_title: null, meta_description: null, sort_order: 2, is_active: 1 },
  { id: 3, parent_id: null, name: "Vasthu Shastra",   slug: "vasthu",          icon: "Home",       description: "Compass-based audit for home/office.",                                meta_title: null, meta_description: null, sort_order: 3, is_active: 1 },
  { id: 4, parent_id: null, name: "Tamil Jothisyam",  slug: "jothisyam",       icon: "Sun",        description: "South Indian Vedic with rasi, navamsa, panchangam.",                  meta_title: null, meta_description: null, sort_order: 4, is_active: 1 },
  { id: 5, parent_id: null, name: "Online Puja",      slug: "puja",            icon: "Flame",      description: "Authentic temple pujas live-streamed in your name.",                  meta_title: null, meta_description: null, sort_order: 5, is_active: 1 },
  { id: 6, parent_id: null, name: "Kundli Matching",  slug: "kundli-matching", icon: "Heart",      description: "36-guna porutham for marriage compatibility.",                        meta_title: null, meta_description: null, sort_order: 6, is_active: 1 },
  { id: 7, parent_id: null, name: "Tarot Reading",    slug: "tarot",           icon: "Layers",     description: "Tarot for love, career, life decisions.",                             meta_title: null, meta_description: null, sort_order: 7, is_active: 1 },
  { id: 8, parent_id: null, name: "Daily Horoscope",  slug: "horoscope",       icon: "Star",       description: "Personalized daily / weekly / monthly readings by rasi.",            meta_title: null, meta_description: null, sort_order: 8, is_active: 1 },
  { id: 9, parent_id: null, name: "Remedial Pujas",   slug: "remedial-pujas",  icon: "Sparkle",    description: "Navagraha shanti, dosha nivaran, pitru tarpanam.",                    meta_title: null, meta_description: null, sort_order: 9, is_active: 1 },
];

const ICON_OPTIONS = ["Sparkles", "Calculator", "Home", "Sun", "Flame", "Heart", "Layers", "Star", "Sparkle", "Moon", "Globe", "BookOpen", "Compass", "Sunrise", "Gem"];

export default function AdminCategories() {
  const [items, setItems] = useState<Category[]>(INITIAL);
  const [editing, setEditing] = useState<Category | null>(null);
  const [showForm, setShowForm] = useState(false);

  function onSaved(saved: Category) {
    setItems((all) => {
      const existing = all.find((c) => c.id === saved.id);
      if (existing) return all.map((c) => (c.id === saved.id ? saved : c));
      return [...all, saved];
    });
    setShowForm(false);
    setEditing(null);
  }
  function archive(id: number) {
    setItems((all) => all.map((c) => (c.id === id ? { ...c, is_active: 0 } : c)));
    // TODO: apiUser('admin').delete(`/admin/categories/${id}`)
  }
  function restore(id: number) {
    setItems((all) => all.map((c) => (c.id === id ? { ...c, is_active: 1 } : c)));
    // TODO: apiUser('admin').put(`/admin/categories/${id}`, { is_active: 1 })
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            The canonical service catalog. Guides pick from these when listing their offerings.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-rose-500 px-3 py-2 text-sm font-medium text-white hover:bg-rose-400"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden /> New category
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--color-bg-elev)] text-left text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-border)]/60">
            {items.map((c) => {
              const Icon = (Lucide as Record<string, React.ComponentType<{ className?: string }>>)[c.icon ?? "Sparkles"] ?? Lucide.Sparkles;
              return (
                <tr key={c.id} className={`hover:bg-[color:var(--color-bg)]/40 ${c.is_active === 0 ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-text-muted)]">{c.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[color:var(--color-bg)]/60 ring-1 ring-[color:var(--color-gold-500)]/20">
                        <Icon className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden />
                      </div>
                      <div>
                        <p className="font-medium text-[color:var(--color-text)]">{c.name}</p>
                        <p className="text-xs text-[color:var(--color-text-muted)] line-clamp-1">{c.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[color:var(--color-gold-100)]">{c.slug}</td>
                  <td className="px-4 py-3 text-[color:var(--color-text-muted)]">{c.sort_order}</td>
                  <td className="px-4 py-3">
                    {c.is_active === 1 ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-xs text-emerald-200">
                        <Eye className="h-3 w-3" aria-hidden /> active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[color:var(--color-bg)] px-2 py-0.5 text-xs text-[color:var(--color-text-muted)]">
                        <EyeOff className="h-3 w-3" aria-hidden /> archived
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button type="button" onClick={() => { setEditing(c); setShowForm(true); }} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Edit">
                        <Edit2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      {c.is_active === 1 ? (
                        <button type="button" onClick={() => archive(c.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-rose-400/10 hover:text-rose-300" aria-label="Archive">
                          <Archive className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      ) : (
                        <button type="button" onClick={() => restore(c.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-emerald-400/10 hover:text-emerald-300" aria-label="Restore">
                          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-6 text-xs text-[color:var(--color-text-muted)]">
        Archiving a category keeps existing guide services intact but hides the category from public browse.
        Guides won't be able to create new services in archived categories.
      </p>

      {showForm && (
        <CategoryFormModal
          initial={editing}
          iconOptions={ICON_OPTIONS}
          nextId={Math.max(0, ...items.map((c) => c.id)) + 1}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}
    </>
  );
}

function CategoryFormModal({ initial, iconOptions, nextId, onCancel, onSaved }: {
  initial: Category | null;
  iconOptions: string[];
  nextId: number;
  onCancel: () => void;
  onSaved: (c: Category) => void;
}) {
  const [name, setName]             = useState(initial?.name ?? "");
  const [icon, setIcon]             = useState(initial?.icon ?? "Sparkles");
  const [description, setDesc]      = useState(initial?.description ?? "");
  const [metaTitle, setMetaTitle]   = useState(initial?.meta_title ?? "");
  const [metaDesc, setMetaDesc]     = useState(initial?.meta_description ?? "");
  const [sortOrder, setSortOrder]   = useState(String(initial?.sort_order ?? 0));
  const [error, setError]           = useState<string | null>(null);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) return setError("Name (2+ chars) required");
    const slug = slugify(name);
    const saved: Category = {
      id: initial?.id ?? nextId,
      parent_id: initial?.parent_id ?? null,
      name: name.trim(),
      slug,
      icon: icon || null,
      description: description.trim() || null,
      meta_title: metaTitle.trim() || null,
      meta_description: metaDesc.trim() || null,
      sort_order: parseInt(sortOrder, 10) || 0,
      is_active: initial?.is_active ?? 1,
    };
    // TODO: apiUser('admin').post('/admin/categories', saved) or .put(`/admin/categories/${id}`, saved)
    onSaved(saved);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={submit} className="w-full max-w-2xl rounded-2xl border border-rose-400/30 bg-[color:var(--color-surface)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">{initial ? "Edit category" : "New category"}</h2>

        <div className="mt-5 grid gap-4">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Vedic Astrology" className="input" />
            {name && (
              <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
                slug: <code>{slugify(name)}</code>
              </p>
            )}
          </Field>

          <Field label="Icon (Lucide)">
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((i) => {
                const Icon = (Lucide as Record<string, React.ComponentType<{ className?: string }>>)[i] ?? Lucide.Sparkles;
                const active = icon === i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIcon(i)}
                    aria-pressed={active}
                    title={i}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                      active
                        ? "border-rose-400/60 bg-rose-400/10"
                        : "border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? "text-rose-200" : "text-[color:var(--color-gold-300)]"}`} aria-hidden />
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="Description">
            <textarea value={description} onChange={(e) => setDesc(e.target.value)} rows={2} className="input" />
          </Field>

          <Field label="Meta title (SEO — 50–60 chars)">
            <input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={200} className="input" />
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{metaTitle.length} chars</p>
          </Field>

          <Field label="Meta description (SEO — 150–160 chars)">
            <textarea value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} rows={2} className="input" />
            <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">{metaDesc.length} chars</p>
          </Field>

          <Field label="Sort order (lower = first)">
            <input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" min={0} className="input" />
          </Field>

          {error && <p className="text-xs text-rose-300">{error}</p>}
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

function slugify(s: string): string {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "category";
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
