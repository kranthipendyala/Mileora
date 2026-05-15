import { NextResponse } from "next/server";
import { z } from "zod";
import { apiServer } from "@/lib/api-client";

const orderSchema = z.object({
  type: z.enum(["consultation", "puja", "report"]),
  itemSlug: z.string().min(1),
  slotIso: z.string().datetime().optional(),
  user: z.object({
    name: z.string().min(2),
    phone: z.string().regex(/^[6-9]\d{9}$/),
    email: z.string().email(),
  }),
});

/**
 * Step 1 of Razorpay flow.
 * Creates a pending booking + Razorpay order via CI3 backend.
 * Returns { booking_id, razorpay_order_id, amount, currency, key_id }
 * which the browser hands to the Razorpay Checkout SDK.
 */
export async function POST(req: Request) {
  const parsed = orderSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
      { status: 422 }
    );
  }

  try {
    const data = await apiServer.post<{
      data: { booking_id: number; razorpay_order_id: string; amount: number; currency: string; key_id: string };
    }>("/bookings", parsed.data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[razorpay/order] backend error", err);
    return NextResponse.json(
      { error: { code: "BACKEND", message: "Could not create order" } },
      { status: 502 }
    );
  }
}
