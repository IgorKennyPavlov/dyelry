import { Stack } from "expo-router";

const SessionListLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[sessionID]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default SessionListLayout;
