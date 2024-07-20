import AntDesign from "@expo/vector-icons/AntDesign";
import { useCallback } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  View,
} from "react-native";

import { listItemCommonStyles } from "./list-item-common-styles";
import { useNavigate, EXERCISE_DATA } from "../../global";
import { useTargetStore, useExerciseDataStore } from "../../store";

export const ExerciseConstructorListItem = (
  props: ListRenderItemInfo<string>,
) => {
  const title = props.item;

  const { navigate } = useNavigate();
  const { [EXERCISE_DATA]: exercises } = useExerciseDataStore();
  const { setTargetExerciseDataTitle } = useTargetStore();

  const editExerciseData = useCallback(() => {
    setTargetExerciseDataTitle(title);
    navigate("/(exercise-constructor)/exercise-data-editor-panel");
  }, [navigate, setTargetExerciseDataTitle, title]);

  return (
    <Pressable style={styles.plaque} onPress={editExerciseData}>
      <Text style={{ width: "80%" }}>{title}</Text>
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
