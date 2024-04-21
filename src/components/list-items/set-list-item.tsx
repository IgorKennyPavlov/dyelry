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

const SetListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetSetId } = props;

  const { navigate } = useNavigate();
  const { setTargetSetId } = useTargetStore();

  const intervalId: MutableRefObject<number | null> = useRef(null);
  const [rest, setRest] = useState(0);

  const { targetExercise } = useTarget();

  const targetSet = useMemo(
    () => targetExercise?.sets?.find((e) => e.id === targetSetId) as SetProps,
    [targetExercise?.sets, targetSetId],
  );
  const targetSetIdx = useMemo(
    () => targetExercise?.sets?.indexOf(targetSet) as number,
    [targetExercise?.sets, targetSet],
  );

  useEffect(() => {
    if (!targetExercise?.sets) {
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
    setTargetSetId(targetSetId);
    navigate("/session/exercise/exercise-set/set-editor");
  }, [navigate, setTargetSetId, targetSetId]);

  const openTimer = useCallback(() => {
    setTargetSetId(targetSetId);
    navigate("/session/exercise/exercise-set/timer");
  }, [navigate, setTargetSetId, targetSetId]);

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetSet.end ? "gray" : "orange",
      }}
      onPress={targetSet.end ? openExerciseSet : openTimer}
    >
      <Text>Reps:</Text>
      <Text>{targetSet.reps}</Text>
      <Text>Weight:</Text>
      <Text>{targetSet.weight}</Text>
      <Text>Feels:</Text>
      <Text style={{ color: FeelsColors.get(targetSet.feels as Feels) }}>
        {FeelsReadable.get(targetSet.feels as Feels)}
      </Text>
      <Text>Rest:</Text>
      <Text style={intervalId.current ? styles.runningTimer : {}}>{rest}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  runningTimer: { color: "green" },
});

export default SetListItem;
