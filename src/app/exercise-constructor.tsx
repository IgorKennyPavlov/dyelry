import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { View, StyleSheet, Button, Text, ScrollView } from "react-native";

import { Input } from "../components";
import { SESSIONS } from "../global";
import { usePersistentStore } from "../store";

interface ExerciseConstructorForm {
  title: string;
  date: Date;
  comment: string;
}

const ExerciseConstructor = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { control } = useForm<ExerciseConstructorForm>();

  const uniqueExerciseTitles = useMemo(() => {
    const exerciseTitles = sessions
      .flatMap((s) => s.exercises || [])
      .map((e) => e.title);
    return [...new Set(exerciseTitles)];
  }, [sessions]);

  const addExercise = () => {
    console.log("Exercise added");
  };

  return (
    <View style={styles.constructorWrap}>
      <View>
        <Input style={styles.field} control={control} name="Exercise name" />
      </View>

      <ScrollView>
        {uniqueExerciseTitles.map((e) => {
          return <Text key={e}>{e}</Text>;
        })}
      </ScrollView>

      <View style={styles.btn}>
        <Button title="Add exercise" onPress={addExercise} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  constructorWrap: { flex: 1 },
  field: { marginTop: 20 },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default ExerciseConstructor;
