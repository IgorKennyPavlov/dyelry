import AntDesign from "@expo/vector-icons/AntDesign";
import {
  Stack,
  useFocusEffect,
  router,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useMemo } from "react";
import {
  useForm,
  useFieldArray,
  FieldPath,
  FieldArrayPath,
} from "react-hook-form";
import { Button, View, StyleSheet, Pressable, ScrollView } from "react-native";

import { Input, Select } from "../../../components";
import {
  useKeyboard,
  EXERCISE_DATA,
  Muscles,
  MusclesReadable,
} from "../../../global";
import type { ExerciseDataProps } from "../../../global/types";
import { useExerciseDataStore } from "../../../store";

interface ExerciseDataForm {
  unilateral?: boolean;
  bodyWeightRate: string;
  loadingDistribution: { key: Muscles; value: string }[];
}

const ExerciseDataEditor = () => {
  const { isKeyboardVisible } = useKeyboard();
  const {
    [EXERCISE_DATA]: exercises,
    addExerciseData,
    editExerciseData,
    deleteExerciseData,
  } = useExerciseDataStore();

  const { exerciseTitle } = useLocalSearchParams();

  const targetExerciseData = useMemo(() => {
    return exercises[exerciseTitle || ""] || null;
  }, [exercises, exerciseTitle]);

  const storedLoadingDistribution = useMemo(() => {
    const entries = targetExerciseData
      ? (Object.entries(targetExerciseData.loadingDistribution) as unknown as [
          Muscles,
          string,
        ][])
      : [];

    return entries.map(([key, value]) => ({ key, value: String(value) }));
  }, [targetExerciseData]);
  const isEditing = useMemo(() => !!targetExerciseData, [targetExerciseData]);

  const { getValues, control, register, reset } = useForm<ExerciseDataForm>();
  const { fields, append, remove } = useFieldArray<
    ExerciseDataForm,
    FieldArrayPath<ExerciseDataForm>
  >({
    control,
    name: "loadingDistribution",
  });

  useFocusEffect(
    useCallback(() => {
      reset({
        unilateral: targetExerciseData?.unilateral,
        bodyWeightRate: String(targetExerciseData?.bodyWeightRate || ""),
        loadingDistribution: storedLoadingDistribution,
      });

      return () => {
        remove();
        reset();
      };
    }, [remove, reset, storedLoadingDistribution, targetExerciseData]),
  );

  const saveExerciseData = useCallback(() => {
    const { unilateral, bodyWeightRate, loadingDistribution } = getValues();

    // TODO replace with proper validation
    if (
      loadingDistribution.some((item) => Number(item.value) > 100) ||
      Number(loadingDistribution) > 100
    ) {
      alert("Percent value can't be more than 100");
      return;
    }
    const uniqueMuscles = new Set(loadingDistribution.map((item) => item.key));
    if (uniqueMuscles.size < loadingDistribution.length) {
      alert("Remove duplicates!");
      return;
    }

    const loadingDistributionDict = Object.fromEntries(
      loadingDistribution
        .map((item) => ({ ...item, value: Number(item.value) }))
        .filter((item) => item.value)
        .map(({ key, value }) => [key, value]),
    ) as Record<Muscles, number>;

    const exerciseData: ExerciseDataProps = {
      unilateral,
      loadingDistribution: loadingDistributionDict,
    };

    if (Number(bodyWeightRate)) {
      exerciseData.bodyWeightRate = Number(bodyWeightRate);
    }

    isEditing
      ? editExerciseData(exerciseTitle, exerciseData)
      : addExerciseData(exerciseTitle, exerciseData);
    router.dismissTo("exercise-data");
  }, [addExerciseData, editExerciseData, getValues, isEditing, exerciseTitle]);

  const removeExerciseData = useCallback(() => {
    deleteExerciseData(exerciseTitle);
    router.dismissTo("exercise-data");
  }, [deleteExerciseData, exerciseTitle]);

  const title = useMemo(() => {
    return `${isEditing ? "Edit" : "Add"} exercise data (${exerciseTitle})`;
  }, [isEditing, exerciseTitle]);

  const muscleOptions = useMemo(
    () =>
      Array.from(MusclesReadable.entries()).map(([value, label]) => {
        return { label, value: String(value) };
      }),
    [],
  );

  return (
    <>
      <Stack.Screen options={{ title, headerBackVisible: false }} />

      <ScrollView
        style={{
          ...styles.formWrap,
          ...(targetExerciseData ? { marginBottom: 80 } : {}),
          ...(isKeyboardVisible ? { marginBottom: 0 } : {}),
        }}
      >
        <Select
          label="Unilateral"
          control={control}
          name="unilateral"
          options={[
            { label: "No", value: false },
            { label: "Yes", value: true },
          ]}
        />

        <Input
          style={styles.field}
          control={control}
          name="bodyWeightRate"
          label="Used body weight rate (%, for bodyweight exercises)"
          inputMode="numeric"
        />

        {fields.map((item, index) => {
          const { name: muscleName } = register(
            `loadingDistribution.${index}.key` as FieldPath<ExerciseDataForm>,
          );
          const { name: loadName } = register(
            `loadingDistribution.${index}.value` as FieldPath<ExerciseDataForm>,
          );

          return (
            <View key={item.id} style={styles.pairedFieldWrap}>
              <Select
                style={{ width: "40%" }}
                label=" "
                control={control}
                name={muscleName}
                options={muscleOptions}
              />

              <Input
                style={{ width: "35%" }}
                label="Load fraction (%)"
                control={control}
                name={loadName}
                inputMode="numeric"
              />

              <Pressable style={styles.deleteBtn} onPress={() => remove(index)}>
                <AntDesign name="closecircleo" size={32} />
              </Pressable>
            </View>
          );
        })}

        <View style={{ marginTop: 12 }}>
          <Button
            title="Add muscle group"
            onPress={() => append({ key: Muscles.Pecs, value: "0" })}
          />
        </View>
      </ScrollView>

      {!isKeyboardVisible && (
        <>
          {targetExerciseData && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button title="Delete" onPress={removeExerciseData} color="red" />
            </View>
          )}
          <View style={styles.btn}>
            <Button title="Save" onPress={saveExerciseData} />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1, marginBottom: 40 },
  field: { marginTop: 20 },
  pairedFieldWrap: { flexDirection: "row" },
  deleteBtn: {
    width: "10%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginLeft: "10%",
  },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default ExerciseDataEditor;
