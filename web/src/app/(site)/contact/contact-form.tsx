"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number").optional().or(z.literal("")),
  topic: z.enum(["booking", "refund", "technical", "partnership", "other"]),
  message: z.string().min(10, "Please share a few more details"),
});
type Values = z.infer<typeof schema>;

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const { register, handleSubmit, formState: { errors }, reset } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { topic: "booking" },
  });

  async function onSubmit(values: Values) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          phone: values.phone || "9999999999",
          email: values.email,
          interest: "astrology",
          source: `contact_${values.topic}`,
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
        🙏 Message received. We'll get back to you within 2 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 grid gap-4 sm:grid-cols-2">
      <Field label="Name" error={errors.name?.message}>
        <input {...register("name")} placeholder="Anitha Ramaswamy" className="input" autoComplete="name" />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input {...register("email")} type="email" placeholder="you@example.com" className="input" autoComplete="email" />
      </Field>
      <Field label="Phone (optional)" error={errors.phone?.message}>
        <input {...register("phone")} placeholder="98XXXXXXXX" inputMode="numeric" maxLength={10} className="input" autoComplete="tel" />
      </Field>
      <Field label="Topic" error={errors.topic?.message}>
        <select {...register("topic")} className="input">
          <option value="booking">Booking enquiry</option>
          <option value="refund">Refund / cancellation</option>
          <option value="technical">Technical issue</option>
          <option value="partnership">Partnership / press</option>
          <option value="other">Other</option>
        </select>
      </Field>
      <Field label="Message" error={errors.message?.message} className="sm:col-span-2">
        <textarea {...register("message")} rows={5} placeholder="How can we help?" className="input" />
      </Field>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="sm:col-span-2 rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Send message"}
      </button>
      {status === "error" && (
        <p className="sm:col-span-2 text-sm text-rose-300">Couldn't send. Please email info@magnusconference.com directly.</p>
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
        .input:focus { border-color: var(--color-gold-500); box-shadow: 0 0 0 3px rgba(212, 160, 23, 0.15); }
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
