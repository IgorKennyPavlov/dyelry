import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

import { useHydrated, useTabBarStore } from "../store";

const AppLayout = () => {
  const hydrated = useHydrated();
  const { isTabBarVisible } = useTabBarStore();

  if (!hydrated) {
    return (
      <>
        <Text>LOADING...</Text>
      </>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#1c357f" },
        headerTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        tabBarStyle: { display: isTabBarVisible ? "flex" : "none" },
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
        name="exercise-constructor"
        options={{
          title: "Exercise Constructor",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="construction"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="stats-chart"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="impex"
        options={{
          title: "ImpEx",
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
        name="(sessions)"
        options={{ headerShown: false, href: null }}
      />
      <Tabs.Screen
        name="(exercise-constructor)"
        options={{ headerShown: false, href: null }}
      />
      <Tabs.Screen name="session-editor" options={{ href: null }} />
    </Tabs>
  );
};

export default AppLayout;
