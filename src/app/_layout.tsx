import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

import { useHydrated } from "../store";

const AppLayout = () => {
  const hydrated = useHydrated();

  if (!hydrated)
    return (
      <View style={styles.loading}>
        <Text>LOADING...</Text>
      </View>
    );

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AppLayout;
