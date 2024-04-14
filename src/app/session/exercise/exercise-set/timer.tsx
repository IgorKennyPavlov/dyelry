import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { getIntervalSeconds, querify } from "../../../../global";
import { useSessionsStore } from "../../../../store";

const NewSet = () => {
  const { addSet } = useSessionsStore();
  const [start, setStart] = useState<Date | null>(null);

  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  const sessionId = useLocalSearchParams().sessionId as string;
  const exerciseId = useLocalSearchParams().exerciseId as string;

  const startExerciseSet = useCallback(() => setStart(new Date()), []);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTimer(start ? getIntervalSeconds(new Date(), start) : 0);
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [start]);

  const addNewSet = useCallback(() => {
    const id = Date.now().toString();

    addSet(sessionId, exerciseId, {
      id,
      start,
      end: new Date(),
    });

    const q = querify({ sessionId, exerciseId, setId: id });

    // @ts-ignore
    router.push(`/session/exercise/exercise-set/new-set?${q}`);
  }, [addSet, exerciseId, sessionId, start]);

  const finishExerciseSet = useCallback(() => {
    Alert.alert(
      "Finishing set",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: addNewSet },
      ],
      { cancelable: true },
    );
  }, [addNewSet]);

  return (
    <>
      <View style={styles.formWrap}>
        <Text>Activity timer:</Text>
        <Text style={styles.timer}>{timer.toString()}</Text>
      </View>

      <View style={styles.btn}>
        <Button
          title={start ? "stop" : "start"}
          color={start ? "orange" : "green"}
          onPress={start ? finishExerciseSet : startExerciseSet}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  timer: { fontSize: 44, color: "orange" },
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewSet;
