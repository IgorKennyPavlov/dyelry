import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import {
  FeelsReadable,
  SESSIONS,
  useNavigate,
  FeelsColors,
  getIntervalSeconds,
} from "../../global";
import { useTargetStore, useSessionsStore } from "../../store";

const ExerciseListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetExerciseId } = props;

  const { navigate } = useNavigate();
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { targetSessionId, setTargetExerciseId } = useTargetStore();

  const targetExercise = useMemo(
    () =>
      sessions
        .find((s) => s.id === targetSessionId)
        .exercises.find((e) => e.id === targetExerciseId),
    [sessions, targetExerciseId, targetSessionId],
  );

  const duration = useMemo(() => {
    if (!targetExercise) {
      return 0;
    }

    const { start, end } = targetExercise;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetExercise]);

  // TODO PAVLOV multiply the input by the fraction of the overall weight lifted?
  const averageFeel = useMemo(() => {
    if (!targetExercise.sets) {
      return 0;
    }

    const feelsSum = targetExercise.sets
      .map((s) => s.feels)
      .reduce((a, b) => a + b, 0);
    const setsCount = targetExercise.sets.length || 1;
    return Math.ceil(feelsSum / setsCount);
  }, [targetExercise.sets]);

  const openExercise = useCallback(() => {
    setTargetExerciseId(targetExerciseId);
    navigate("/session/exercise/view");
  }, [navigate, setTargetExerciseId, targetExerciseId]);

  const editExercise = useCallback(() => {
    setTargetExerciseId(targetExerciseId);
    navigate("/session/exercise/exercise-editor");
  }, [navigate, setTargetExerciseId, targetExerciseId]);

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetExercise.end ? "gray" : "orange",
      }}
      onPress={openExercise}
    >
      <Text>{targetExercise.title}</Text>
      {targetExercise?.end && (
        <>
          <Text>Duration:</Text>
          <Text>~{duration} min</Text>
        </>
      )}
      <View style={styles.feels}>
        <Text>Feels:&nbsp;</Text>
        <Text style={{ color: FeelsColors.get(averageFeel) }}>
          {FeelsReadable.get(averageFeel)}
        </Text>
      </View>

      <Pressable onPress={editExercise}>
        <MCI name="pencil-circle-outline" size={32} color="#444" />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  feels: { flexDirection: "row" },
});

export default ExerciseListItem;
