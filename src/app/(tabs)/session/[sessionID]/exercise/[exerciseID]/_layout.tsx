import { Stack } from "expo-router";

const ExerciseLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};

export default ExerciseLayout;
