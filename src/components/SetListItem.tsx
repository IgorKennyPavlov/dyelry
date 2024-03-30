import { useRouter } from "expo-router";
import { Text, ListRenderItemInfo, StyleSheet, Pressable } from "react-native";

import { SetProps, FeelsReadable } from "../global";

const SetListItem = ({ item }: ListRenderItemInfo<SetProps>) => {
  const router = useRouter();

  const openExercise = () => router.push(`/`);

  return (
    <Pressable style={styles.sessionPlaque} onPress={openExercise}>
      <Text>Reps:</Text>
      <Text>{item.reps}</Text>
      <Text>Weight:</Text>
      <Text>{item.weight}</Text>
      <Text>Feels:</Text>
      <Text>{FeelsReadable.get(item.feels)}</Text>
      <Text>Rest:</Text>
      <Text>{item.rest}</Text>
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

export default SetListItem;
