import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { ExerciseProps, querify, FeelsReadable } from "../global";

export interface ExerciseListItemProps
  extends ListRenderItemInfo<ExerciseProps> {
  sessionId: string;
}

const ExerciseListItem = (props: ExerciseListItemProps) => {
  const { item, sessionId } = props;
  const router = useRouter();

  // TODO PAVLOV multiply the input by the fraction of the overall weight lifted?
  const averageFeel = useMemo(() => {
    if (!item.sets) {
      return 0;
    }

    const feelsSum = item.sets.map((s) => s.feels).reduce((a, b) => a + b, 0);
    const setsCount = item.sets.length || 1;
    return Math.ceil(feelsSum / setsCount);
  }, [item.sets]);

  const openExercise = () => {
    const q = querify({ sessionId });
    router.push(`/session/exercise/${item.id}?${q}`);
  };

  return (
    <Pressable style={styles.sessionPlaque} onPress={openExercise}>
      <Text>{item.title}</Text>
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
