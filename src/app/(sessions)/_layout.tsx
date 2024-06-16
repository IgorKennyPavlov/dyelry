import { Stack } from "expo-router";

const SessionLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="session" />
      <Stack.Screen name="exercise" />
      <Stack.Screen name="exercise-editor" />
      <Stack.Screen name="timer" />
      <Stack.Screen name="set-editor" />
    </Stack>
  );
};

export default SessionLayout;
