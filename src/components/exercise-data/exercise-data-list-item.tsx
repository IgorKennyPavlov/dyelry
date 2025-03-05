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
import { router } from "expo-router";

export interface ExerciseDataListItemProps {
  title: string;
  isDescribed: boolean;
}

export const ExerciseDataListItem = (
  props: ListRenderItemInfo<ExerciseDataListItemProps>,
) => {
  const { title, isDescribed } = props.item;

  const editExerciseData = useCallback(() => {
    router.push({
      pathname: "exercise-data/[exerciseTitle]",
      params: { exerciseTitle: title },
    });
  }, [title]);

  return (
    <Pressable style={styles.plaque} onPress={editExerciseData}>
      <Text style={{ width: "75%" }} numberOfLines={2}>
        {title}
      </Text>
      <View style={{ width: "25%", alignItems: "flex-end" }}>
        {isDescribed ? (
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
