import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { listItemCommonStyles } from "../../global";
import { useExerciseDataStore } from "../../store";
import { router } from "expo-router";
import { EXERCISE_DATA } from "../../store/keys";

export const ExerciseDataListItem = (props: ListRenderItemInfo<string>) => {
  const title = props.item;

  const { [EXERCISE_DATA]: exercises } = useExerciseDataStore();

  const editExerciseData = useCallback(() => {
    router.push({
      pathname: "exercise-data/[exerciseTitle]",
      params: { exerciseTitle: title },
    });
  }, [title]);

  return (
    <Pressable style={styles.plaque} onPress={editExerciseData}>
      <Text style={{ width: "80%" }} numberOfLines={2}>
        {title}
      </Text>
      <View style={{ width: "20%" }}>
        {exercises[title] ? (
          <AntDesign name="checksquareo" size={24} />
        ) : (
          <AntDesign name="closesquareo" size={24} />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  ...listItemCommonStyles,
  feels: { flexDirection: "row" },
});
