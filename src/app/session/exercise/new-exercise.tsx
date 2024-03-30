import React, { useCallback } from "react";
import { Text, Button, View, StyleSheet, TextInput } from "react-native";
import { useStore } from "../../../store";
import { useForm, Controller } from "react-hook-form";
import { useLocalSearchParams, router } from "expo-router";

interface ExerciseEditForm {
  title: string;
}

const NewExercise = () => {
  const { addExercise } = useStore();
  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: { title: "test" },
  });
  const sessionId = useLocalSearchParams().sessionId as string;

  const createNewExercise = useCallback(() => {
    const title = getValues().title;
    const id = Date.now().toString();
    addExercise(sessionId, { id, title, start: new Date() });
    router.push(`/session/exercise/${id}?sessionId=${sessionId}`);
  }, []);

  return (
    <>
      <View style={styles.formWrap}>
        <Text>Name the exercise:</Text>
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
        <Button title="Create exercise" onPress={createNewExercise} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  titleField: { fontSize: 16, borderWidth: 1, borderColor: "#000" },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewExercise;
