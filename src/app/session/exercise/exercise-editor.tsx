import { Stack } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, View, StyleSheet, TextInput, Alert, Text } from "react-native";

import { useNavigate, ExerciseProps } from "../../../global";
import { usePersistentStore, useTargetStore } from "../../../store";
import { useTarget } from "../../../store/useTarget";

interface ExerciseEditForm {
  title: string;
  comment: string;
}

const ExerciseEditor = () => {
  const { navigate } = useNavigate();
  const { addExercise, editExercise, deleteExercise } = usePersistentStore();
  const { targetSessionId, targetExerciseId, setTargetExerciseId } =
    useTargetStore();

  const { targetExercise } = useTarget();
  const isEditing = targetExercise?.title !== undefined;

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: {
      title: targetExercise?.title || "",
      comment: targetExercise?.comment || "",
    },
  });

  const saveExercise = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) {
      return;
    }

    // TODO replace with proper validation
    if (getValues().title === "") {
      alert("Fill the title field!");
      return;
    }

    const exerciseData: ExerciseProps = {
      id: targetExerciseId,
      start: new Date(),
      ...getValues(),
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

      <Text>
        <Text style={{ color: "red" }}>* </Text>
        Title:
      </Text>
      <View style={styles.formWrap}>
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.textField}
              value={value}
              onChangeText={(value) => onChange(value)}
              onBlur={onBlur}
            />
          )}
          name="title"
          rules={{ required: true }}
        />

        <Text>Comment:</Text>
        <Controller
          control={control}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={styles.textField}
              value={value}
              onChangeText={(value) => onChange(value)}
              onBlur={onBlur}
            />
          )}
          name="comment"
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
  textField: {
    height: 44,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
  },
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default ExerciseEditor;
