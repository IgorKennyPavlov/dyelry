import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import { getIntervalSeconds, useNavigate, SessionProps } from "../../global";
import { useTargetStore } from "../../store";

const SessionListItem = (props: ListRenderItemInfo<SessionProps>) => {
  const { item: targetSession } = props;

  const { navigate } = useNavigate();
  const { setTargetSessionId } = useTargetStore();

  const duration = useMemo(() => {
    if (!targetSession) {
      return 0;
    }

    const { start, end } = targetSession;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetSession]);

  const openSession = useCallback(() => {
    setTargetSessionId(targetSession.id);
    navigate("/session/view");
  }, [navigate, setTargetSessionId, targetSession.id]);

  const editSession = useCallback(() => {
    setTargetSessionId(targetSession.id);
    navigate("/session/session-editor");
  }, [navigate, setTargetSessionId, targetSession.id]);

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSession?.end ? "gray" : "orange",
      }}
      onPress={openSession}
    >
      <Text style={{ width: "20%" }}>
        {targetSession?.start.toLocaleDateString("ru-RU")}
      </Text>
      <Text style={{ width: "50%" }}>{targetSession?.title}</Text>
      <Text style={{ width: "20%" }}>
        {targetSession?.end ? `~${duration} min` : "--"}
      </Text>

      <Pressable onPress={editSession}>
        <MCI name="pencil-circle-outline" size={32} color="#444" />
      </Pressable>
    </Pressable>
  );
};

const styles = listItemCommonStyles;

export default SessionListItem;
