import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import { useNavigate, getIntervalSeconds, ExerciseProps } from "../../global";
import { useTargetStore } from "../../store";
import { useTarget } from "../../store/useTarget";

const ExerciseListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetExerciseId } = props;

  const { navigate } = useNavigate();
  const { setTargetExerciseId } = useTargetStore();

  const { targetSession } = useTarget();

  const targetExercise = useMemo(
    () =>
      targetSession?.exercises?.find(
        (e) => e.id === targetExerciseId,
      ) as ExerciseProps,
    [targetExerciseId, targetSession?.exercises],
  );

  const duration = useMemo(() => {
    if (!targetExercise) {
      return 0;
    }

    const { start, end } = targetExercise;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetExercise]);

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
