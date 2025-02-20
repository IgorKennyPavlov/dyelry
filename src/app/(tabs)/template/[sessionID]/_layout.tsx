import { Stack } from "expo-router";

const TemplateSessionLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="exercise/[exerciseID]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
};

export default TemplateSessionLayout;
