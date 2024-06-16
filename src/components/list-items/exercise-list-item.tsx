import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";
import { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

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

  const kgPerMin = useMemo(() => {
    if (!targetExercise || !duration) {
      return "--";
    }

    const sets = targetExercise.sets || [];
    const weightSum = sets.reduce((acc, cur) => acc + (cur.weight || 0), 0);

    if (!weightSum) {
      return "--";
    }

    return Math.round(weightSum / duration);
  }, [duration, targetExercise]);

  const openExercise = useCallback(() => {
    setTargetExerciseId(targetExercise.id);
    navigate("/exercise");
  }, [navigate, setTargetExerciseId, targetExercise.id]);

  const editExercise = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      setTargetExerciseId(targetExercise.id);
      navigate("/exercise-editor");
    },
    [navigate, setTargetExerciseId, targetExercise.id],
  );

  return (
    <Pressable
      style={{
        ...styles.plaque,
        borderColor: targetExercise.end ? "gray" : "orange",
      }}
      onPress={openExercise}
    >
      <Text style={{ width: "40%" }}>{targetExercise.title}</Text>
      <Text style={{ width: "30%" }}>
        {targetExercise?.end ? `~${duration} min` : "--"}
      </Text>
      <Text style={{ width: "20%" }}>{kgPerMin}</Text>

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
