import { uuid } from "expo-modules-core";
import {
  useFocusEffect,
  useLocalSearchParams,
  router,
  Stack,
} from "expo-router";
import {
  useCallback,
  useState,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { getIntervalSeconds, SESSIONS } from "../../../../../../../global";
import { useSessionsStore, useHideTabBar } from "../../../../../../../store";

const Timer = () => {
  useHideTabBar();

  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID: string;
    setID?: string;
  }>();
  const { sessionID, exerciseID, setID } = params;

  const [targetSetID, setTargetSetID] = useState<string | null>(setID || null);

  const { [SESSIONS]: sessions, addSet, editSet } = useSessionsStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const targetExercise = useMemo(
    () => targetSession?.exercises.find((e) => e.id === exerciseID),
    [targetSession, exerciseID],
  );

  const targetSet = useMemo(
    () => targetExercise?.sets.find((s) => s.id === targetSetID),
    [targetExercise, targetSetID],
  );

  const [start, setStart] = useState<Date | null>(targetSet?.start || null);
  const [timer, setTimer] = useState(0);
  const intervalId: MutableRefObject<number | null> = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (!start) return;

      intervalId.current = window.setInterval(() => {
        setTimer(getIntervalSeconds(new Date(), start));
      }, 1000);

      return () => clearInterval(intervalId.current as number);
    }, [start]),
  );

  const startExerciseSet = useCallback(() => {
    const start = new Date();
    setStart(start);

    if (targetSetID) {
      editSet(sessionID, exerciseID, targetSetID, { start });
      return;
    }

    const id = uuid.v4();
    addSet(sessionID, exerciseID, { id, start });
    setTargetSetID(id);
  }, [addSet, editSet, setTargetSetID, exerciseID, sessionID, targetSetID]);

  const endExerciseSet = useCallback(() => {
    if (!targetSetID) return;

    const end = new Date();
    editSet(sessionID, exerciseID, targetSetID, { end });
    router.navigate({
      pathname: "/session/[sessionID]/exercise/[exerciseID]/set/[setID]",
      params: { sessionID, exerciseID, setID: targetSetID },
    });
  }, [editSet, sessionID, exerciseID, targetSetID]);

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

  const title = useMemo(
    () => `Activity timer (${targetExercise?.title})`,
    [targetExercise?.title],
  );

  return (
    <>
      <Stack.Screen options={{ title }} />

      <View style={styles.formWrap}>
        <Text style={styles.timer}>{String(timer)}</Text>
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
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Timer;
