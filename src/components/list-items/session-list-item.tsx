import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";
import type { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

import { listItemCommonStyles } from "./list-item-common-styles";
import type { SessionProps } from "../../global";
import { getIntervalSeconds, useNavigate } from "../../global";
import { useTargetStore } from "../../store";

export const SessionListItem = (props: ListRenderItemInfo<SessionProps>) => {
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
    navigate("/session");
  }, [navigate, setTargetSessionId, targetSession.id]);

  const editSession = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      setTargetSessionId(targetSession.id);
      navigate("/session-editor");
    },
    [navigate, setTargetSessionId, targetSession.id],
  );

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSession?.end ? "gray" : "orange",
      }}
      onPress={openSession}
    >
      <Text style={{ width: "25%" }}>
        {targetSession?.start.toLocaleDateString("ru-RU")}
      </Text>
      <Text style={{ width: "45%" }}>{targetSession?.title}</Text>
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
