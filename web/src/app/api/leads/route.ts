import { NextResponse } from "next/server";
import { z } from "zod";
import { apiServer } from "@/lib/api-client";

const leadSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.string().email().optional().or(z.literal("")),
  interest: z.enum(["astrology", "numerology", "vasthu", "jothisyam", "puja"]),
  source: z.string().max(64).default("web"),
  consent: z.literal(true),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: { code: "BAD_JSON", message: "Invalid JSON" } }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
      { status: 422 }
    );
  }

  try {
    const data = await apiServer.post<{ data: { id: number } }>("/leads", parsed.data);
    return NextResponse.json({ ok: true, id: data.data.id }, { status: 201 });
  } catch (err) {
    console.error("[leads] backend error", err);
    return NextResponse.json(
      { error: { code: "BACKEND", message: "Could not save lead. Please try again." } },
      { status: 502 }
    );
  }
}
