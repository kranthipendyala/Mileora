"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/lib/auth";

export default function AccountProfile() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [tob, setTob] = useState("");
  const [pob, setPob] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const p = getProfile("user");
    if (p) {
      setName(p.name ?? "");
      setPhone(p.phone ?? "");
      setEmail(p.email ?? "");
    }
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    // TODO: apiUser('user').put('/auth/me', { name, email, dob, tob, pob })
    await new Promise((r) => setTimeout(r, 500));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <>
      <h1 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight">Profile</h1>
      <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
        Your birth details are encrypted and only shared with the specific guide you book.
      </p>

      <form onSubmit={save} className="mt-8 grid max-w-2xl gap-5">
        <Field label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Phone (sign-in)">
            <input value={phone} disabled className="input opacity-60" />
          </Field>
          <Field label="Email (optional)">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
          </Field>
        </div>

        <h2 className="mt-6 font-[family-name:var(--font-cormorant)] text-2xl">Birth details (private)</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date of birth">
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input" />
          </Field>
          <Field label="Time of birth">
            <input type="time" value={tob} onChange={(e) => setTob(e.target.value)} className="input" />
          </Field>
        </div>
        <Field label="Place of birth">
          <input value={pob} onChange={(e) => setPob(e.target.value)} placeholder="Chennai, Tamil Nadu" className="input" />
        </Field>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-[color:var(--color-gold-500)] px-5 py-2.5 text-sm font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && <span className="text-sm text-emerald-300">Saved ✓</span>}
        </div>
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
