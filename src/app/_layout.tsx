import { Tabs } from "expo-router";

const AppLayout = () => {
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
