import { useEffect, useRef, useState } from "react";
import {
  Text,
  ListRenderItemInfo,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";

import {
  SetProps,
  FeelsReadable,
  SESSIONS,
  getIntervalSeconds,
} from "../global";
import { useSessionsStore } from "../store";

export interface SetListItemProps extends ListRenderItemInfo<SetProps> {
  sessionId: string;
  exerciseId: string;
}

const SetListItem = (props: SetListItemProps) => {
  const intervalId = useRef(null);
  const [rest, setRest] = useState(0);

  const { [SESSIONS]: sessions } = useSessionsStore();
  const { item: targetSet, sessionId, exerciseId } = props;
  const session = sessions.find((s) => s.id === sessionId);
  const exercise = session.exercises.find((e) => e.id === exerciseId);
  const targetSetIdx = exercise.sets.indexOf(targetSet);

  useEffect(() => {
    if (targetSet !== exercise.sets.at(-1)) {
      const nextSetStart = exercise.sets[targetSetIdx + 1].start;
      setRest(getIntervalSeconds(nextSetStart, targetSet.end));
      return;
    }

    if (exercise.end) {
      setRest(getIntervalSeconds(exercise.end, targetSet.end));
      return;
    }

    intervalId.current = setInterval(() => {
      setRest(getIntervalSeconds(new Date(), targetSet.end));
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [exercise.end, exercise.sets, targetSet, targetSet.end, targetSetIdx]);

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
      <Text>{targetSet.reps}</Text>
      <Text>Weight:</Text>
      <Text>{targetSet.weight}</Text>
      <Text>Feels:</Text>
      <Text>{FeelsReadable.get(targetSet.feels)}</Text>
      <Text>Rest:</Text>
      <Text style={intervalId.current ? styles.runningTimer : {}}>{rest}</Text>
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
  runningTimer: { color: "green" },
});

export default SetListItem;
