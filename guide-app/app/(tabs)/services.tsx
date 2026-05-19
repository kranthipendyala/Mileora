import { useState } from "react";
import { View, Text, ScrollView, Pressable, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Plus, Edit2, Trash2, Eye, EyeOff, Tag, X } from "lucide-react-native";
import { formatINR } from "@/lib/format";

type Category = { id: number; name: string };
type Service = {
  id: number; category_id: number; category_name: string;
  name: string; description: string | null;
  base_price_paise: number; discounted_price_paise: number | null;
  duration_minutes: number;
  delivery_mode: "video" | "voice" | "chat" | "in_person" | "async_report" | "online_puja";
  is_active: 0 | 1;
};

// TODO: api.get<Envelope<Category[]>>('/categories') + api.get<Envelope<Service[]>>('/guide/services')
const CATEGORIES: Category[] = [
  { id: 1, name: "Vedic Astrology" },
  { id: 2, name: "Numerology" },
  { id: 3, name: "Vasthu Shastra" },
  { id: 4, name: "Tamil Jothisyam" },
  { id: 5, name: "Online Puja" },
  { id: 6, name: "Kundli Matching" },
  { id: 7, name: "Tarot Reading" },
  { id: 8, name: "Daily Horoscope" },
  { id: 9, name: "Remedial Pujas" },
];

const INITIAL_SERVICES: Service[] = [
  { id: 1, category_id: 1, category_name: "Vedic Astrology", name: "30-min Vedic Birth Chart Reading", description: "Focused reading of rasi, navamsa, current dasha.", base_price_paise: 99900,  discounted_price_paise: null, duration_minutes: 30, delivery_mode: "video", is_active: 1 },
  { id: 2, category_id: 1, category_name: "Vedic Astrology", name: "60-min Annual Forecast",            description: "12-month varshphal with PDF.",                       base_price_paise: 249900, discounted_price_paise: 199900, duration_minutes: 60, delivery_mode: "video", is_active: 1 },
  { id: 3, category_id: 4, category_name: "Tamil Jothisyam", name: "Marriage Porutham",                  description: "10-porutham analysis in Tamil or English.",          base_price_paise: 149900, discounted_price_paise: null, duration_minutes: 45, delivery_mode: "video", is_active: 1 },
];

export default function GuideServicesScreen() {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);

  function toggle(id: number) {
    setServices((all) => all.map((s) => s.id === id ? { ...s, is_active: s.is_active === 1 ? 0 : 1 } : s));
    // TODO: api.post(`/guide/services/${id}/toggle`)
  }
  function remove(id: number) {
    Alert.alert("Delete service?", "This can't be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => {
          setServices((all) => all.filter((s) => s.id !== id));
          // TODO: api.delete(`/guide/services/${id}`)
        } },
    ]);
  }
  function onSaved(saved: Service) {
    setServices((all) => {
      const existing = all.find((s) => s.id === saved.id);
      if (existing) return all.map((s) => s.id === saved.id ? saved : s);
      return [...all, saved];
    });
    setShowForm(false);
    setEditing(null);
  }

  return (
    <View className="flex-1 bg-bg">
      <View className="px-4 pt-3 pb-2 flex-row items-center justify-between">
        <Text className="text-text font-serif text-xl">My services</Text>
        <Pressable
          onPress={() => { setEditing(null); setShowForm(true); }}
          className="flex-row items-center gap-1 rounded-md bg-gold-500 px-3 py-1.5"
        >
          <Plus color="#0b0a14" size={14} />
          <Text className="text-bg font-semibold text-xs">Add</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
        {services.length === 0 ? (
          <View className="items-center py-16">
            <Tag color="#f1cb5b" size={28} />
            <Text className="text-text mt-4">No services yet.</Text>
            <Text className="text-muted text-xs text-center mt-1 px-8">
              Add at least one so seekers can find and book you.
            </Text>
          </View>
        ) : (
          services.map((s) => (
            <View key={s.id} className={`rounded-2xl bg-surface border border-border p-4 ${s.is_active === 0 ? "opacity-60" : ""}`}>
              <View className="flex-row items-start justify-between gap-2">
                <View className="flex-1 min-w-0">
                  <Text className="text-gold-300 text-[10px] uppercase tracking-widest">{s.category_name}</Text>
                  <Text className="text-text mt-1 font-medium" numberOfLines={2}>{s.name}</Text>
                  {s.description && <Text className="text-muted text-xs mt-1" numberOfLines={2}>{s.description}</Text>}
                  <View className="flex-row items-baseline gap-2 mt-2">
                    <Text className="text-text font-medium">{formatINR(s.discounted_price_paise ?? s.base_price_paise)}</Text>
                    {s.discounted_price_paise && s.discounted_price_paise < s.base_price_paise && (
                      <Text className="text-muted text-xs line-through">{formatINR(s.base_price_paise)}</Text>
                    )}
                    <Text className="text-muted text-xs">· {s.duration_minutes} min · {s.delivery_mode.replace("_", " ")}</Text>
                  </View>
                </View>
              </View>
              <View className="flex-row gap-1 mt-3 pt-3 border-t border-border/60">
                <Pressable onPress={() => toggle(s.id)} className="flex-1 flex-row items-center justify-center gap-1 py-1.5 rounded border border-border">
                  {s.is_active === 1
                    ? <><EyeOff color="#a9a3b8" size={12} /><Text className="text-muted text-xs">Hide</Text></>
                    : <><Eye color="#86efac" size={12} /><Text className="text-emerald-300 text-xs">Show</Text></>
                  }
                </Pressable>
                <Pressable onPress={() => { setEditing(s); setShowForm(true); }} className="flex-1 flex-row items-center justify-center gap-1 py-1.5 rounded border border-border">
                  <Edit2 color="#a9a3b8" size={12} /><Text className="text-muted text-xs">Edit</Text>
                </Pressable>
                <Pressable onPress={() => remove(s.id)} className="flex-1 flex-row items-center justify-center gap-1 py-1.5 rounded border border-rose-400/30">
                  <Trash2 color="#fda4af" size={12} /><Text className="text-rose-200 text-xs">Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {showForm && (
        <ServiceFormModal
          initial={editing}
          categories={CATEGORIES}
          nextId={Math.max(0, ...services.map((s) => s.id)) + 1}
          onCancel={() => { setShowForm(false); setEditing(null); }}
          onSaved={onSaved}
        />
      )}
    </View>
  );
}

function ServiceFormModal({ initial, categories, nextId, onCancel, onSaved }: {
  initial: Service | null;
  categories: Category[];
  nextId: number;
  onCancel: () => void;
  onSaved: (s: Service) => void;
}) {
  const [categoryId, setCategoryId] = useState<number>(initial?.category_id ?? categories[0].id);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [basePrice, setBasePrice] = useState(String(initial ? Math.round(initial.base_price_paise / 100) : ""));
  const [discountedPrice, setDiscountedPrice] = useState(String(initial?.discounted_price_paise ? Math.round(initial.discounted_price_paise / 100) : ""));
  const [durationMins, setDurationMins] = useState(String(initial?.duration_minutes ?? 30));
  const [deliveryMode, setDeliveryMode] = useState<Service["delivery_mode"]>(initial?.delivery_mode ?? "video");
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    if (name.trim().length < 3) return setError("Service name (3+ chars)");
    const base = parseInt(basePrice, 10);
    if (isNaN(base) || base < 0) return setError("Valid base price required");
    const disc = discountedPrice ? parseInt(discountedPrice, 10) : null;
    const dur = parseInt(durationMins, 10);
    if (isNaN(dur) || dur < 5 || dur > 300) return setError("Duration must be 5–300 minutes");
    const cat = categories.find((c) => c.id === categoryId);

    const saved: Service = {
      id: initial?.id ?? nextId,
      category_id: categoryId,
      category_name: cat?.name ?? "Other",
      name: name.trim(),
      description: description.trim() || null,
      base_price_paise: base * 100,
      discounted_price_paise: disc !== null && !isNaN(disc) ? disc * 100 : null,
      duration_minutes: dur,
      delivery_mode: deliveryMode,
      is_active: initial?.is_active ?? 1,
    };
    // TODO: api.post('/guide/services', saved) or .put(`/guide/services/${initial.id}`, saved)
    onSaved(saved);
  }

  const modes: { value: Service["delivery_mode"]; label: string }[] = [
    { value: "video",         label: "Video" },
    { value: "voice",         label: "Voice" },
    { value: "chat",          label: "Chat" },
    { value: "in_person",     label: "In-person" },
    { value: "async_report",  label: "PDF report" },
    { value: "online_puja",   label: "Online puja" },
  ];

  return (
    <Modal animationType="slide" transparent={false} onRequestClose={onCancel}>
      <KeyboardAvoidingView className="flex-1 bg-bg" behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-border">
          <Text className="text-text font-serif text-xl">{initial ? "Edit service" : "Add service"}</Text>
          <Pressable onPress={onCancel} className="p-2">
            <X color="#a9a3b8" size={18} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }}>
          <Field label="Category">
            <View className="flex-row flex-wrap gap-2">
              {categories.map((c) => (
                <Pressable
                  key={c.id}
                  onPress={() => setCategoryId(c.id)}
                  className={`px-3 py-1.5 rounded-full border ${
                    categoryId === c.id ? "border-gold-500 bg-gold-500/10" : "border-border bg-bg/40"
                  }`}
                >
                  <Text className={categoryId === c.id ? "text-gold-100 text-xs" : "text-muted text-xs"}>{c.name}</Text>
                </Pressable>
              ))}
            </View>
          </Field>

          <Field label="Service name">
            <TextInput
              value={name} onChangeText={setName}
              placeholder="30-min Vedic Birth Chart Reading"
              placeholderTextColor="#a9a3b8"
              className="rounded-md border border-border bg-bg/60 px-3 py-2.5 text-text"
            />
          </Field>

          <Field label="Description (optional)">
            <TextInput
              value={description} onChangeText={setDescription}
              multiline numberOfLines={3}
              placeholder="What's included?"
              placeholderTextColor="#a9a3b8"
              className="rounded-md border border-border bg-bg/60 px-3 py-2.5 text-text"
              style={{ minHeight: 70, textAlignVertical: "top" }}
            />
          </Field>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Field label="Base price (₹)">
                <TextInput
                  value={basePrice} onChangeText={setBasePrice}
                  keyboardType="numeric" placeholder="999"
                  placeholderTextColor="#a9a3b8"
                  className="rounded-md border border-border bg-bg/60 px-3 py-2.5 text-text"
                />
              </Field>
            </View>
            <View className="flex-1">
              <Field label="Discounted (₹)">
                <TextInput
                  value={discountedPrice} onChangeText={setDiscountedPrice}
                  keyboardType="numeric" placeholder="—"
                  placeholderTextColor="#a9a3b8"
                  className="rounded-md border border-border bg-bg/60 px-3 py-2.5 text-text"
                />
              </Field>
            </View>
          </View>

          <Field label="Duration (minutes)">
            <TextInput
              value={durationMins} onChangeText={setDurationMins}
              keyboardType="numeric"
              className="rounded-md border border-border bg-bg/60 px-3 py-2.5 text-text"
            />
          </Field>

          <Field label="Delivery mode">
            <View className="flex-row flex-wrap gap-2">
              {modes.map((m) => (
                <Pressable
                  key={m.value}
                  onPress={() => setDeliveryMode(m.value)}
                  className={`px-3 py-1.5 rounded-full border ${
                    deliveryMode === m.value ? "border-gold-500 bg-gold-500/10" : "border-border bg-bg/40"
                  }`}
                >
                  <Text className={deliveryMode === m.value ? "text-gold-100 text-xs" : "text-muted text-xs"}>{m.label}</Text>
                </Pressable>
              ))}
            </View>
          </Field>

          {error && <Text className="text-rose-300 text-xs">{error}</Text>}

          <Pressable onPress={save} className="rounded-md bg-gold-500 py-3 mt-2">
            <Text className="text-bg text-center font-semibold">Save service</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text className="text-muted text-[11px] uppercase tracking-widest mb-1.5">{label}</Text>
      {children}
    </View>
  );
}
