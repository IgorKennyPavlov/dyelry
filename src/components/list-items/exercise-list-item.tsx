import { useMemo, useCallback } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { listItemCommon } from "./list-item-common";
import { FeelsReadable, SESSIONS, useNavigate } from "../../global";
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

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetExercise.end ? "gray" : "orange",
      }}
      onPress={openExercise}
    >
      <Text>{targetExercise.title}</Text>
      <View style={styles.feels}>
        <Text>Feels:&nbsp;</Text>
        <Text>{FeelsReadable.get(averageFeel)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommon,
  feels: { flexDirection: "row" },
});

export default ExerciseListItem;
