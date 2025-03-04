import {
  Stack,
  useFocusEffect,
  useLocalSearchParams,
  router,
} from "expo-router";
import {
  useCallback,
  useState,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { Input, Select } from "../../../forms";
import {
  Feels,
  Sides,
  getIntervalSeconds,
  useKeyboard,
  FeelsReadable,
  FeelsColors,
  SidesReadable,
} from "../../../../global";
import {
  useExerciseDataStore,
  useSessionsStore,
  useTemplatesStore,
} from "../../../../store";
import { EXERCISE_DATA, TEMPLATES, SESSIONS } from "../../../../store/keys";
import { useTranslation } from "react-i18next";

interface SetEditForm {
  weight: string;
  reps: string;
  feels: Feels;
  comment: string;
  side?: Sides;
}

interface SetEditorProps {
  isTemplate?: boolean;
}

export const SetEditor = ({ isTemplate }: SetEditorProps) => {
  const { t } = useTranslation();
  const { isKeyboardVisible } = useKeyboard();

  const { [EXERCISE_DATA]: exerciseData } = useExerciseDataStore();

  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;
  const { [storeKey]: sessions, addSet, editSet, deleteSet } = useStore();

  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID: string;
    setID: string;
  }>();
  const { sessionID, exerciseID, setID } = params;

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const targetExercise = useMemo(
    () => targetSession?.exercises.find((e) => e.id === exerciseID),
    [targetSession, exerciseID],
  );

  const targetSet = useMemo(
    () => targetExercise?.sets?.find((s) => s.id === setID),
    [targetExercise, setID],
  );

  const [timer, setTimer] = useState(0);
  const intervalId: MutableRefObject<number | null> = useRef(null);

  const isEditing =
    targetSet?.weight !== undefined && targetSet.reps !== undefined;

  const { getValues, control } = useForm<SetEditForm>({
    defaultValues: {
      weight: String(targetSet?.weight || ""),
      reps: String(targetSet?.reps || ""),
      feels: targetSet?.feels || Feels.Ok,
      comment: String(targetSet?.comment || ""),
      side: String(targetSet?.side || ""),
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (isEditing || !targetSet?.end) return;

      intervalId.current = window.setInterval(() => {
        setTimer(getIntervalSeconds(new Date(), targetSet.end as Date));
      }, 1000);

      return () => clearInterval(intervalId.current as number);
    }, [isEditing, targetSet?.end]),
  );

  const editSetParams = useCallback(() => {
    if (!sessionID || !exerciseID || !setID) return;

    const { weight, reps, feels, comment, side } = getValues();

    // TODO replace with proper validation
    if (weight.trim() === "" || reps.trim() === "") {
      alert(t("alert.fillRequired"));
      return;
    }

    if (isUnilateral && !side) {
      alert(t("alert.selectSideForUnilateral"));
      return;
    }

    const updatedSet = {
      weight: +weight,
      reps: +reps,
      feels,
      side,
      comment: comment.trim(),
    };

    targetSet
      ? editSet(sessionID, exerciseID, setID, updatedSet)
      : addSet(sessionID, exerciseID, updatedSet);

    router.dismissTo({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]`,
      params: { sessionID, exerciseID },
    });
  }, [t, getValues, editSet, sessionID, exerciseID, setID, targetSet]);

  const confirmDelete = useCallback(() => {
    if (!sessionID || !exerciseID || !setID) return;

    Alert.alert(
      t("alert.deleteSet.title"),
      t("areYouSure"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: () => {
            deleteSet(sessionID, exerciseID, setID);
            router.dismissTo({
              pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]`,
              params: { sessionID, exerciseID },
            });
          },
        },
      ],
      { cancelable: true },
    );
  }, [t, deleteSet, exerciseID, sessionID, setID]);

  const title = useMemo(() => {
    let res = isEditing ? t("header.editSet") : t("header.inputSetParams");

    if (targetExercise?.title) {
      res += ` (${targetExercise.title})`;
    }

    return res;
  }, [t, isEditing, targetExercise?.title]);

  const feelingOptions = useMemo(
    () =>
      Array.from(FeelsReadable.entries()).map(([value, translationKey]) => {
        return {
          label: t(translationKey),
          value,
          style: { color: FeelsColors.get(value) },
        };
      }),
    [t],
  );

  const isUnilateral = useMemo(
    () => exerciseData[targetExercise?.title]?.unilateral,
    [exerciseData, targetExercise],
  );

  const sideOptions = useMemo(
    () =>
      Array.from(SidesReadable.entries()).map(([value, translationKey]) => {
        return { label: t(translationKey), value: String(value) };
      }),
    [t],
  );

  return (
    <>
      <Stack.Screen options={{ title }} />

      <ScrollView style={styles.formWrap}>
        {isUnilateral && (
          <Select
            style={styles.field}
            control={control}
            label={t("label.side")}
            name="side"
            options={[
              { label: t("label.selectSide"), value: undefined },
              ...sideOptions,
            ]}
            required
          />
        )}

        <Input
          style={styles.field}
          control={control}
          label={t("label.weight")}
          name="weight"
          inputMode="numeric"
          required
        />
        <Input
          style={styles.field}
          control={control}
          label={t("label.reps")}
          name="reps"
          inputMode="numeric"
          required
        />
        <Select
          style={styles.field}
          control={control}
          label={t("label.feels")}
          name="feels"
          options={feelingOptions}
        />
        <Input
          style={styles.field}
          control={control}
          label={t("label.comment")}
          name="comment"
          multiline
        />

        {!isEditing && (
          <View style={styles.timerWrap}>
            <Text>{t("label.restTimer").toUpperCase()}:</Text>
            <Text style={styles.timer}>{String(timer)}</Text>
          </View>
        )}
      </ScrollView>

      {!isKeyboardVisible && (
        <>
          <View style={{ ...styles.btn, bottom: 36 }}>
            <Button
              title={t("action.deleteSet")}
              color="red"
              onPress={confirmDelete}
            />
          </View>

          <View style={styles.btn}>
            <Button title={t("action.saveSet")} onPress={editSetParams} />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1, marginBottom: 70 },
  field: { marginTop: 20 },
  timerWrap: { marginTop: 20 },
  timer: { fontSize: 44, color: "green" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});
