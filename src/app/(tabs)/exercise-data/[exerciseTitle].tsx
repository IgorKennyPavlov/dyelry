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
import {
  Button,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
  Text,
} from "react-native";

import { Input, Select } from "../../../components";
import { useKeyboard, Muscles, MusclesReadable } from "../../../global";
import type { ExerciseDataProps } from "../../../global/types";
import { useExerciseDataStore } from "../../../store";
import { EXERCISE_DATA } from "../../../store/keys";
import { useTranslation } from "react-i18next";

interface ExerciseDataForm {
  unilateral?: boolean;
  bodyWeightRate: string;
  loadingDistribution: { key: Muscles; value: string }[];
}

const ExerciseDataEditor = () => {
  const { t } = useTranslation();
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
      alert(t("alert.100PercentOverflow"));
      return;
    }
    const uniqueMuscles = new Set(loadingDistribution.map((item) => item.key));
    if (uniqueMuscles.size < loadingDistribution.length) {
      alert(t("alert.removeDuplicates"));
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
    return `${(isEditing ? t("action.edit") : t("action.add")).toUpperCase()} (${exerciseTitle})`;
  }, [t, isEditing, exerciseTitle]);

  const muscleOptions = useMemo(
    () =>
      Array.from(MusclesReadable.entries()).map(([value, translationKey]) => {
        return { label: t(translationKey), value: String(value) };
      }),
    [t],
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
        {/* TODO refactor to checkbox, why did you do this? =) */}
        <Select
          label={t("label.unilateral")}
          control={control}
          name="unilateral"
          options={[
            { label: t("no"), value: false },
            { label: t("yes"), value: true },
          ]}
        />

        <Input
          style={styles.field}
          control={control}
          name="bodyWeightRate"
          label={t("label.bodyWeightRate")}
          inputMode="numeric"
        />

        {!!fields.length && (
          <View
            style={{ marginTop: 20, marginBottom: 12, flexDirection: "row" }}
          >
            <Text style={{ width: "40%" }}>
              {t("label.muscleGroup").toUpperCase()}
            </Text>
            <Text style={{ width: "35%" }}>
              {`${t("label.loadFraction").toUpperCase()} (%)`}
            </Text>
          </View>
        )}

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
                label=" "
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
            title={`${t("action.addMuscleGroup")}`}
            onPress={() => append({ key: Muscles.Pecs, value: "0" })}
          />
        </View>
      </ScrollView>

      {!isKeyboardVisible && (
        <>
          {targetExerciseData && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button
                title={t("action.delete")}
                onPress={removeExerciseData}
                color="red"
              />
            </View>
          )}
          <View style={styles.btn}>
            <Button title={t("action.save")} onPress={saveExerciseData} />
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
