"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const partner = z.object({
  name: z.string().min(2, "Enter the full name"),
  dob: z.string().min(1, "Enter date of birth"),
  tob: z.string().min(1, "Enter time of birth"),
  pob: z.string().min(2, "Enter place of birth"),
});

const schema = z.object({
  bride: partner,
  groom: partner,
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});
type Values = z.infer<typeof schema>;

export function CompatibilityForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({ resolver: zodResolver(schema) });

  async function onSubmit(values: Values) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${values.bride.name} & ${values.groom.name}`,
          phone: values.phone,
          interest: "jothisyam",
          source: "free_compatibility",
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
      <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center text-emerald-200">
        🙏 Calculating compatibility — your full porutham report is on its way to your phone via WhatsApp.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-8">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Bride */}
        <fieldset>
          <legend className="font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-gold-100)]">Bride</legend>
          <div className="mt-4 space-y-4">
            <Field label="Name" error={errors.bride?.name?.message}>
              <input {...register("bride.name")} placeholder="Anitha" className="input" />
            </Field>
            <Field label="Date of birth" error={errors.bride?.dob?.message}>
              <input {...register("bride.dob")} type="date" className="input" />
            </Field>
            <Field label="Time of birth" error={errors.bride?.tob?.message}>
              <input {...register("bride.tob")} type="time" className="input" />
            </Field>
            <Field label="Place of birth" error={errors.bride?.pob?.message}>
              <input {...register("bride.pob")} placeholder="Chennai, Tamil Nadu" className="input" />
            </Field>
          </div>
        </fieldset>

        {/* Groom */}
        <fieldset>
          <legend className="font-[family-name:var(--font-cormorant)] text-2xl text-[color:var(--color-gold-100)]">Groom</legend>
          <div className="mt-4 space-y-4">
            <Field label="Name" error={errors.groom?.name?.message}>
              <input {...register("groom.name")} placeholder="Ravi" className="input" />
            </Field>
            <Field label="Date of birth" error={errors.groom?.dob?.message}>
              <input {...register("groom.dob")} type="date" className="input" />
            </Field>
            <Field label="Time of birth" error={errors.groom?.tob?.message}>
              <input {...register("groom.tob")} type="time" className="input" />
            </Field>
            <Field label="Place of birth" error={errors.groom?.pob?.message}>
              <input {...register("groom.pob")} placeholder="Bengaluru, Karnataka" className="input" />
            </Field>
          </div>
        </fieldset>
      </div>

      <Field label="Mobile (we'll WhatsApp the report)" error={errors.phone?.message}>
        <input {...register("phone")} placeholder="98XXXXXXXX" inputMode="numeric" maxLength={10} className="input" autoComplete="tel" />
      </Field>

      <label className="flex items-start gap-3 text-sm text-[color:var(--color-text-muted)]">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>
          I agree to receive the report on WhatsApp and accept the{" "}
          <a href="/legal/privacy" className="text-[color:var(--color-gold-100)] underline">Privacy Policy</a>.
        </span>
      </label>
      {errors.consent && <p className="text-sm text-rose-300">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
      >
        {status === "submitting" ? "Calculating…" : "Check compatibility →"}
      </button>
      {status === "error" && <p className="text-sm text-rose-300">Couldn't process. Please try again.</p>}

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
