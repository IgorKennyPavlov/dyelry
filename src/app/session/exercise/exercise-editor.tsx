import { Stack } from "expo-router";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, View, StyleSheet, TextInput, Alert } from "react-native";

import { useNavigate, ExerciseProps } from "../../../global";
import { usePersistentStore, useTargetStore } from "../../../store";
import { useTarget } from "../../../store/useTarget";

interface ExerciseEditForm {
  title: string;
}

const ExerciseEditor = () => {
  const { navigate } = useNavigate();
  const { addExercise, editExercise, deleteExercise } = usePersistentStore();
  const { targetSessionId, targetExerciseId, setTargetExerciseId } =
    useTargetStore();

  const { targetExercise } = useTarget();

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: { title: targetExercise?.title || "" },
  });

  const saveExercise = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) {
      return;
    }

    const title = getValues().title;

    // TODO replace with proper validation
    if (title === "") {
      alert("Fill the title field!");
      return;
    }

    const exerciseData: ExerciseProps = {
      id: targetExerciseId,
      title,
      start: new Date(),
    };

    if (targetExercise) {
      editExercise(targetSessionId, targetExerciseId, exerciseData);
      navigate("/session/view");
      return;
    }

    addExercise(targetSessionId, exerciseData);
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

  const confirmDelete = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) {
      return;
    }

    Alert.alert(
      "Deleting exercise",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/session/view");
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

      {targetExercise && (
        <View style={{ ...styles.btn, bottom: 40 }}>
          <Button title="Delete exercise" color="red" onPress={confirmDelete} />
        </View>
      )}

      <View style={styles.btn}>
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
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default ExerciseEditor;
