"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const SPECIALTIES = ["Vedic", "Jothisyam", "Numerology", "Vasthu", "KP", "Tarot", "Pujari (priest)"] as const;
const LANGUAGES = ["English", "Tamil", "Hindi", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi"] as const;

const schema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email"),
  specialties: z.array(z.string()).min(1, "Pick at least one specialty"),
  languages: z.array(z.string()).min(1, "Pick at least one language"),
  experienceYears: z.coerce.number().int().min(1, "Years must be at least 1").max(70, "Are you sure?"),
  pricePerSession: z.coerce.number().int().min(99, "Minimum ₹99").max(50000, "Maximum ₹50,000"),
  bio: z.string().min(40, "Please share at least 40 characters about your practice"),
  city: z.string().min(2, "City required"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});
type Values = z.infer<typeof schema>;

export function GuideRegisterForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { specialties: [], languages: [] },
  });

  async function onSubmit(values: Values) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.fullName,
          phone: values.phone,
          email: values.email,
          interest: "astrology",
          source: "guide_application",
          consent: true,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center text-emerald-200">
        🙏 Application received. Our guide-success team will review and reach out within 48 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4">
      <Field label="Full name" error={errors.fullName?.message}>
        <input {...register("fullName")} placeholder="Pandit Suresh Iyer" className="input" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Mobile" error={errors.phone?.message}>
          <input {...register("phone")} placeholder="98XXXXXXXX" inputMode="numeric" maxLength={10} className="input" />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input {...register("email")} type="email" placeholder="you@example.com" className="input" />
        </Field>
      </div>
      <Field label="City" error={errors.city?.message}>
        <input {...register("city")} placeholder="Chennai" className="input" />
      </Field>

      <Field label="Specialties (pick all that apply)" error={errors.specialties?.message}>
        <div className="mt-1 flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <label key={s} className="cursor-pointer">
              <input {...register("specialties")} type="checkbox" value={s} className="peer sr-only" />
              <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-1 text-sm text-[color:var(--color-text-muted)] hover:border-[color:var(--color-gold-500)] peer-checked:border-[color:var(--color-gold-500)] peer-checked:bg-[color:var(--color-gold-500)]/10 peer-checked:text-[color:var(--color-gold-100)]">
                {s}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <Field label="Languages you can read in" error={errors.languages?.message}>
        <div className="mt-1 flex flex-wrap gap-2">
          {LANGUAGES.map((l) => (
            <label key={l} className="cursor-pointer">
              <input {...register("languages")} type="checkbox" value={l} className="peer sr-only" />
              <span className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-bg)]/60 px-3 py-1 text-sm text-[color:var(--color-text-muted)] hover:border-[color:var(--color-gold-500)] peer-checked:border-[color:var(--color-gold-500)] peer-checked:bg-[color:var(--color-gold-500)]/10 peer-checked:text-[color:var(--color-gold-100)]">
                {l}
              </span>
            </label>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Years of experience" error={errors.experienceYears?.message}>
          <input {...register("experienceYears")} type="number" min={1} max={70} placeholder="15" className="input" />
        </Field>
        <Field label="Price per session (₹)" error={errors.pricePerSession?.message}>
          <input {...register("pricePerSession")} type="number" min={99} max={50000} placeholder="999" className="input" />
        </Field>
      </div>

      <Field label="Tell us about your practice" error={errors.bio?.message}>
        <textarea {...register("bio")} rows={4} placeholder="Lineage, training, what makes your readings distinctive…" className="input" />
      </Field>

      <label className="flex items-start gap-3 text-sm text-[color:var(--color-text-muted)]">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>
          I agree to Mileora's{" "}
          <a href="/legal/terms" className="text-[color:var(--color-gold-100)] underline">Terms</a> and{" "}
          <a href="/legal/privacy" className="text-[color:var(--color-gold-100)] underline">Privacy Policy</a> for guides.
        </span>
      </label>
      {errors.consent && <p className="text-sm text-rose-300">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
      >
        {status === "submitting" ? "Submitting…" : "Submit application"}
      </button>
      {status === "error" && (
        <p className="text-sm text-rose-300">Couldn't send. Please try again or email info@magnusconference.com.</p>
      )}

      <style>{`
        .input { width:100%; background:rgba(11,10,20,.6); border:1px solid var(--color-border); color:var(--color-text); border-radius:.5rem; padding:.625rem .875rem; font-size:.95rem; outline:none; transition:border-color .15s; }
        .input:focus { border-color:var(--color-gold-500); box-shadow:0 0 0 3px rgba(212,160,23,.15); }
      `}</style>
    </form>
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
