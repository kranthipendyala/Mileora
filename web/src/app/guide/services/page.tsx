"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Edit2, Trash2, Eye, EyeOff, Tag } from "lucide-react";
import { formatINR } from "@/lib/mock-data";

type Category = { id: number; name: string; slug: string };
type GuideService = {
  id: number;
  category_id: number;
  category_name: string;
  name: string;
  description: string | null;
  base_price_paise: number;
  discounted_price_paise: number | null;
  price_unit: "fixed" | "per_session" | "per_hour" | "per_report";
  duration_minutes: number;
  delivery_mode: "video" | "voice" | "chat" | "in_person" | "async_report" | "online_puja";
  is_active: 0 | 1;
};

// TODO: apiUser('guide').get('/guide/services') + apiPublic.get('/categories')
const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Vedic Astrology",  slug: "astrology" },
  { id: 2, name: "Numerology",       slug: "numerology" },
  { id: 3, name: "Vasthu Shastra",   slug: "vasthu" },
  { id: 4, name: "Tamil Jothisyam",  slug: "jothisyam" },
  { id: 5, name: "Online Puja",      slug: "puja" },
  { id: 6, name: "Kundli Matching",  slug: "kundli-matching" },
  { id: 7, name: "Tarot Reading",    slug: "tarot" },
  { id: 8, name: "Daily Horoscope",  slug: "horoscope" },
  { id: 9, name: "Remedial Pujas",   slug: "remedial-pujas" },
];

const MOCK_SERVICES: GuideService[] = [
  { id: 1, category_id: 1, category_name: "Vedic Astrology", name: "30-min Vedic Birth Chart Reading", description: "Focused reading of rasi, navamsa, and current dasha period.",                              base_price_paise: 99900,  discounted_price_paise: null, price_unit: "per_session", duration_minutes: 30, delivery_mode: "video",  is_active: 1 },
  { id: 2, category_id: 1, category_name: "Vedic Astrology", name: "60-min Annual Forecast",            description: "Deep-dive 12-month varshphal with monthly do's and don'ts. PDF included.",                  base_price_paise: 249900, discounted_price_paise: 199900, price_unit: "per_session", duration_minutes: 60, delivery_mode: "video",  is_active: 1 },
  { id: 3, category_id: 4, category_name: "Tamil Jothisyam", name: "Marriage Porutham (compatibility)", description: "10-porutham analysis with joint live session in Tamil or English.",                        base_price_paise: 149900, discounted_price_paise: null, price_unit: "per_session", duration_minutes: 45, delivery_mode: "video",  is_active: 1 },
  { id: 4, category_id: 6, category_name: "Kundli Matching", name: "Express Kundli Matching",           description: "36-guna porutham PDF delivered within 24 hours. No live call.",                            base_price_paise: 49900,  discounted_price_paise: null, price_unit: "per_report", duration_minutes: 60, delivery_mode: "async_report", is_active: 0 },
];

const schema = z.object({
  category_id:             z.coerce.number().int().positive("Pick a category"),
  name:                    z.string().min(3, "Service name (3+ chars)"),
  description:             z.string().optional().or(z.literal("")),
  base_price_paise:        z.coerce.number().int().min(0).max(10_000_000),
  discounted_price_paise:  z.coerce.number().int().min(0).max(10_000_000).optional().or(z.literal("")),
  price_unit:              z.enum(["fixed","per_session","per_hour","per_report"]),
  duration_minutes:        z.coerce.number().int().min(5).max(300),
  delivery_mode:           z.enum(["video","voice","chat","in_person","async_report","online_puja"]),
});
type FormValues = z.infer<typeof schema>;

export default function GuideServices() {
  const [services, setServices] = useState<GuideService[]>(MOCK_SERVICES);
  const [editing, setEditing] = useState<GuideService | null>(null);
  const [showForm, setShowForm] = useState(false);

  const grouped = groupBy(services, (s) => s.category_name);

  function onSaved(saved: GuideService) {
    setServices((all) => {
      const existing = all.find((s) => s.id === saved.id);
      if (existing) return all.map((s) => (s.id === saved.id ? saved : s));
      return [...all, saved];
    });
    setShowForm(false);
    setEditing(null);
  }

  function toggleActive(id: number) {
    setServices((all) => all.map((s) => (s.id === id ? { ...s, is_active: s.is_active === 1 ? 0 : 1 } : s)));
    // TODO: apiUser('guide').post(`/guide/services/${id}/toggle`)
  }
  function remove(id: number) {
    setServices((all) => all.filter((s) => s.id !== id));
    // TODO: apiUser('guide').delete(`/guide/services/${id}`)
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">My services</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            Declare what you offer, set your own pricing, and toggle availability anytime.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gold-500)] px-3 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden /> Add service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-[color:var(--color-border)] p-12 text-center">
          <Tag className="mx-auto h-8 w-8 text-[color:var(--color-gold-300)]" aria-hidden />
          <p className="mt-4 text-[color:var(--color-text)]">You haven't added any services yet.</p>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
            Add at least one service so seekers can find and book you.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {Object.entries(grouped).map(([category, items]) => (
            <section key={category}>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--color-gold-300)]">{category}</p>
              <ul className="mt-3 divide-y divide-[color:var(--color-border)]/60 rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60">
                {items.map((s) => (
                  <li key={s.id} className={`flex items-start gap-3 px-5 py-4 ${s.is_active === 0 ? "opacity-60" : ""}`}>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="font-[family-name:var(--font-cormorant)] text-xl text-[color:var(--color-text)]">{s.name}</p>
                        <span className="text-xs text-[color:var(--color-text-muted)]">{s.duration_minutes} min · {s.delivery_mode.replace("_", " ")}</span>
                        {s.is_active === 0 && (
                          <span className="rounded-full bg-[color:var(--color-bg)] px-2 py-0.5 text-[10px] uppercase text-[color:var(--color-text-muted)]">inactive</span>
                        )}
                      </div>
                      {s.description && <p className="mt-1 text-sm text-[color:var(--color-text-muted)] line-clamp-2">{s.description}</p>}
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="font-medium text-[color:var(--color-text)]">{formatINR(s.discounted_price_paise ?? s.base_price_paise)}</span>
                        {s.discounted_price_paise && s.discounted_price_paise < s.base_price_paise && (
                          <span className="text-xs text-[color:var(--color-text-muted)] line-through">{formatINR(s.base_price_paise)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button type="button" onClick={() => toggleActive(s.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label={s.is_active === 1 ? "Hide" : "Activate"}>
                        {s.is_active === 1 ? <Eye className="h-3.5 w-3.5" aria-hidden /> : <EyeOff className="h-3.5 w-3.5" aria-hidden />}
                      </button>
                      <button type="button" onClick={() => { setEditing(s); setShowForm(true); }} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Edit">
                        <Edit2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button type="button" onClick={() => remove(s.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-rose-400/10 hover:text-rose-300" aria-label="Delete">
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      {showForm && (
        <ServiceFormModal
          initial={editing}
          categories={MOCK_CATEGORIES}
          nextId={Math.max(0, ...services.map((s) => s.id)) + 1}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}
    </>
  );
}

function ServiceFormModal({
  initial, categories, nextId, onCancel, onSaved,
}: {
  initial: GuideService | null;
  categories: Category[];
  nextId: number;
  onCancel: () => void;
  onSaved: (s: GuideService) => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? {
      category_id: initial.category_id,
      name: initial.name,
      description: initial.description ?? "",
      base_price_paise: initial.base_price_paise,
      discounted_price_paise: initial.discounted_price_paise ?? undefined,
      price_unit: initial.price_unit,
      duration_minutes: initial.duration_minutes,
      delivery_mode: initial.delivery_mode,
    } : {
      price_unit: "per_session",
      delivery_mode: "video",
      duration_minutes: 30,
    } as Partial<FormValues> as FormValues,
  });

  function submit(v: FormValues) {
    const cat = categories.find((c) => c.id === Number(v.category_id));
    const saved: GuideService = {
      id: initial?.id ?? nextId,
      category_id: Number(v.category_id),
      category_name: cat?.name ?? "Other",
      name: v.name,
      description: v.description?.toString() || null,
      base_price_paise: Number(v.base_price_paise),
      discounted_price_paise: v.discounted_price_paise ? Number(v.discounted_price_paise) : null,
      price_unit: v.price_unit,
      duration_minutes: Number(v.duration_minutes),
      delivery_mode: v.delivery_mode,
      is_active: initial?.is_active ?? 1,
    };
    // TODO: apiUser('guide').post('/guide/services', ...) or .put(`/guide/services/${initial.id}`, ...)
    onSaved(saved);
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <form onSubmit={handleSubmit(submit)} className="w-full max-w-2xl rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)] p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">{initial ? "Edit service" : "Add service"}</h2>
        <p className="mt-1 text-xs text-[color:var(--color-text-muted)]">
          Tip: be specific. "30-min Vedic Birth Chart Reading" books better than "Astrology consultation".
        </p>

        <div className="mt-5 grid gap-4">
          <Field label="Category" error={errors.category_id?.message}>
            <select {...register("category_id")} className="input">
              <option value="">— pick a category —</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Service name" error={errors.name?.message}>
            <input {...register("name")} placeholder="30-min Vedic Birth Chart Reading" className="input" />
          </Field>
          <Field label="Description (optional)" error={errors.description?.message}>
            <textarea {...register("description")} rows={3} placeholder="What's included? What questions can the seeker ask?" className="input" />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Base price (paise — ₹999 = 99900)" error={errors.base_price_paise?.message}>
              <input {...register("base_price_paise")} type="number" min={0} placeholder="99900" className="input" />
            </Field>
            <Field label="Discounted price (optional)" error={errors.discounted_price_paise?.message}>
              <input {...register("discounted_price_paise")} type="number" min={0} placeholder="79900" className="input" />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Price unit" error={errors.price_unit?.message}>
              <select {...register("price_unit")} className="input">
                <option value="per_session">per session</option>
                <option value="per_hour">per hour</option>
                <option value="per_report">per report</option>
                <option value="fixed">fixed</option>
              </select>
            </Field>
            <Field label="Duration (min)" error={errors.duration_minutes?.message}>
              <input {...register("duration_minutes")} type="number" min={5} max={300} className="input" />
            </Field>
            <Field label="Delivery mode" error={errors.delivery_mode?.message}>
              <select {...register("delivery_mode")} className="input">
                <option value="video">Video call</option>
                <option value="voice">Voice call</option>
                <option value="chat">Chat</option>
                <option value="in_person">In person</option>
                <option value="async_report">Async (PDF report)</option>
                <option value="online_puja">Online puja stream</option>
              </select>
            </Field>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]">Cancel</button>
          <button type="submit" className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]">Save</button>
        </div>
        <style>{`
          .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.9rem; outline:none; }
          .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
        `}</style>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </label>
  );
}

function groupBy<T, K extends string>(items: T[], by: (t: T) => K): Record<K, T[]> {
  const out: Record<string, T[]> = {};
  for (const it of items) {
    const k = by(it);
    (out[k] ||= []).push(it);
  }
  return out as Record<K, T[]>;
}
