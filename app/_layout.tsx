import { Stack } from "expo-router";

export default function RootLayout() {
  const user = false; // Replace with your authentication logic
  return (
    <Stack>
      <Stack.Protected guard={user}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!user}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
