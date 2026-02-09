import { Stack } from 'expo-router';

export default function AccountTabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="settings" />
      <Stack.Screen name="mylistings" />
      <Stack.Screen name="newlisting" />
    </Stack>
  );
}
