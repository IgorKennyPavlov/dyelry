import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTabBarStore, useUsersStore } from "../../store";
import { useMemo } from "react";
import { Text } from "react-native";
import { USERS } from "../../store/keys";

const AppTabs = () => {
  const { isTabBarVisible } = useTabBarStore();
  const { [USERS]: users, signOut } = useUsersStore();

  const activeUser = useMemo(
    () => Object.keys(users).find((key) => users[key]),
    [users],
  );

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#1c357f" },
        headerTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        tabBarStyle: { display: isTabBarVisible ? "flex" : "none" },
        headerRight: () => (
          <>
            <Text style={{ marginRight: 12, color: "#fff" }}>{activeUser}</Text>
            <Ionicons
              name="exit-outline"
              color="#fff"
              size={32}
              onPress={signOut}
            />
          </>
        ),
        headerRightContainerStyle: { paddingHorizontal: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="session"
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
        name="template"
        options={{
          title: "Templates",
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="schema"
              size={32}
              color={focused ? "#2196F3" : "#ccc"}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="exercise-data"
        options={{
          title: "Exercise Data",
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
    </Tabs>
  );
};

export default AppTabs;
