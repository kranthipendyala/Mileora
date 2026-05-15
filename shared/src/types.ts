export type ApiEnvelope<T> = { data: T; meta?: Record<string, unknown> };
export type ApiError = { error: { code: string; message: string } };

export type Astrologer = {
  id: number;
  slug: string;
  name: string;
  bio?: string;
  photo_url?: string;
  specialties?: string;       // CSV
  languages?: string;         // CSV
  experience_years: number;
  rating: number;
  reviews_count: number;
  price_per_session_paise: number;
  session_minutes: number;
  status: "active" | "paused" | "draft";
};

export type Puja = {
  id: number;
  slug: string;
  name: string;
  deity?: string;
  temple?: string;
  city?: string;
  description?: string;
  image_url?: string;
  price_paise: number;
  duration_minutes: number;
  features?: string;          // JSON string
  featured: 0 | 1;
  status: "active" | "draft";
};

export type Booking = {
  id: number;
  type: "consultation" | "puja" | "report";
  item_id: number;
  item_slug: string;
  slot_iso: string | null;
  amount_paise: number;
  currency: "INR";
  status: "pending" | "confirmed" | "failed" | "cancelled" | "refunded";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  user_name: string;
  user_phone: string;
  user_email: string;
  created_at: string;
};

export type CreateOrderResponse = {
  data: {
    booking_id: number;
    razorpay_order_id: string;
    amount: number;
    currency: "INR";
    key_id: string;
  };
};
