import { Stack } from "expo-router";

const ExerciseDataLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ExerciseDataLayout;
