import { useRouter } from "expo-router";
import { useMemo } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";

import { listItemCommon } from "./list-item-common";
import { getIntervalSeconds, SESSIONS } from "../../global";
import { useTargetStore, useSessionsStore } from "../../store";

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
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSession.end ? "gray" : "orange",
      }}
      onPress={openSession}
    >
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

const styles = listItemCommon;

export default SessionListItem;
