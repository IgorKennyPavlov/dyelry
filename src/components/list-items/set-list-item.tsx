import { useFocusEffect } from "expo-router";
import {
  useRef,
  useState,
  useCallback,
  useMemo,
  MutableRefObject,
} from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import {
  FeelsReadable,
  getIntervalSeconds,
  useNavigate,
  FeelsColors,
  SetProps,
  Feels,
  reduceSeconds,
} from "../../global";
import { useTargetStore, useTarget } from "../../store";

export const SetListItem = (props: ListRenderItemInfo<SetProps>) => {
  const { item: targetSet } = props;

  const { navigate } = useNavigate();
  const { setTargetSetId } = useTargetStore();
  const { targetSession, targetExercise } = useTarget();

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
      ) {
        return;
      }

      if (targetSet !== targetExercise.sets.at(-1)) {
        const targetSetIdx = targetExercise.sets.indexOf(targetSet);
        const nextSetStart = targetExercise.sets[targetSetIdx + 1].start;
        setRest(reduceSeconds(getIntervalSeconds(nextSetStart, targetSet.end)));
        return;
      }

      const targetExerciseIdx = targetSession.exercises.indexOf(targetExercise);
      const nextExercise = targetSession.exercises[targetExerciseIdx + 1];
      const nextExerciseFirstSet = nextExercise?.sets?.[0];

      if (nextExerciseFirstSet) {
        const { start } = nextExerciseFirstSet;
        const seconds = getIntervalSeconds(start, targetSet.end);
        setRest(reduceSeconds(seconds));
        return;
      }

      intervalId.current = window.setInterval(() => {
        const seconds = getIntervalSeconds(new Date(), targetSet.end as Date);
        setRest(reduceSeconds(seconds));
      }, 1000);

      return () => clearInterval(intervalId.current as number);
    }, [targetExercise, targetSession?.exercises, targetSet]),
  );

  const openExerciseSet = useCallback(() => {
    setTargetSetId(targetSet.id);
    navigate("/session/exercise/exercise-set/set-editor");
  }, [navigate, setTargetSetId, targetSet.id]);

  const openTimer = useCallback(() => {
    setTargetSetId(targetSet.id);
    navigate("/session/exercise/exercise-set/timer");
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
