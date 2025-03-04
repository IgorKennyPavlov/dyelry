import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, Pressable } from "react-native";
import type { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

import {
  listItemCommonStyles,
  getIntervalSeconds,
  getSessionInterval,
} from "../../global";
import type { SessionProps } from "../../global/types";
import { router } from "expo-router";
import { uuid } from "expo-modules-core";
import { useSessionsStore } from "../../store";
import { useTranslation } from "react-i18next";

type SessionListItemProps = ListRenderItemInfo<SessionProps> & {
  isTemplate?: boolean;
};

const REPLACER = ["id", "title", "exercises", "sets", "weight", "reps", "side"];

export const SessionListItem = (props: SessionListItemProps) => {
  const { item: targetSession, isTemplate } = props;
  const basePart = isTemplate ? "template" : "session";
  const { t } = useTranslation();

  const { addSession } = useSessionsStore();

  const duration = useMemo(() => {
    if (!targetSession) return 0;

    const [start, end] = getSessionInterval(targetSession);

    if (!start) return 0;

    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetSession]);

  const openSession = useCallback(() => {
    router.push({
      pathname: `/${basePart}/[sessionID]`,
      params: { sessionID: targetSession.id },
    });
  }, [targetSession.id]);

  const editSession = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      router.push({
        pathname: `/${basePart}/editor`,
        params: { sessionID: targetSession.id },
      });
    },
    [targetSession.id],
  );

  const targetSessionInterval = useMemo(
    () => getSessionInterval(targetSession),
    [targetSession],
  );

  const createSession = useCallback(() => {
    if (!targetSession) return;

    const tplString = JSON.stringify(targetSession, REPLACER);
    const sessionCopy: SessionProps = JSON.parse(
      tplString,
      (key: string, value: unknown) => (key === "id" ? uuid.v4() : value),
    );

    addSession(sessionCopy);
    router.push("session");
  }, [targetSession, addSession]);

  return (
    <Pressable style={styles.plaque} onPress={openSession}>
      {!isTemplate && (
        <Text style={{ width: "25%" }}>
          {targetSessionInterval[0]?.toLocaleDateString("ru-RU") || "--"}
        </Text>
      )}

      <Text style={{ width: isTemplate ? "75%" : "45%" }} numberOfLines={2}>
        {targetSession?.title}
      </Text>

      {!isTemplate && (
        <Text style={{ width: "20%" }}>
          {targetSessionInterval[1] ? `~${duration} ${t("min")}` : "--"}
        </Text>
      )}

      {isTemplate && (
        <Pressable style={{ width: "15%" }} onPress={createSession}>
          <MCI name="plus" size={32} color="#444" />
        </Pressable>
      )}

      <Pressable style={{ width: "10%" }} onPress={editSession}>
        <MCI name="pencil-circle-outline" size={32} color="#444" />
      </Pressable>
    </Pressable>
  );
};

const styles = listItemCommonStyles;
