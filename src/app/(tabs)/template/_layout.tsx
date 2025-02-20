import { Stack } from "expo-router";

const TemplateListLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[sessionID]" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TemplateListLayout;
