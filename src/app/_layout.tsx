import { Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { useUsersStore } from "../store";
import { useHydrated } from "../global";
import { useMemo } from "react";
import { UserSelector } from "../components";
import { USERS } from "../store/keys";
import "../global/i18n/i18n";
import { useTranslation } from "react-i18next";

const AppLayout = () => {
  const { t } = useTranslation();
  const hydrated = useHydrated();

  const { [USERS]: users } = useUsersStore();

  const activeUser = useMemo(
    () => Object.keys(users).find((key) => users[key]),
    [users],
  );

  if (!hydrated) {
    return (
      <View style={styles.loading}>
        <Text>{t("loading").toUpperCase()}...</Text>
      </View>
    );
  }

  if (!activeUser) {
    return <UserSelector />;
  }

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
