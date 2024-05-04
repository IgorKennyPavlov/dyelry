import {
  useEffect,
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
} from "../../global";
import { useTargetStore } from "../../store";
import { useTarget } from "../../store/useTarget";

export const SetListItem = (props: ListRenderItemInfo<SetProps>) => {
  const { item: targetSet } = props;

  const { navigate } = useNavigate();
  const { setTargetSetId } = useTargetStore();

  const intervalId: MutableRefObject<number | null> = useRef(null);
  const [rest, setRest] = useState(0);

  const { targetExercise } = useTarget();
  const targetSetIdx = useMemo(
    () => targetExercise?.sets?.indexOf(targetSet) as number,
    [targetExercise?.sets, targetSet],
  );

  const duration = useMemo(() => {
    if (!targetSet) {
      return 0;
    }

    const { start, end } = targetSet;
    return end ? Math.round(getIntervalSeconds(end, start)) : 0;
  }, [targetSet]);

  useEffect(() => {
    if (!targetExercise?.sets?.length) {
      return;
    }

    if (targetSet !== targetExercise.sets.at(-1)) {
      const nextSetStart = targetExercise.sets[targetSetIdx + 1].start;
      setRest(getIntervalSeconds(nextSetStart, targetSet.end as Date));
      return;
    }

    if (targetExercise.end) {
      setRest(getIntervalSeconds(targetExercise.end, targetSet.end as Date));
      return;
    }

    if (!targetSet.end) {
      return;
    }

    intervalId.current = window.setInterval(() => {
      setRest(getIntervalSeconds(new Date(), targetSet.end as Date));
    }, 1000);

    return () => clearInterval(intervalId.current as number);
  }, [
    targetExercise?.end,
    targetExercise?.sets,
    targetSet,
    targetSet.end,
    targetSetIdx,
  ]);

  const openExerciseSet = useCallback(() => {
    setTargetSetId(targetSet.id);
    navigate("/session/exercise/exercise-set/set-editor");
  }, [navigate, setTargetSetId, targetSet.id]);

  const openTimer = useCallback(() => {
    setTargetSetId(targetSet.id);
    navigate("/session/exercise/exercise-set/timer");
  }, [navigate, setTargetSetId, targetSet.id]);

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
      <Text style={{ width: "30%" }}>
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
          width: "10%",
          ...(intervalId.current ? styles.runningTimer : {}),
        }}
      >
        {rest}s
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  runningTimer: { color: "green" },
});
