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
import { useTranslation } from "react-i18next";
import { useHideTabBar, useSessionsStore } from "../../../../store";
import { SESSIONS } from "../../../../store/keys";
import { getIntervalSeconds } from "../../../../global";

export const Timer = () => {
  const { t } = useTranslation();
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
    () => targetExercise?.sets?.find((s) => s.id === targetSetID),
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
    router.replace({
      pathname: "/session/[sessionID]/exercise/[exerciseID]/set/[setID]",
      params: { sessionID, exerciseID, setID: targetSetID },
    });
  }, [editSet, sessionID, exerciseID, targetSetID]);

  const finishExerciseSet = useCallback(() => {
    Alert.alert(
      t("alert.finishingSet.title"),
      t("areYouSure"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: endExerciseSet,
        },
      ],
      { cancelable: true },
    );
  }, [endExerciseSet]);

  const title = useMemo(
    () => `${t("header.activityTimer")} (${targetExercise?.title})`,
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
          title={start ? t("action.stop") : t("action.start")}
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
