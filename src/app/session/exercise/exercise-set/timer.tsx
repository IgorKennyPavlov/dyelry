import { Stack } from "expo-router";
import { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { getIntervalSeconds, SESSIONS, useNavigate } from "../../../../global";
import { useSessionsStore, useTargetStore } from "../../../../store";

const Timer = () => {
  const { navigate } = useNavigate();
  const { [SESSIONS]: sessions, addSet, editSet } = useSessionsStore();
  const { targetSessionId, targetExerciseId, targetSetId, setTargetSetId } =
    useTargetStore();

  const targetSet = useMemo(() => {
    return sessions
      .find((s) => s.id === targetSessionId)
      .exercises.find((e) => e.id === targetExerciseId)
      .sets?.find((e) => e.id === targetSetId);
  }, [sessions, targetExerciseId, targetSessionId, targetSetId]);

  const [start, setStart] = useState<Date | null>(targetSet?.start || null);
  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  useEffect(() => {
    if (!start) {
      return;
    }

    intervalId.current = setInterval(() => {
      setTimer(getIntervalSeconds(new Date(), start));
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [start]);

  const startExerciseSet = useCallback(() => {
    const id = Date.now().toString();
    const start = new Date();

    addSet(targetSessionId, targetExerciseId, { id, start });
    setTargetSetId(id);
    setStart(start);
  }, [addSet, setTargetSetId, targetExerciseId, targetSessionId]);

  const endExerciseSet = useCallback(() => {
    const end = new Date();
    editSet(targetSessionId, targetExerciseId, targetSetId, { end });
    navigate("/session/exercise/exercise-set/set-editor");
  }, [editSet, targetSessionId, targetExerciseId, targetSetId, navigate]);

  const finishExerciseSet = useCallback(() => {
    Alert.alert(
      "Finishing set",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: endExerciseSet },
      ],
      { cancelable: true },
    );
  }, [endExerciseSet]);

  return (
    <>
      <Stack.Screen
        options={{
          title: "Activity timer",
          headerBackVisible: false,
        }}
      />

      <View style={styles.formWrap}>
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

export default Timer;
