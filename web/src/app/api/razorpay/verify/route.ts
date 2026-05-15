import { NextResponse } from "next/server";
import { z } from "zod";
import { apiServer } from "@/lib/api-client";

const verifySchema = z.object({
  booking_id: z.number().int().positive(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

/**
 * Step 2 of Razorpay flow.
 * Browser hands back the signature from the Razorpay Checkout success handler.
 * CI3 verifies HMAC against RAZORPAY_KEY_SECRET and confirms the booking.
 */
export async function POST(req: Request) {
  const parsed = verifySchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "VALIDATION", message: parsed.error.issues[0]?.message ?? "Invalid input" } },
      { status: 422 }
    );
  }

  try {
    const data = await apiServer.post<{ data: { status: "confirmed" | "failed"; booking_id: number } }>(
      "/payments/verify",
      parsed.data
    );
    return NextResponse.json(data);
  } catch (err) {
    console.error("[razorpay/verify] backend error", err);
    return NextResponse.json(
      { error: { code: "BACKEND", message: "Could not verify payment" } },
      { status: 502 }
    );
  }
}
