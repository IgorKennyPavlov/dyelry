import AntDesign from "@expo/vector-icons/AntDesign";
import { Stack, useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button, View, StyleSheet, Pressable, ScrollView } from "react-native";

import { Input, Select } from "../../components";
import {
  useNavigate,
  useKeyboard,
  EXERCISE_DATA,
  Muscles,
  MusclesReadable,
  ExerciseDataProps,
  SidesReadable,
  Sides,
} from "../../global";
import { useTargetStore } from "../../store";
import { useExerciseDataStore } from "../../store/persistent-store/exercise-data-store";

interface ExerciseDataForm {
  unilateral?: Sides;
  bodyWeightRate: number;
  loadingDistribution: { key: Muscles; value: string }[];
}

const ExerciseDataEditorPanel = () => {
  const { navigate } = useNavigate();
  const { isKeyboardVisible } = useKeyboard();
  const {
    [EXERCISE_DATA]: exercises,
    addExerciseData,
    editExerciseData,
    deleteExerciseData,
  } = useExerciseDataStore();

  const { targetExerciseDataTitle, setTargetExerciseDataTitle } =
    useTargetStore();

  const targetExerciseData = useMemo(() => {
    return exercises[targetExerciseDataTitle || ""] || null;
  }, [exercises, targetExerciseDataTitle]);

  const storedLoadingDistribution = useMemo(() => {
    const entries = targetExerciseData
      ? (Object.entries(targetExerciseData.loadingDistribution) as unknown as [
          Muscles,
          string,
        ][])
      : [];

    return entries.map(([key, value]) => ({ key, value: value.toString() }));
  }, [targetExerciseData]);
  const isEditing = useMemo(() => !!targetExerciseData, [targetExerciseData]);

  const { getValues, control, register, reset } = useForm<ExerciseDataForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "loadingDistribution",
  });

  useFocusEffect(
    useCallback(() => {
      reset({
        unilateral: targetExerciseData?.unilateral,
        bodyWeightRate: targetExerciseData?.bodyWeightRate,
        loadingDistribution: storedLoadingDistribution,
      });

      return () => {
        remove();
        reset();
        setTargetExerciseDataTitle(null);
      };
    }, [
      remove,
      reset,
      setTargetExerciseDataTitle,
      storedLoadingDistribution,
      targetExerciseData,
    ]),
  );

  const saveExerciseData = useCallback(() => {
    if (!targetExerciseDataTitle) return;

    const { unilateral, bodyWeightRate, loadingDistribution } = getValues();

    // TODO replace with proper validation
    const totalPercents = loadingDistribution.reduce(
      (acc, cur) => acc + Number(cur.value),
      0,
    );
    if (totalPercents !== 100) {
      alert("Percents are not equal to 100!");
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
      ? editExerciseData(targetExerciseDataTitle, exerciseData)
      : addExerciseData(targetExerciseDataTitle, exerciseData);
    navigate("/exercise-constructor");
  }, [
    addExerciseData,
    editExerciseData,
    getValues,
    isEditing,
    navigate,
    targetExerciseDataTitle,
  ]);

  const removeExerciseData = useCallback(() => {
    if (targetExerciseDataTitle) {
      deleteExerciseData(targetExerciseDataTitle);
      navigate("/exercise-constructor");
    }
  }, [deleteExerciseData, navigate, targetExerciseDataTitle]);

  const title = useMemo(() => {
    return isEditing ? "Edit exercise data" : "Add exercise data";
  }, [isEditing]);

  const muscleOptions = useMemo(
    () =>
      [...MusclesReadable.entries()].map(([value, label]) => {
        return { label, value: value.toString() };
      }),
    [],
  );

  const sideOptions = useMemo(
    () =>
      [...SidesReadable.entries()].map(([value, label]) => {
        return { label, value: value.toString() };
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
          options={[{ label: "Not", value: undefined }, ...sideOptions]}
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
            `loadingDistribution.${index}.key`,
          );
          const { name: loadName } = register(
            `loadingDistribution.${index}.value`,
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

export default ExerciseDataEditorPanel;
