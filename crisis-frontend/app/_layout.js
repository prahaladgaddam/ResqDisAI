// crisis-frontend/app/_layout.js
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="help-form" options={{ title: 'Submit Help Request' }} />
      <Stack.Screen name="success" options={{ title: 'Request Submitted', presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="admin-dashboard" options={{ title: 'Admin Dashboard', headerShown: false }} /> {/* No header for custom top bar */}
      <Stack.Screen name="map-picker" options={{ title: 'Select Location on Map', presentation: 'modal' }} />
    </Stack>
  );
}