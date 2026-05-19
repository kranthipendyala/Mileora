import { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Send, Paperclip } from "lucide-react-native";
import { fmtTime } from "@/lib/format";

type Msg = { id: number; sender_role: "user" | "guide" | "system"; body: string; at: string };

// TODO: api.get<Envelope<Msg[]>>(`/chat/threads/${threadId}/messages`)
const SEED: Msg[] = [
  { id: 1, sender_role: "user",  body: "Namaste Panditji 🙏 Looking forward to today's session.", at: new Date(Date.now() - 60_000 * 60 * 6).toISOString() },
  { id: 2, sender_role: "guide", body: "Namaste Anitha. I have your kundli ready. Quick check — was 14:35 IST your exact birth time, or approximate?", at: new Date(Date.now() - 60_000 * 60 * 5).toISOString() },
  { id: 3, sender_role: "user",  body: "It's from my hospital records, so it should be exact.", at: new Date(Date.now() - 60_000 * 60 * 4).toISOString() },
  { id: 4, sender_role: "guide", body: "Perfect. We'll start at 4:30 sharp. Please prepare a quiet space with your phone fully charged 🙏", at: new Date(Date.now() - 60_000 * 15).toISOString() },
];

export default function GuideChatThread() {
  const { threadId } = useLocalSearchParams<{ threadId: string }>();
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
  }, [messages.length]);

  function send() {
    const body = draft.trim();
    if (!body) return;
    // TODO: api.post(`/chat/threads/${threadId}/messages`, { body })
    setMessages((m) => [
      ...m,
      { id: Date.now(), sender_role: "guide", body, at: new Date().toISOString() },
    ]);
    setDraft("");
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-bg"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
      >
        {messages.map((m) => {
          const mine = m.sender_role === "guide";
          return (
            <View key={m.id} className={`max-w-[80%] ${mine ? "self-end" : "self-start"}`}>
              <View className={`rounded-2xl px-4 py-2 ${
                mine ? "bg-gold-500/15 rounded-br-sm" : "bg-surface rounded-bl-sm"
              }`}>
                <Text className="text-text leading-relaxed">{m.body}</Text>
              </View>
              <Text className={`text-muted text-[10px] mt-1 ${mine ? "text-right" : "text-left"}`}>
                {fmtTime(m.at)}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Composer */}
      <View className="flex-row items-center gap-2 px-3 py-2 border-t border-border bg-surface/60">
        <Pressable className="p-2 rounded-md" hitSlop={6}>
          <Paperclip color="#a9a3b8" size={16} />
        </Pressable>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Type a message…"
          placeholderTextColor="#a9a3b8"
          className="flex-1 rounded-md border border-border bg-bg/60 px-3 py-2 text-text"
          multiline
        />
        <Pressable
          onPress={send}
          disabled={!draft.trim()}
          className={`rounded-md px-3 py-2 flex-row items-center gap-1 ${
            draft.trim() ? "bg-gold-500" : "bg-bg/60 border border-border"
          }`}
        >
          <Send color={draft.trim() ? "#0b0a14" : "#a9a3b8"} size={14} />
          <Text className={draft.trim() ? "text-bg font-semibold" : "text-muted"}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
