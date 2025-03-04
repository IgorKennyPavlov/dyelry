import { useFocusEffect, router } from "expo-router";
import type { MutableRefObject } from "react";
import { useRef, useState, useCallback, useMemo } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import {
  listItemCommonStyles,
  FeelsReadable,
  getIntervalSeconds,
  FeelsColors,
  Feels,
  reduceSeconds,
  getExerciseInterval,
} from "../../../../global";
import type { SetProps } from "../../../../global/types";
import { useSessionsStore, useTemplatesStore } from "../../../../store";
import { TEMPLATES, SESSIONS } from "../../../../store/keys";
import { useTranslation } from "react-i18next";

type SetListItemProps = ListRenderItemInfo<SetProps> & {
  sessionID: string;
  exerciseID: string;
  isTemplate?: boolean;
};

export const SetListItem = (props: SetListItemProps) => {
  const { item: targetSet, sessionID, exerciseID, isTemplate } = props;
  const { t } = useTranslation();

  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;

  const { [storeKey]: sessions } = useStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const targetExercise = useMemo(
    () => targetSession?.exercises.find((e) => e.id === exerciseID),
    [targetSession, exerciseID],
  );

  const intervalId: MutableRefObject<number | null> = useRef(null);
  const [rest, setRest] = useState("--");

  const duration = useMemo(() => {
    if (!targetSet) return 0;

    const { start, end } = targetSet;

    if (!start) return 0;

    return end ? Math.round(getIntervalSeconds(end, start)) : 0;
  }, [targetSet]);

  useFocusEffect(
    useCallback(() => {
      if (
        !targetSession?.exercises ||
        !targetExercise?.sets?.length ||
        !targetSet.end
      )
        return;

      const targetSetIdx = targetExercise.sets.indexOf(targetSet);
      const nextSet = targetExercise.sets[targetSetIdx + 1];

      if (nextSet?.start) {
        const interval = getIntervalSeconds(nextSet.start, targetSet.end);
        setRest(reduceSeconds(interval));
        return;
      }

      const targetExerciseIdx = targetSession.exercises.indexOf(targetExercise);
      const nextExercise = targetSession.exercises[targetExerciseIdx + 1];
      const nextExerciseFirstSet = nextExercise?.sets?.[0];

      if (nextExerciseFirstSet?.start) {
        const interval = getIntervalSeconds(
          nextExerciseFirstSet.start,
          targetSet.end,
        );
        setRest(reduceSeconds(interval));
        return;
      }

      const targetSessionIdx = sessions.indexOf(targetSession);
      const nextSession = sessions[targetSessionIdx + 1];
      const nextSessionFirstSet = nextSession?.exercises?.[0]?.sets?.[0];

      if (nextSessionFirstSet?.start) {
        const interval = getIntervalSeconds(
          nextSessionFirstSet.start,
          targetSet.end,
        );
        setRest(reduceSeconds(interval));
        return;
      }

      intervalId.current = window.setInterval(() => {
        const seconds = getIntervalSeconds(new Date(), targetSet.end as Date);
        setRest(reduceSeconds(seconds));
      }, 1000);

      return () => clearInterval(intervalId.current as number);
    }, [sessions, targetExercise, targetSession, targetSet]),
  );

  const openExerciseSet = useCallback(() => {
    router.push({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]/set/[setID]`,
      params: { sessionID, exerciseID, setID: targetSet.id },
    });
  }, [targetSet.id]);

  const openTimer = useCallback(() => {
    router.push({
      pathname: `/session/[sessionID]/exercise/[exerciseID]/set/timer`,
      params: { sessionID, exerciseID, setID: targetSet.id },
    });
  }, [targetSet.id]);

  const isTimerRunning = useMemo(
    () => intervalId.current && !getExerciseInterval(targetExercise)[1],
    [targetExercise],
  );

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSet.end ? "gray" : "orange",
      }}
      onPress={targetSet.end || isTemplate ? openExerciseSet : openTimer}
    >
      <Text style={{ width: "15%" }}>{targetSet.weight}</Text>
      <Text style={{ width: "15%" }}>{targetSet.reps}</Text>
      <Text style={{ width: "20%" }}>
        {targetSet?.end ? `${duration}s` : "--"}
      </Text>

      <Text
        style={{
          width: "30%",
          color: FeelsColors.get(targetSet.feels as Feels),
        }}
      >
        {t(FeelsReadable.get(targetSet.feels as Feels))}
      </Text>

      <Text
        style={{
          width: "20%",
          ...(isTimerRunning ? styles.runningTimer : {}),
        }}
      >
        {rest}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  runningTimer: { color: "green" },
});
