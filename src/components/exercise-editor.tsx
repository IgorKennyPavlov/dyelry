import { Stack, useLocalSearchParams, router } from "expo-router";
import { StyleSheet, Alert, View, Button } from "react-native";
import { useKeyboard, SESSIONS, TEMPLATES } from "../global";
import { useSessionsStore, useTemplatesStore } from "../store";
import { useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import type { ExerciseProps } from "../global/types";
import { Input } from "./form";
import { uuid } from "expo-modules-core";

interface ExerciseEditForm {
  title: string;
  comment: string;
}

interface ExerciseEditorProps {
  isTemplate?: boolean;
}

export const ExerciseEditor = ({ isTemplate }: ExerciseEditorProps) => {
  const { isKeyboardVisible } = useKeyboard();

  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID?: string;
  }>();
  const { sessionID, exerciseID } = params;

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
      alert("Fill the title field!");
      return;
    }

    const exerciseData: ExerciseProps = {
      id: exerciseID || uuid.v4(),
      title: title.trim(),
      comment: comment.trim(),
    };

    if (exerciseID) {
      editExercise(sessionID, exerciseID, exerciseData);
      router.navigate({
        pathname: `/${isTemplate ? "template" : "session"}/[sessionID]`,
        params: { sessionID },
      });
      return;
    }

    addExercise(sessionID, exerciseData);
    router.navigate({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/exercise/[exerciseID]`,
      params: { sessionID, exerciseID: exerciseData.id },
    });
  }, [addExercise, editExercise, getValues, exerciseID, sessionID]);

  const confirmDelete = useCallback(() => {
    if (!sessionID || !exerciseID) return;

    Alert.alert(
      "Deleting exercise",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            deleteExercise(sessionID, exerciseID);
            router.navigate({
              pathname: `/${isTemplate ? "template" : "session"}/[sessionID]`,
              params: { sessionID },
            });
          },
        },
      ],
      { cancelable: true },
    );
  }, [deleteExercise, exerciseID, sessionID]);

  const title = useMemo(() => {
    let res = exerciseID ? "Edit exercise" : "Create exercise";

    if (targetExercise?.title) {
      res += ` (${targetExercise.title})`;
    }

    return (isTemplate ? "(T)" : "") + res;
  }, [exerciseID, targetExercise?.title]);

  const uniqueExerciseTitles = useMemo(() => {
    const exerciseTitles = sessions
      .flatMap((s) => s.exercises || [])
      .map((e) => e.title);
    return [...new Set(exerciseTitles)];
  }, [sessions]);

  return (
    <>
      <Stack.Screen options={{ title, headerBackVisible: false }} />

      <View style={styles.formWrap}>
        <Input
          style={styles.field}
          control={control}
          name="title"
          autocomplete={uniqueExerciseTitles}
          required
        />
        <Input style={styles.field} control={control} name="comment" />
      </View>

      {!isKeyboardVisible && (
        <>
          {targetExercise && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button
                title="Delete exercise"
                color="red"
                onPress={confirmDelete}
              />
            </View>
          )}

          <View style={styles.btn}>
            <Button
              title={`${targetExercise ? "Update" : "Add"} exercise`}
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
