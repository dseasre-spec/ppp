import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen
        name="player/[id]"
        options={{
          animation: 'slide_from_bottom',
          presentation: 'fullScreenModal',
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}
