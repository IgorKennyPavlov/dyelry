import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import { useNavigate, getIntervalSeconds, ExerciseProps } from "../../global";
import { useTargetStore } from "../../store";

export const ExerciseListItem = (props: ListRenderItemInfo<ExerciseProps>) => {
  const { item: targetExercise } = props;

  const { navigate } = useNavigate();
  const { setTargetExerciseId } = useTargetStore();

  const duration = useMemo(() => {
    if (!targetExercise) {
      return 0;
    }

    const { start, end } = targetExercise;
    return end ? Math.round(getIntervalSeconds(end, start) / 60) : 0;
  }, [targetExercise]);

  const openExercise = useCallback(() => {
    setTargetExerciseId(targetExercise.id);
    navigate("/session/exercise/view");
  }, [navigate, setTargetExerciseId, targetExercise.id]);

  const editExercise = useCallback(() => {
    setTargetExerciseId(targetExercise.id);
    navigate("/session/exercise/exercise-editor");
  }, [navigate, setTargetExerciseId, targetExercise.id]);

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetExercise.end ? "gray" : "orange",
      }}
      onPress={openExercise}
    >
      <Text style={{ width: "50%" }}>{targetExercise.title}</Text>
      <Text style={{ width: "40%" }}>
        {targetExercise?.end ? `~${duration} min` : "--"}
      </Text>

      <Pressable style={{ width: "10%" }} onPress={editExercise}>
        <MCI name="pencil-circle-outline" size={32} color="#444" />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  feels: { flexDirection: "row" },
});
