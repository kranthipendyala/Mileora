import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={qc}>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#0b0a14" },
            headerTitleStyle: { color: "#f5f1e8" },
            headerTintColor: "#f1cb5b",
            contentStyle: { backgroundColor: "#0b0a14" },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="astrologer/[slug]" options={{ title: "Astrologer" }} />
          <Stack.Screen name="puja/[slug]" options={{ title: "Puja" }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
