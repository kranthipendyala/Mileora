"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  interest: z.enum(["astrology", "numerology", "vasthu", "jothisyam", "puja"]),
  consent: z.literal(true, { errorMap: () => ({ message: "Please accept to continue" }) }),
});
type LeadInput = z.infer<typeof leadSchema>;

export function LeadForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { interest: "astrology" },
  });

  async function onSubmit(values: LeadInput) {
    setStatus("submitting");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "home_lead_form" }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[color:var(--color-gold-500)]/30 bg-[color:var(--color-surface)]/70 p-8 shadow-[var(--shadow-glow)] sm:p-12">
        <div className="text-center">
          <h2 className="font-[family-name:var(--font-cormorant)] text-4xl tracking-tight sm:text-5xl">
            Get a <span className="text-gradient-gold">free consultation call</span>
          </h2>
          <p className="mt-3 text-[color:var(--color-text-muted)]">
            Share your details and a Mileora advisor will call you within 30 minutes — no obligation.
          </p>
        </div>

        {status === "ok" ? (
          <div className="mt-10 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-6 text-center text-emerald-200">
            🙏 Thank you! Our advisor will reach out within 30 minutes.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.name?.message}>
              <input
                {...register("name")}
                placeholder="Anitha Ramaswamy"
                className="input"
                autoComplete="name"
              />
            </Field>
            <Field label="Mobile (India)" error={errors.phone?.message}>
              <input
                {...register("phone")}
                placeholder="98XXXXXXXX"
                inputMode="numeric"
                maxLength={10}
                className="input"
                autoComplete="tel"
              />
            </Field>
            <Field label="Email (optional)" error={errors.email?.message}>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="input"
                autoComplete="email"
              />
            </Field>
            <Field label="What can we help with?" error={errors.interest?.message}>
              <select {...register("interest")} className="input">
                <option value="astrology">Vedic Astrology</option>
                <option value="numerology">Numerology</option>
                <option value="vasthu">Vasthu</option>
                <option value="jothisyam">Tamil Jothisyam</option>
                <option value="puja">Puja booking</option>
              </select>
            </Field>

            <label className="sm:col-span-2 flex items-start gap-3 text-sm text-[color:var(--color-text-muted)]">
              <input type="checkbox" {...register("consent")} className="mt-1" />
              <span>
                I agree to be contacted by Mileora on WhatsApp/phone and accept the{" "}
                <a href="/legal/privacy" className="text-[color:var(--color-gold-100)] underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
            {errors.consent && <p className="sm:col-span-2 text-sm text-rose-300">{errors.consent.message}</p>}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="sm:col-span-2 mt-2 rounded-md bg-[color:var(--color-gold-500)] px-6 py-3 text-base font-medium text-[color:var(--color-bg)] transition-colors hover:bg-[color:var(--color-gold-300)] disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Request my free call"}
            </button>

            {status === "error" && (
              <p className="sm:col-span-2 text-sm text-rose-300">
                Something went wrong. Please try again or WhatsApp us directly.
              </p>
            )}
          </form>
        )}
      </div>

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
    </section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-rose-300">{error}</p>}
    </label>
  );
}
