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

export interface SetListItemProps extends ListRenderItemInfo<SetProps> {
  sessionId: string;
  exerciseId: string;
}

const SetListItem = (props: SetListItemProps) => {
  const { [SESSIONS]: sessions } = useStore();
  const { item, sessionId, exerciseId } = props;

  // TODO Open set editor?
  const openExercise = () => {
    const targetSet = sessions
      .find((s) => s.id === sessionId)
      .exercises.find((e) => e.id === exerciseId)
      .sets.find((s) => s.id === item.id);

    Alert.alert(
      "Set info",
      JSON.stringify(targetSet, null, 2),
      [
        {
          text: "OK",
          style: "cancel",
        },
      ],
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
