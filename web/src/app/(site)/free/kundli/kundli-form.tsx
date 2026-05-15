"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  gender: z.enum(["male", "female", "other"]),
  dob: z.string().min(1, "Please enter your date of birth"),
  tob: z.string().min(1, "Please enter your time of birth"),
  pob: z.string().min(2, "Please enter your place of birth"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});
type Values = z.infer<typeof schema>;

export function KundliForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { gender: "male" },
  });

  async function onSubmit(values: Values) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone,
          interest: "astrology",
          source: "free_kundli",
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
        🙏 Generating your kundli — we'll WhatsApp the PDF to your phone within 60 seconds.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
      <Field label="Full name" error={errors.name?.message}>
        <input {...register("name")} placeholder="Anitha Ramaswamy" className="input" autoComplete="name" />
      </Field>
      <Field label="Gender" error={errors.gender?.message}>
        <select {...register("gender")} className="input">
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field label="Date of birth" error={errors.dob?.message}>
        <input {...register("dob")} type="date" className="input" />
      </Field>
      <Field label="Time of birth" error={errors.tob?.message}>
        <input {...register("tob")} type="time" className="input" />
      </Field>
      <Field label="Place of birth" error={errors.pob?.message} className="sm:col-span-2">
        <input {...register("pob")} placeholder="Chennai, Tamil Nadu" className="input" />
      </Field>
      <Field label="Mobile (we'll WhatsApp the PDF)" error={errors.phone?.message} className="sm:col-span-2">
        <input
          {...register("phone")}
          inputMode="numeric"
          maxLength={10}
          placeholder="98XXXXXXXX"
          className="input"
          autoComplete="tel"
        />
      </Field>
      <label className="sm:col-span-2 flex items-start gap-3 text-sm text-[color:var(--color-text-muted)]">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>
          I agree to receive my kundli on WhatsApp and accept the{" "}
          <a href="/legal/privacy" className="text-[color:var(--color-gold-100)] underline">Privacy Policy</a>.
        </span>
      </label>
      {errors.consent && <p className="sm:col-span-2 text-sm text-rose-300">{errors.consent.message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 mt-2 rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
      >
        {status === "submitting" ? "Generating…" : "Generate my free kundli →"}
      </button>

      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-rose-300">
          Something went wrong. Please try again or WhatsApp us.
        </p>
      )}

      <style>{`
        .input {
          width: 100%;
          background: rgba(11, 10, 20, 0.6);
          border: 1px solid var(--color-border);
          color: var(--color-text);
          border-radius: 0.5rem;
          padding: 0.625rem 0.875rem;
          font-size: 0.95rem;
          outline: none;
          transition: border-color .15s ease;
        }
        .input:focus {
          border-color: var(--color-gold-500);
          box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.15);
        }
      `}</style>
    </form>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </label>
  );
}
