import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Text, Button } from "react-native";

import { useStore, useHydrated } from "../store";

const AppLayout = () => {
  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  const { clearStore } = useStore();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <>
        <Text>Loading...</Text>
        <Button title="Clear store" color="red" onPress={clearStore} />
      </>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1c357f",
        },
        headerTintColor: "#fff",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Session List" }} />
      <Tabs.Screen
        name="session"
        options={{ title: "New session", href: null }}
      />
      <Tabs.Screen name="about" options={{ title: "About" }} />
    </Tabs>
  );
};

export default AppLayout;
