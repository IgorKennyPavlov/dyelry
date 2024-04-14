import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { getIntervalSeconds, SESSIONS } from "../global";
import { useTargetStore, useSessionsStore } from "../store";

const SessionListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetSessionId } = props;

  const router = useRouter();
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { setTargetSessionId } = useTargetStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === targetSessionId),
    [sessions, targetSessionId],
  );

  const duration = useMemo(() => {
    const { start, end } = targetSession;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetSession]);

  const openSession = () => {
    setTargetSessionId(targetSessionId);
    router.push("/session/view");
  };

  return (
    <Pressable style={styles.sessionPlaque} onPress={openSession}>
      <Text>Start:</Text>
      <Text>{targetSession.start.toLocaleString("ru-RU")}</Text>
      {targetSession.end && (
        <>
          <Text>Duration:</Text>
          <Text>{duration} min</Text>
        </>
      )}
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
