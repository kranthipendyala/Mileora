"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Plus, Edit2, Trash2, Star } from "lucide-react";
import { MOCK_ADDRESSES, type Address } from "@/lib/mock-account";

const schema = z.object({
  label: z.string().min(1, "Required").max(40),
  name:  z.string().min(2, "Required"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit Indian phone"),
  line1: z.string().min(3, "Required"),
  line2: z.string().optional().or(z.literal("")),
  pincode: z.string().regex(/^\d{6}$/, "6-digit pincode"),
  landmark: z.string().optional().or(z.literal("")),
  is_default: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

export default function AccountAddresses() {
  // TODO: replace with apiUser('user').get<Envelope<Address[]>>('/addresses')
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [editing, setEditing] = useState<Address | null>(null);
  const [showForm, setShowForm] = useState(false);

  function onSaved(saved: Address) {
    setAddresses((all) => {
      const existing = all.find((a) => a.id === saved.id);
      const cleared = saved.is_default ? all.map((a) => ({ ...a, is_default: 0 as const })) : all;
      if (existing) return cleared.map((a) => (a.id === saved.id ? saved : a));
      return [...cleared, saved];
    });
    setShowForm(false);
    setEditing(null);
  }
  function onDelete(id: number) {
    setAddresses((all) => all.filter((a) => a.id !== id));
    // TODO: apiUser('user').delete(`/addresses/${id}`)
  }
  function setDefault(id: number) {
    setAddresses((all) => all.map((a) => ({ ...a, is_default: a.id === id ? 1 : 0 })));
    // TODO: apiUser('user').put(`/addresses/${id}`, { is_default: true })
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Addresses</h1>
          <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">For prasad delivery and in-person vasthu audits.</p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--color-gold-500)] px-3 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden /> Add new
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {addresses.length === 0 && (
          <div className="md:col-span-2 rounded-2xl border border-dashed border-[color:var(--color-border)] p-10 text-center text-sm text-[color:var(--color-text-muted)]">
            No saved addresses. Click "Add new" to create one.
          </div>
        )}
        {addresses.map((a) => (
          <div key={a.id} className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 p-5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-[color:var(--color-gold-300)]" aria-hidden />
                <span className="text-xs uppercase tracking-wider text-[color:var(--color-text-muted)]">{a.label}</span>
                {a.is_default === 1 && (
                  <span className="ml-1 rounded-full bg-[color:var(--color-gold-500)]/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-[color:var(--color-gold-100)]">default</span>
                )}
              </div>
              <div className="flex gap-1">
                <button type="button" onClick={() => { setEditing(a); setShowForm(true); }} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-[color:var(--color-bg)]/60 hover:text-[color:var(--color-text)]" aria-label="Edit">
                  <Edit2 className="h-3.5 w-3.5" aria-hidden />
                </button>
                <button type="button" onClick={() => onDelete(a.id)} className="rounded p-1.5 text-[color:var(--color-text-muted)] hover:bg-rose-400/10 hover:text-rose-300" aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                </button>
              </div>
            </div>
            <p className="mt-3 font-medium text-[color:var(--color-text)]">{a.name}</p>
            <p className="text-sm text-[color:var(--color-text-muted)]">{a.phone}</p>
            <p className="mt-2 text-sm text-[color:var(--color-text)]">
              {a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />
              {a.landmark ? <>Near {a.landmark}<br /></> : null}
              PIN {a.pincode}
            </p>
            {a.is_default !== 1 && (
              <button type="button" onClick={() => setDefault(a.id)} className="mt-4 inline-flex items-center gap-1 text-xs text-[color:var(--color-gold-100)] hover:underline">
                <Star className="h-3 w-3" aria-hidden /> Set as default
              </button>
            )}
          </div>
        ))}
      </div>

      {showForm && (
        <AddressFormModal
          initial={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
          nextId={Math.max(0, ...addresses.map((a) => a.id)) + 1}
        />
      )}
    </>
  );
}

function AddressFormModal({ initial, onCancel, onSaved, nextId }: {
  initial: Address | null; onCancel: () => void; onSaved: (a: Address) => void; nextId: number;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: initial ? {
      label: initial.label, name: initial.name, phone: initial.phone,
      line1: initial.line1, line2: initial.line2 ?? "", pincode: initial.pincode,
      landmark: initial.landmark ?? "", is_default: initial.is_default === 1,
    } : { label: "home", is_default: false } as Partial<FormValues> as FormValues,
  });

  function submit(v: FormValues) {
    // TODO: apiUser('user').post('/addresses', v) or .put(`/addresses/${initial.id}`, v)
    onSaved({
      id: initial?.id ?? nextId,
      label: v.label,
      name: v.name,
      phone: v.phone,
      line1: v.line1,
      line2: v.line2 || undefined,
      pincode: v.pincode,
      landmark: v.landmark || undefined,
      is_default: v.is_default ? 1 : 0,
    });
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-lg rounded-2xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)] p-6 shadow-2xl sm:p-8">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl">{initial ? "Edit address" : "Add address"}</h2>
        <form onSubmit={handleSubmit(submit)} className="mt-5 grid gap-3 sm:grid-cols-2">
          <Field label="Label (home, mom, office)" error={errors.label?.message}>
            <input {...register("label")} className="input" />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input {...register("phone")} inputMode="numeric" maxLength={10} className="input" />
          </Field>
          <Field label="Recipient name" error={errors.name?.message} className="sm:col-span-2">
            <input {...register("name")} className="input" />
          </Field>
          <Field label="Address line 1" error={errors.line1?.message} className="sm:col-span-2">
            <input {...register("line1")} className="input" />
          </Field>
          <Field label="Address line 2 (optional)" error={errors.line2?.message} className="sm:col-span-2">
            <input {...register("line2")} className="input" />
          </Field>
          <Field label="Pincode" error={errors.pincode?.message}>
            <input {...register("pincode")} inputMode="numeric" maxLength={6} className="input" />
          </Field>
          <Field label="Landmark (optional)" error={errors.landmark?.message}>
            <input {...register("landmark")} className="input" />
          </Field>
          <label className="sm:col-span-2 mt-1 flex items-center gap-2 text-sm text-[color:var(--color-text-muted)]">
            <input type="checkbox" {...register("is_default")} /> Make this my default address
          </label>
          <div className="sm:col-span-2 mt-3 flex justify-end gap-2">
            <button type="button" onClick={onCancel} className="rounded-md border border-[color:var(--color-border)] px-4 py-2 text-sm text-[color:var(--color-text)] hover:border-[color:var(--color-gold-500)]">
              Cancel
            </button>
            <button type="submit" className="rounded-md bg-[color:var(--color-gold-500)] px-4 py-2 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]">
              Save
            </button>
          </div>
        </form>
        <style>{`
          .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.9rem; outline:none; }
          .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
        `}</style>
      </div>
    </div>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </label>
  );
}
