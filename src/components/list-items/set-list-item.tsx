import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import {
  FeelsReadable,
  SESSIONS,
  getIntervalSeconds,
  useNavigate,
  FeelsColors,
} from "../../global";
import { useSessionsStore, useTargetStore } from "../../store";

const SetListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetSetId } = props;

  const { navigate } = useNavigate();
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { targetSessionId, targetExerciseId, setTargetSetId } =
    useTargetStore();

  const intervalId = useRef(null);
  const [rest, setRest] = useState(0);

  const targetExercise = useMemo(
    () =>
      sessions
        .find((s) => s.id === targetSessionId)
        .exercises.find((e) => e.id === targetExerciseId),
    [sessions, targetExerciseId, targetSessionId],
  );
  const targetSet = useMemo(
    () => targetExercise.sets.find((e) => e.id === targetSetId),
    [targetExercise.sets, targetSetId],
  );
  const targetSetIdx = useMemo(
    () => targetExercise.sets.indexOf(targetSet),
    [targetExercise.sets, targetSet],
  );

  useEffect(() => {
    if (targetSet !== targetExercise.sets.at(-1)) {
      const nextSetStart = targetExercise.sets[targetSetIdx + 1].start;
      setRest(getIntervalSeconds(nextSetStart, targetSet.end));
      return;
    }

    if (targetExercise.end) {
      setRest(getIntervalSeconds(targetExercise.end, targetSet.end));
      return;
    }

    if (!targetSet.end) {
      return;
    }

    intervalId.current = setInterval(() => {
      setRest(getIntervalSeconds(new Date(), targetSet.end));
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [
    targetExercise.end,
    targetExercise.sets,
    targetSet,
    targetSet.end,
    targetSetIdx,
  ]);

  const openExerciseSet = useCallback(() => {
    setTargetSetId(targetSetId);

    // TODO remove after the editor screen added
    if (!targetSet.weight || !targetSet.reps) {
      navigate("/session/exercise/exercise-set/new-set");
      return;
    }

    // TODO open the editor screen here
    Alert.alert(
      "Set info",
      JSON.stringify(targetSet, null, 2),
      [{ text: "OK", style: "cancel" }],
      { cancelable: true },
    );
  }, [navigate, setTargetSetId, targetSet, targetSetId]);

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
      <Text style={{ color: FeelsColors.get(targetSet.feels) }}>
        {FeelsReadable.get(targetSet.feels)}
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
