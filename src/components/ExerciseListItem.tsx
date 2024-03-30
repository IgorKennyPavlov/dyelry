import { useRouter } from "expo-router";
import React from "react";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { ExerciseProps } from "../app/types";

const ExerciseListItem = ({ item }: ListRenderItemInfo<ExerciseProps>) => {
  const router = useRouter();

  const openExercise = () => router.push(`/`);

  return (
    <Pressable style={styles.sessionPlaque} onPress={openExercise}>
      <Text>{item.title}</Text>
      <Text>{item.start.toLocaleString("ru-RU")}</Text>
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
});

export default ExerciseListItem;
