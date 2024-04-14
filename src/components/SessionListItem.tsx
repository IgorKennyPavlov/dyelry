import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { SessionProps, getIntervalSeconds } from "../global";

const SessionListItem = ({ item }: ListRenderItemInfo<SessionProps>) => {
  const router = useRouter();
  const duration = useMemo(
    () => Math.round(getIntervalSeconds(item.end, item.start) / 60),
    [item.end, item.start],
  );

  const openSession = () => router.push(`/session/${item.id}`);

  return (
    <Pressable style={styles.sessionPlaque} onPress={openSession}>
      <Text>Start:</Text>
      <Text>{item.start.toLocaleString("ru-RU")}</Text>
      <Text>Duration:</Text>
      <Text>{duration} min</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sessionPlaque: {
    height: 44,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: 8,
  },
});

export default SessionListItem;
