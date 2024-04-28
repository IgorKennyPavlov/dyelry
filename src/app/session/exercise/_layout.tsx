import { Stack } from "expo-router";

const ExerciseLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="exercise-set" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ExerciseLayout;
