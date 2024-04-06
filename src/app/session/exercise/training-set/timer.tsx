import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { useStore } from "../../../../store";
import { queryfy } from "../../../../utils";

const NewSet = () => {
  const { addSet } = useStore();
  const [started, setStarted] = useState<Date | null>(null);

  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  const sessionId = useLocalSearchParams().sessionId as string;
  const exerciseId = useLocalSearchParams().exerciseId as string;

  const startSet = useCallback(() => setStarted(new Date()), []);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const start = started?.valueOf() || 0;
      setTimer(start ? Math.floor((Date.now() - start) / 1000) : 0);
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [started]);

  const addNewSet = useCallback(() => {
    const id = Date.now().toString();

    addSet(sessionId, exerciseId, {
      id,
      start: started,
      end: new Date(),
    });

    const q = queryfy({ sessionId, exerciseId, setId: id });

    // @ts-ignore
    router.push(`/session/exercise/training-set/new-set?${q}`);
  }, [addSet, exerciseId, sessionId, started]);

  const finishSet = useCallback(() => {
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
          title={started ? "stop" : "start"}
          color={started ? "orange" : "green"}
          onPress={started ? finishSet : startSet}
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
