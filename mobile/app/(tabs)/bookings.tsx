import { Text, View } from "react-native";

export default function BookingsScreen() {
  return (
    <View className="flex-1 bg-bg p-6">
      <Text className="text-text text-2xl">My Bookings</Text>
      <Text className="text-muted mt-2">
        Sign in to view your past consultations and upcoming pujas.
      </Text>
    </View>
  );
}
