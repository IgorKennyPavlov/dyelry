import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
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

  const editSession = useCallback(() => {
    setTargetSessionId(targetSessionId);
    navigate("/session/session-editor");
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
          <Text>~{duration} min</Text>
        </>
      )}

      <Pressable onPress={editSession}>
        <MCI name="pencil-circle-outline" size={32} color="#444" />
      </Pressable>
    </Pressable>
  );
};

const styles = listItemCommonStyles;

export default SessionListItem;
