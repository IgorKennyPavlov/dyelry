import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, View, StyleSheet, TextInput } from "react-native";

import { useNavigate, SESSIONS } from "../../../global";
import { useSessionsStore, useTargetStore } from "../../../store";

interface ExerciseEditForm {
  title: string;
}

const ExerciseEditor = () => {
  const { navigate } = useNavigate();
  const {
    [SESSIONS]: sessions,
    addExercise,
    editExercise,
  } = useSessionsStore();
  const { targetSessionId, targetExerciseId } = useTargetStore();

  const targetExercise = useMemo(
    () =>
      sessions
        .find((s) => s.id === targetSessionId)
        .exercises?.find((e) => e.id === targetExerciseId),
    [sessions, targetExerciseId, targetSessionId],
  );

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: { title: targetExercise?.title || "" },
  });

  const saveExercise = useCallback(() => {
    const title = getValues().title;

    // TODO replace with proper validation
    if (title === "") {
      alert("Fill the title field!");
      return;
    }

    const exerciseData = { id: targetExerciseId, title, start: new Date() };

    targetExercise
      ? editExercise(targetSessionId, targetExerciseId, exerciseData)
      : addExercise(targetSessionId, exerciseData);

    navigate("/session/exercise/view");
  }, [
    addExercise,
    editExercise,
    getValues,
    navigate,
    targetExercise,
    targetExerciseId,
    targetSessionId,
  ]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Exercise name",
          headerBackVisible: false,
        }}
      />

      <View style={styles.formWrap}>
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.titleField}
              value={value}
              onChangeText={(value) => onChange(value)}
              onBlur={onBlur}
            />
          )}
          name="title"
          rules={{ required: true }}
        />
      </View>
      <View style={styles.confirmBtn}>
        <Button
          title={`${targetExercise ? "Update" : "Add"} exercise`}
          onPress={saveExercise}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  titleField: { height: 44, fontSize: 20, borderWidth: 1, borderColor: "#000" },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default ExerciseEditor;
