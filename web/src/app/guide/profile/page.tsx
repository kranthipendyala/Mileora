"use client";

export default function GuideProfile() {
  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">Update what customers see on your public listing.</p>

      <form className="mt-8 grid max-w-2xl gap-5">
        <Field label="Display name">
          <input defaultValue="Pandit Suresh Iyer" className="input" />
        </Field>
        <Field label="Tagline">
          <input defaultValue="Vedic + Tamil Jothisyam · 25 years" className="input" />
        </Field>
        <Field label="Bio">
          <textarea rows={4} defaultValue="Born into a lineage of Tirunelveli temple priests, Pandit Suresh has guided 20,000+ seekers through career, marriage and remedial pujas." className="input" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Price per session (₹)">
            <input type="number" defaultValue={999} className="input" />
          </Field>
          <Field label="Session length (min)">
            <input type="number" defaultValue={30} className="input" />
          </Field>
        </div>
        <button type="button" className="self-start rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)]">
          Save changes
        </button>
      </form>

      <style>{`
        .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.55rem .85rem; font-size:.95rem; outline:none; }
        .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
      `}</style>
    </>
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
