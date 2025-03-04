import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useTabBarStore } from "../../store";
import { HeaderMenu } from "../../components";
import { useTranslation } from "react-i18next";

const AppTabs = () => {
  const { t } = useTranslation();
  const { isTabBarVisible } = useTabBarStore();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#1c357f" },
        headerTintColor: "#fff",
        tabBarHideOnKeyboard: true,
        tabBarStyle: { display: isTabBarVisible ? "flex" : "none" },
        headerRight: () => <HeaderMenu />,
        headerRightContainerStyle: { paddingHorizontal: 12 },
      }}
    >
      <Tabs.Screen name="index" options={{ href: null }} />

      <Tabs.Screen
        name="session"
        options={{
          title: t("header.sessionList"),
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
          title: t("header.templates"),
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
          title: t("header.exerciseData"),
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
          title: t("header.stats"),
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
          title: t("header.impex"),
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
