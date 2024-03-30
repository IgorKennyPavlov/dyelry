import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState, useRef } from "react";
import { Text, Button, View, StyleSheet, Alert } from "react-native";

import { queryfy } from "../../../../utils";

const NewSet = () => {
  const [started, setStarted] = useState<Date | null>(null);

  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  const sessionId = useLocalSearchParams().sessionId as string;
  const exerciseId = useLocalSearchParams().exerciseId as string;

  const startSet = useCallback(() => {
    setStarted(new Date());
    intervalId.current = setInterval(
      () => setTimer((prevTimer) => prevTimer + 1),
      1000,
    );
  }, []);

  const finishSet = useCallback(() => {
    Alert.alert(
      "Finishing set",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            clearInterval(intervalId.current);

            const q = queryfy({
              sessionId,
              exerciseId,
              started: started.valueOf(),
            });

            router.push(`/session/exercise/training-set/new-set?${q}`);
          },
        },
      ],
      { cancelable: true },
    );
  }, [exerciseId, sessionId, started]);

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
