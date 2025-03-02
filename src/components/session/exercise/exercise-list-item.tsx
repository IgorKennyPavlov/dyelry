import MCI from "@expo/vector-icons/MaterialCommunityIcons";
import { useMemo, useCallback } from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";
import type { GestureResponderEvent } from "react-native/Libraries/Types/CoreEventTypes";

import {
  listItemCommonStyles,
  getIntervalSeconds,
  getExerciseInterval,
} from "../../../global";
import type { ExerciseProps } from "../../../global/types";
import { router } from "expo-router";

type ExerciseListItemProps = ListRenderItemInfo<ExerciseProps> & {
  sessionID: string;
  isTemplate?: boolean;
};

export const ExerciseListItem = (props: ExerciseListItemProps) => {
  const { item: targetExercise, sessionID, isTemplate } = props;

  const duration = useMemo(() => {
    if (!targetExercise) return 0;

    const [start, end] = getExerciseInterval(targetExercise);

    if (!start) return 0;

    const tillTime = end || new Date();
    return Math.round(getIntervalSeconds(tillTime, start) / 60) || 1;
  }, [targetExercise]);

  const kgPerMin = useMemo(() => {
    if (!targetExercise || !duration) return "--";

    const sets = targetExercise.sets || [];
    const weightSum = sets.reduce(
      (acc, cur) => acc + (cur.weight || 0) * (cur.reps || 0),
      0,
    );

    if (!weightSum) return "--";

    return Math.round(weightSum / duration);
  }, [duration, targetExercise]);

  const openExercise = useCallback(() => {
    router.push({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]`,
      params: { sessionID, exerciseID: targetExercise.id },
    });
  }, [targetExercise.id]);

  const editExercise = useCallback(
    (event: GestureResponderEvent) => {
      event.stopPropagation();
      router.push({
        pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/editor`,
        params: { sessionID, exerciseID: targetExercise.id },
      });
    },
    [targetExercise.id],
  );

  return (
    <Pressable style={styles.plaque} onPress={openExercise}>
      <Text style={{ width: "40%" }} numberOfLines={2}>
        {targetExercise.title}
      </Text>
      <Text style={{ width: "30%" }}>{`~${duration} min`}</Text>
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
