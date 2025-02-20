import { Stack } from "expo-router";

const TemplateExerciseLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default TemplateExerciseLayout;
