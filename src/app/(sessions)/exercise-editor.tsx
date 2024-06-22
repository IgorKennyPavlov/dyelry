import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, View, StyleSheet, Alert } from "react-native";

import { Input } from "../../components";
import { useNavigate, ExerciseProps, useKeyboard } from "../../global";
import { usePersistentStore, useTargetStore, useTarget } from "../../store";

interface ExerciseEditForm {
  title: string;
  comment: string;
}

const ExerciseEditor = () => {
  const { navigate } = useNavigate();
  const { isKeyboardVisible } = useKeyboard();
  const { addExercise, editExercise, deleteExercise } = usePersistentStore();
  const { targetSessionId, targetExerciseId, setTargetExerciseId } =
    useTargetStore();

  const { targetSession, targetExercise } = useTarget();
  const isEditing = targetExercise?.title !== undefined;

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: {
      title: targetExercise?.title || "",
      comment: targetExercise?.comment || "",
    },
  });

  const saveExercise = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) return;

    const { title, comment } = getValues();

    // TODO replace with proper validation
    if (title.trim() === "") {
      alert("Fill the title field!");
      return;
    }

    const exerciseData: ExerciseProps = {
      id: targetExerciseId,
      start: targetExercise?.start || new Date(),
      title: title.trim(),
      comment: comment.trim(),
    };

    if (targetExercise) {
      editExercise(targetSessionId, targetExerciseId, exerciseData);
      navigate("/session");
      return;
    }

    addExercise(targetSessionId, exerciseData);
    navigate("/exercise");
  }, [
    addExercise,
    editExercise,
    getValues,
    navigate,
    targetExercise,
    targetExerciseId,
    targetSessionId,
  ]);

  const confirmDelete = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) return;

    Alert.alert(
      "Deleting exercise",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/session");
            deleteExercise(targetSessionId, targetExerciseId);
            setTargetExerciseId(null);
          },
        },
      ],
      { cancelable: true },
    );
  }, [
    deleteExercise,
    navigate,
    setTargetExerciseId,
    targetExerciseId,
    targetSessionId,
  ]);

  const resumeExercise = useCallback(() => {
    if (
      !targetSessionId ||
      !targetExerciseId ||
      !targetSession?.exercises ||
      !targetExercise
    )
      return;

    const isSessionActive = !targetSession.end;
    const isExerciseLast = targetExercise === targetSession.exercises.at(-1);
    const isExerciseResumable = isSessionActive && isExerciseLast;

    if (!isExerciseResumable) {
      alert("You can resume only the last exercise in an active session!");
      return;
    }

    editExercise(targetSessionId, targetExerciseId, {
      ...targetExercise,
      end: undefined,
    });

    navigate("/session");
  }, [
    editExercise,
    navigate,
    targetExercise,
    targetExerciseId,
    targetSession?.end,
    targetSession?.exercises,
    targetSessionId,
  ]);

  const title = useMemo(() => {
    let res = isEditing ? "Edit exercise" : "Create exercise";

    if (targetExercise?.title) {
      res += ` (${targetExercise.title})`;
    }

    return res;
  }, [isEditing, targetExercise?.title]);

  return (
    <>
      <Stack.Screen options={{ title, headerBackVisible: false }} />

      <View style={styles.formWrap}>
        <Input style={styles.field} control={control} name="title" required />
        <Input style={styles.field} control={control} name="comment" />
      </View>

      {!isKeyboardVisible && (
        <>
          {targetExercise?.end && (
            <View style={{ ...styles.btn, bottom: 80 }}>
              <Button
                title="Resume exercise"
                color="orange"
                onPress={resumeExercise}
              />
            </View>
          )}

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

export default ExerciseEditor;
