import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Text, Button } from "react-native";

import { usePersistentStore, useHydrated, useTabBarStore } from "../store";

/**
 * DO NOT REMOVE! Check if helps with unwanted routing to session-editor
 * https://docs.expo.dev/router/reference/faq/#missing-back-button
 */
export const unstable_settings = { initialRouteName: "index" };

const AppLayout = () => {
  const { clearStore } = usePersistentStore();
  const hydrated = useHydrated();
  const { isTabBarVisible } = useTabBarStore();

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
        name="session"
        options={{ headerShown: false, href: null }}
      />
    </Tabs>
  );
};

export default AppLayout;
