import { z } from "zod";

export const InterestEnum = z.enum(["astrology", "numerology", "vasthu", "jothisyam", "puja"]);
export type Interest = z.infer<typeof InterestEnum>;

export const indianPhone = z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number");

export const LeadInputSchema = z.object({
  name: z.string().min(2),
  phone: indianPhone,
  email: z.string().email().optional().or(z.literal("")),
  interest: InterestEnum,
  source: z.string().max(64).default("web"),
  consent: z.literal(true),
});
export type LeadInput = z.infer<typeof LeadInputSchema>;

export const BookingTypeEnum = z.enum(["consultation", "puja", "report"]);
export type BookingType = z.infer<typeof BookingTypeEnum>;

export const CreateOrderSchema = z.object({
  type: BookingTypeEnum,
  itemSlug: z.string().min(1),
  slotIso: z.string().datetime().optional(),
  user: z.object({
    name: z.string().min(2),
    phone: indianPhone,
    email: z.string().email(),
  }),
});
export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;

export const VerifyPaymentSchema = z.object({
  booking_id: z.number().int().positive(),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});
export type VerifyPaymentInput = z.infer<typeof VerifyPaymentSchema>;
