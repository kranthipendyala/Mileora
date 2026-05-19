/**
 * Mock data for the new account/portal pages — chat, notifications, addresses.
 * Swap with real `apiUser('user').get(...)` calls once CI3 is reachable.
 */

export type Notification = {
  id: number;
  type: "booking_confirmed" | "booking_reminder" | "payment_received" | "review_received" | "system";
  title: string;
  body: string;
  cta_url?: string;
  read_at: string | null;
  created_at: string;
};

export type Address = {
  id: number;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  pincode: string;
  landmark?: string;
  is_default: 0 | 1;
};

export type ChatThread = {
  id: number;
  guide_id: number;
  guide_name: string;
  guide_photo: string;
  last_message_preview: string;
  last_message_at: string;
  unread: number;
};

export type ChatMessage = {
  id: number;
  thread_id: number;
  sender_id: number;
  sender_role: "user" | "guide" | "system";
  body: string;
  attachment_url?: string;
  created_at: string;
  read_at: string | null;
};

const min = (n: number) => new Date(Date.now() - n * 60_000).toISOString();
const hr  = (n: number) => new Date(Date.now() - n * 3600_000).toISOString();
const day = (n: number) => new Date(Date.now() - n * 86400_000).toISOString();

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1, type: "booking_confirmed",
    title: "Your reading with Pandit Suresh is confirmed",
    body: "Today at 4:30 PM. Tap to view the video call link.",
    cta_url: "/account/bookings/MIL-1042",
    read_at: null, created_at: min(2),
  },
  {
    id: 2, type: "booking_reminder",
    title: "Reminder: Kashi Rudrabhishek puja tomorrow",
    body: "Live stream begins at 8:00 AM. Make sure your sankalpam is correct.",
    cta_url: "/account/bookings/MIL-1041",
    read_at: null, created_at: hr(3),
  },
  {
    id: 3, type: "payment_received",
    title: "Payment received: ₹999",
    body: "Booking MIL-1040 has been confirmed.",
    cta_url: "/account/bookings/MIL-1040",
    read_at: day(1), created_at: day(1),
  },
  {
    id: 4, type: "review_received",
    title: "Pandit Suresh thanked you for your review",
    body: "Your 5-star review means the world. Namaste 🙏",
    read_at: day(2), created_at: day(2),
  },
  {
    id: 5, type: "system",
    title: "Welcome to Mileora",
    body: "Your account is set up. Get your free kundli to begin.",
    cta_url: "/free/kundli",
    read_at: day(4), created_at: day(5),
  },
];

export const MOCK_ADDRESSES: Address[] = [
  {
    id: 1, label: "home",
    name: "Anitha Ramaswamy", phone: "9876543210",
    line1: "12B, Lotus Apartments, 4th Cross St",
    line2: "Adyar",
    pincode: "600020",
    landmark: "Near Adyar Bus Depot",
    is_default: 1,
  },
  {
    id: 2, label: "mom",
    name: "Saraswathi Ramaswamy", phone: "9876543211",
    line1: "8 Brindavan Street",
    pincode: "627001",
    landmark: "T. Nagar",
    is_default: 0,
  },
];

export const MOCK_THREADS: ChatThread[] = [
  {
    id: 101, guide_id: 1,
    guide_name: "Pandit Suresh Iyer",
    guide_photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=80",
    last_message_preview: "Please share your exact birth time once more.",
    last_message_at: min(8),
    unread: 2,
  },
  {
    id: 102, guide_id: 2,
    guide_name: "Dr. Meera Shastri",
    guide_photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    last_message_preview: "Your numerology report PDF has been delivered.",
    last_message_at: hr(5),
    unread: 0,
  },
  {
    id: 103, guide_id: 3,
    guide_name: "Acharya Rajesh Kumar",
    guide_photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    last_message_preview: "I'll send the vasthu floor plan annotations by Friday.",
    last_message_at: day(2),
    unread: 0,
  },
];

export const MOCK_MESSAGES: Record<number, ChatMessage[]> = {
  101: [
    { id: 1, thread_id: 101, sender_id: 1, sender_role: "guide", body: "Namaste Anitha. I have received your kundli details.", created_at: day(1), read_at: hr(20) },
    { id: 2, thread_id: 101, sender_id: 4821, sender_role: "user", body: "Thank you Panditji! Looking forward to our session today.", created_at: day(1), read_at: hr(20) },
    { id: 3, thread_id: 101, sender_id: 1, sender_role: "guide", body: "Before we begin, one clarification — was 14:35 IST your exact time of birth or approximate?", created_at: min(15), read_at: null },
    { id: 4, thread_id: 101, sender_id: 1, sender_role: "guide", body: "Please share your exact birth time once more.", created_at: min(8), read_at: null },
  ],
  102: [
    { id: 1, thread_id: 102, sender_id: 2, sender_role: "guide", body: "Your numerology report PDF has been delivered.", created_at: hr(5), read_at: hr(4) },
  ],
  103: [
    { id: 1, thread_id: 103, sender_id: 3, sender_role: "guide", body: "I'll send the vasthu floor plan annotations by Friday.", created_at: day(2), read_at: day(1) },
  ],
};
