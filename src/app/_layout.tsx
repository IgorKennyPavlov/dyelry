import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { useEffect } from "react";
import { Text, Button } from "react-native";

import { useSessionsStore, useHydrated } from "../store";

const AppLayout = () => {
  useEffect(() => {
    useSessionsStore.persist.rehydrate();
  }, []);

  const { clearStore } = useSessionsStore();
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
      <Tabs.Screen
        name="index"
        options={{
          title: "Session List",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="list-outline"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="impex"
        options={{
          title: "Impex",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="import-export"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="information"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />
      <Tabs.Screen name="session" options={{ title: "Session", href: null }} />
    </Tabs>
  );
};

export default AppLayout;
