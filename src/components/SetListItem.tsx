import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import { SetProps, FeelsReadable } from "../global";
import { useStore } from "../store";
import { SESSIONS } from "../store/constants";
import { getIntervalSeconds } from "../utils";

export interface SetListItemProps extends ListRenderItemInfo<SetProps> {
  sessionId: string;
  exerciseId: string;
}

const SetListItem = (props: SetListItemProps) => {
  const { [SESSIONS]: sessions } = useStore();
  const { item, sessionId, exerciseId } = props;
  const session = sessions.find((s) => s.id === sessionId);
  const exercise = session.exercises.find((e) => e.id === exerciseId);
  const targetSet = exercise.sets.find((s) => s.id === item.id);
  const targetSetIdx = exercise.sets.indexOf(targetSet);

  // TODO add rest calculation logic to the current moment
  const rest =
    targetSet === exercise.sets.at(-1)
      ? exercise.end
        ? getIntervalSeconds(exercise.end, targetSet.end)
        : "--"
      : getIntervalSeconds(
          exercise.sets[targetSetIdx + 1].start,
          targetSet.end,
        );

  // TODO Open set editor?
  const openExercise = () => {
    Alert.alert(
      "Set info",
      JSON.stringify(targetSet, null, 2),
      [{ text: "OK", style: "cancel" }],
      { cancelable: true },
    );
  };

  return (
    <Pressable style={styles.sessionPlaque} onPress={openExercise}>
      <Text>Reps:</Text>
      <Text>{item.reps}</Text>
      <Text>Weight:</Text>
      <Text>{item.weight}</Text>
      <Text>Feels:</Text>
      <Text>{FeelsReadable.get(item.feels)}</Text>
      <Text>Rest:</Text>
      <Text>{rest}</Text>
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
