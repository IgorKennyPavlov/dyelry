import { useLocalSearchParams, router } from "expo-router";
import { useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, Button, View, StyleSheet, TextInput } from "react-native";

import { querify } from "../../../global";
import { useStore } from "../../../store";

interface ExerciseEditForm {
  title: string;
}

const NewExercise = () => {
  const { addExercise } = useStore();
  const sessionId = useLocalSearchParams().sessionId as string;

  const { getValues, control } = useForm<ExerciseEditForm>({
    defaultValues: { title: "" },
  });

  const createNewExercise = useCallback(() => {
    const title = getValues().title;

    // TODO replace with proper validation
    if (title === "") {
      alert("Fill the title field!");
      return;
    }

    const id = Date.now().toString();
    addExercise(sessionId, { id, title, start: new Date() });
    const q = querify({ sessionId });
    router.push(`/session/exercise/${id}?${q}`);
  }, [addExercise, getValues, sessionId]);

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
  titleField: { height: 44, fontSize: 20, borderWidth: 1, borderColor: "#000" },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewExercise;
