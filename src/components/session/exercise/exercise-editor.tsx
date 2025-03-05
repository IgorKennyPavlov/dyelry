import { Stack, useLocalSearchParams, router } from "expo-router";
import { StyleSheet, Alert, View, Button } from "react-native";
import { useKeyboard, getUniqueExerciseTitles } from "../../../global";
import { useSessionsStore, useTemplatesStore } from "../../../store";
import { useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { ExerciseProps } from "../../../global/types";
import { Input } from "../../forms";
import { uuid } from "expo-modules-core";
import { useAllSessionData } from "../../../global/hooks/useAllSessionData";
import { TEMPLATES, SESSIONS } from "../../../store/keys";
import { useTranslation } from "react-i18next";

interface ExerciseEditForm {
  title: string;
  comment: string;
}

interface ExerciseEditorProps {
  isTemplate?: boolean;
}

export const ExerciseEditor = ({ isTemplate }: ExerciseEditorProps) => {
  const { t } = useTranslation();
  const { isKeyboardVisible } = useKeyboard();

  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID?: string;
  }>();
  const { sessionID, exerciseID } = params;

  const allSessions = useAllSessionData();

  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;

  const {
    [storeKey]: sessions,
    addExercise,
    editExercise,
    deleteExercise,
  } = useStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const targetExercise = useMemo(
    () => targetSession?.exercises?.find((e) => e.id === exerciseID),
    [targetSession, exerciseID],
  );

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: {
      title: targetExercise?.title || "",
      comment: targetExercise?.comment || "",
    },
  });

  const saveExercise = useCallback(() => {
    if (!sessionID) return;

    const { title, comment } = getValues();

    // TODO replace with proper validation
    if (title.trim() === "") {
      alert(t("alert.fillRequired"));
      return;
    }

    const exerciseData: ExerciseProps = {
      id: exerciseID || uuid.v4(),
      title: title.trim(),
      comment: comment.trim(),
    };

    if (exerciseID) {
      editExercise(sessionID, exerciseID, exerciseData);
      router.dismissTo({
        pathname: `/${isTemplate ? "template" : "session"}/[sessionID]`,
        params: { sessionID },
      });
      return;
    }

    addExercise(sessionID, exerciseData);
    router.dismissTo({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]`,
      params: { sessionID, exerciseID: exerciseData.id },
    });
  }, [addExercise, editExercise, getValues, exerciseID, sessionID]);

  const confirmDelete = useCallback(() => {
    if (!sessionID || !exerciseID) return;

    Alert.alert(
      t("alert.deleteExercise.title"),
      t("areYouSure"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: () => {
            deleteExercise(sessionID, exerciseID);
            router.dismissTo({
              pathname: `/${isTemplate ? "template" : "session"}/[sessionID]`,
              params: { sessionID },
            });
          },
        },
      ],
      { cancelable: true },
    );
  }, [t, deleteExercise, exerciseID, sessionID]);

  const title = useMemo(() => {
    let res = exerciseID
      ? t("header.editExercise")
      : t("header.createExercise");

    if (targetExercise?.title) {
      res += ` (${targetExercise.title})`;
    }

    return (isTemplate ? "*" : "") + res;
  }, [t, exerciseID, targetExercise?.title]);

  const uniqueExerciseTitles = useMemo(
    () => getUniqueExerciseTitles(allSessions),
    [allSessions],
  );

  return (
    <>
      <Stack.Screen options={{ title, headerBackVisible: false }} />

      <View style={styles.formWrap}>
        <Input
          style={styles.field}
          control={control}
          label={t("label.title")}
          name="title"
          autocomplete={uniqueExerciseTitles}
          required
        />
        <Input
          style={styles.field}
          control={control}
          label={t("label.comment")}
          name="comment"
        />
      </View>

      {!isKeyboardVisible && (
        <>
          {targetExercise && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button
                title={t("action.deleteExercise")}
                color="red"
                onPress={confirmDelete}
              />
            </View>
          )}

          <View style={styles.btn}>
            <Button
              title={
                targetExercise
                  ? t("action.updateExercise")
                  : t("action.addExercise")
              }
              onPress={saveExercise}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  field: { marginTop: 20 },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});
