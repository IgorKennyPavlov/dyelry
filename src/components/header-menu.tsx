import { LangSelector } from "./i18n";
import { Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { USERS } from "../store/keys";
import { useUsersStore } from "../store";
import { useMemo } from "react";

export const HeaderMenu = () => {
  const { [USERS]: users, signOut } = useUsersStore();

  const activeUser = useMemo(
    () => Object.keys(users).find((key) => users[key]),
    [users],
  );

  return (
    <>
      <LangSelector style={{ marginRight: 12 }} />
      <Text style={{ marginRight: 12, color: "#fff" }}>{activeUser}</Text>
      <Ionicons name="exit-outline" color="#fff" size={32} onPress={signOut} />
    </>
  );
};
