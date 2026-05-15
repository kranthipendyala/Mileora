import { Text, View, Pressable } from "react-native";
import { Link } from "expo-router";

export default function AccountScreen() {
  return (
    <View className="flex-1 bg-bg p-6">
      <Text className="text-text text-2xl">Account</Text>
      <Text className="text-muted mt-2 mb-6">Sign in with your phone to access your readings & bookings.</Text>
      <Link href="/auth/login" asChild>
        <Pressable className="rounded-lg bg-gold-500 px-5 py-3 self-start">
          <Text className="text-bg font-semibold">Sign in with phone</Text>
        </Pressable>
      </Link>
    </View>
  );
}
