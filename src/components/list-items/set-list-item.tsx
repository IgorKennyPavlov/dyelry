import { useFocusEffect } from "expo-router";
import type { MutableRefObject } from "react";
import { useRef, useState, useCallback, useMemo } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import type { SetProps } from "../../global";
import {
  FeelsReadable,
  getIntervalSeconds,
  useNavigate,
  FeelsColors,
  Feels,
  reduceSeconds,
  SESSIONS,
} from "../../global";
import {
  useTargetStore,
  useTargetSelectors,
  usePersistentStore,
} from "../../store";

export const SetListItem = (props: ListRenderItemInfo<SetProps>) => {
  const { item: targetSet } = props;

  const { navigate } = useNavigate();
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { setTargetSetId } = useTargetStore();
  const { targetSession, targetExercise } = useTargetSelectors();

  const intervalId: MutableRefObject<number | null> = useRef(null);
  const [rest, setRest] = useState("--");

  const duration = useMemo(() => {
    if (!targetSet) {
      return 0;
    }

    const { start, end } = targetSet;
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

      if (nextSet) {
        const { start } = nextSet;
        setRest(reduceSeconds(getIntervalSeconds(start, targetSet.end)));
        return;
      }

      const targetExerciseIdx = targetSession.exercises.indexOf(targetExercise);
      const nextExercise = targetSession.exercises[targetExerciseIdx + 1];
      const nextExerciseFirstSet = nextExercise?.sets?.[0];

      if (nextExerciseFirstSet) {
        const { start } = nextExerciseFirstSet;
        setRest(reduceSeconds(getIntervalSeconds(start, targetSet.end)));
        return;
      }

      const targetSessionIdx = sessions.indexOf(targetSession);
      const nextSession = sessions[targetSessionIdx + 1];
      const nextSessionFirstSet = nextSession?.exercises?.[0]?.sets?.[0];

      if (nextSessionFirstSet) {
        const { start } = nextSessionFirstSet;
        setRest(reduceSeconds(getIntervalSeconds(start, targetSet.end)));
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
    setTargetSetId(targetSet.id);
    navigate("/set-editor");
  }, [navigate, setTargetSetId, targetSet.id]);

  const openTimer = useCallback(() => {
    setTargetSetId(targetSet.id);
    navigate("/timer");
  }, [navigate, setTargetSetId, targetSet.id]);

  const isTimerRunning = useMemo(
    () => intervalId.current && !targetExercise?.end,
    [targetExercise?.end],
  );

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSet.end ? "gray" : "orange",
      }}
      onPress={targetSet.end ? openExerciseSet : openTimer}
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
        {FeelsReadable.get(targetSet.feels as Feels)}
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
