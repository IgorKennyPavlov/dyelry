import { Stack } from "expo-router";
import { Text } from "react-native";

import { useHydrated } from "../store";

const AppLayout = () => {
  const hydrated = useHydrated();

  if (!hydrated) {
    return <Text>LOADING...</Text>;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AppLayout;
