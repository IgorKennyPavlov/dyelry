import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";

import { listItemCommon } from "./list-item-common";
import { getIntervalSeconds, SESSIONS, useNavigate } from "../../global";
import { useTargetStore, useSessionsStore } from "../../store";

const SessionListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetSessionId } = props;

  const { navigate } = useNavigate();
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { setTargetSessionId } = useTargetStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === targetSessionId),
    [sessions, targetSessionId],
  );

  const duration = useMemo(() => {
    if (!targetSession) {
      return 0;
    }

    const { start, end } = targetSession;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetSession]);

  const openSession = useCallback(() => {
    setTargetSessionId(targetSessionId);
    navigate("/session/view");
  }, [navigate, setTargetSessionId, targetSessionId]);

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSession?.end ? "gray" : "orange",
      }}
      onPress={openSession}
    >
      <Text>Start:</Text>
      <Text>{targetSession?.start.toLocaleString("ru-RU")}</Text>
      {targetSession?.end && (
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
