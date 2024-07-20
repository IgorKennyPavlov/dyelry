import { uuid } from "expo-modules-core";
import { Stack, useFocusEffect } from "expo-router";
import {
  useCallback,
  useState,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { getIntervalSeconds, useNavigate } from "../../global";
import {
  usePersistentStore,
  useTargetStore,
  useHideTabBar,
  useTargetSelectors,
} from "../../store";

const Timer = () => {
  useHideTabBar();
  const { navigate } = useNavigate();
  const { addSet, editSet } = usePersistentStore();
  const { targetSessionId, targetExerciseId, targetSetId, setTargetSetId } =
    useTargetStore();

  const { targetExercise, targetSet } = useTargetSelectors();

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
    if (!targetSessionId || !targetExerciseId) return;

    const start = new Date();
    setStart(start);

    if (targetSetId) {
      editSet(targetSessionId, targetExerciseId, targetSetId, { start });
      return;
    }

    const id = uuid.v4();
    addSet(targetSessionId, targetExerciseId, { id, start });
    setTargetSetId(id);
  }, [
    addSet,
    editSet,
    setTargetSetId,
    targetExerciseId,
    targetSessionId,
    targetSetId,
  ]);

  const endExerciseSet = useCallback(() => {
    if (!targetSessionId || !targetExerciseId || !targetSetId) return;

    const end = new Date();
    editSet(targetSessionId, targetExerciseId, targetSetId, { end });
    navigate("/set-editor");
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
