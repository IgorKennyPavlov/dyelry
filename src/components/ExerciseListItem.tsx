import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { FeelsReadable, SESSIONS } from "../global";
import { useTargetStore, useSessionsStore } from "../store";

const ExerciseListItem = (props: ListRenderItemInfo<string>) => {
  const { item: targetExerciseId } = props;

  const router = useRouter();
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

  const openExercise = () => {
    setTargetExerciseId(targetExerciseId);
    router.push("/session/exercise/view");
  };

  return (
    <Pressable style={styles.sessionPlaque} onPress={openExercise}>
      <Text>{targetExercise.title}</Text>
      <View style={styles.feels}>
        <Text>Feels:&nbsp;</Text>
        <Text>{FeelsReadable.get(averageFeel)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  sessionPlaque: {
    height: 44,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#ccc",
    borderRadius: 8,
  },
  feels: { flexDirection: "row" },
});

export default ExerciseListItem;
