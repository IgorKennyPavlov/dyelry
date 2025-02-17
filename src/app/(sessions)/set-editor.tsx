import { Stack, useFocusEffect } from "expo-router";
import {
  useCallback,
  useState,
  useRef,
  MutableRefObject,
  useMemo,
} from "react";
import { useForm } from "react-hook-form";
import {
  Text,
  Button,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";

import { Input, Select } from "../../components";
import {
  Feels,
  Sides,
  getIntervalSeconds,
  useNavigate,
  useKeyboard,
  FeelsReadable,
  FeelsColors,
  SidesReadable,
  EXERCISE_DATA,
} from "../../global";
import {
  useExerciseDataStore,
  usePersistentStore,
  useTargetStore,
  useTargetSelectors,
} from "../../store";

interface SetEditForm {
  weight: string;
  reps: string;
  feels: Feels;
  comment: string;
  side?: Sides;
}

const SetEditor = () => {
  const { navigate } = useNavigate();
  const { isKeyboardVisible } = useKeyboard();
  const { editSet, deleteSet } = usePersistentStore();
  const { targetSessionId, targetExerciseId, targetSetId, setTargetSetId } =
    useTargetStore();
  const { targetExercise, targetSet } = useTargetSelectors();

  const { [EXERCISE_DATA]: exerciseData } = useExerciseDataStore();

  const [timer, setTimer] = useState(0);
  const intervalId: MutableRefObject<number | null> = useRef(null);

  const isEditing =
    targetSet?.weight !== undefined && targetSet.reps !== undefined;

  const { getValues, control } = useForm<SetEditForm>({
    defaultValues: {
      weight: String(targetSet?.weight || ""),
      reps: String(targetSet?.reps || ""),
      feels: targetSet?.feels || Feels.Ok,
      comment: String(targetSet?.comment || ""),
      side: String(targetSet?.side || ""),
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (isEditing || !targetSet?.end) return;

      intervalId.current = window.setInterval(() => {
        setTimer(getIntervalSeconds(new Date(), targetSet.end as Date));
      }, 1000);

      return () => clearInterval(intervalId.current as number);
    }, [isEditing, targetSet?.end]),
  );

  const editSetParams = useCallback(() => {
    if (!targetSessionId || !targetExerciseId || !targetSetId) return;

    const { weight, reps, feels, comment, side } = getValues();

    // TODO replace with proper validation
    if (weight.trim() === "" || reps.trim() === "") {
      alert("Fill the required fields!");
      return;
    }

    if (isUnilateral && !side) {
      alert("The exercise is unilateral! Select the trained side!");
      return;
    }

    const updatedSet = {
      weight: +weight,
      reps: +reps,
      feels,
      side,
      comment: comment.trim(),
    };
    editSet(targetSessionId, targetExerciseId, targetSetId, updatedSet);

    navigate("/exercise");
  }, [
    getValues,
    editSet,
    targetSessionId,
    targetExerciseId,
    targetSetId,
    navigate,
  ]);

  const confirmDelete = useCallback(() => {
    if (!targetSessionId || !targetExerciseId || !targetSetId) return;

    Alert.alert(
      "Deleting set",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/exercise");
            deleteSet(targetSessionId, targetExerciseId, targetSetId);
            setTargetSetId(null);
          },
        },
      ],
      { cancelable: true },
    );
  }, [
    deleteSet,
    navigate,
    setTargetSetId,
    targetExerciseId,
    targetSessionId,
    targetSetId,
  ]);

  const title = useMemo(() => {
    let res = isEditing ? "Edit set" : "Input set params";

    if (targetExercise?.title) {
      res += ` (${targetExercise.title})`;
    }

    return res;
  }, [isEditing, targetExercise?.title]);

  const feelingOptions = useMemo(
    () =>
      Array.from(FeelsReadable.entries()).map(([value, label]) => {
        return { label, value, style: { color: FeelsColors.get(value) } };
      }),
    [],
  );

  const isUnilateral = useMemo(
    () => exerciseData[targetExercise?.title]?.unilateral,
    [exerciseData, targetExercise],
  );

  const sideOptions = useMemo(
    () =>
      Array.from(SidesReadable.entries()).map(([value, label]) => {
        return { label, value: String(value) };
      }),
    [],
  );

  return (
    <>
      <Stack.Screen options={{ title }} />

      <ScrollView style={styles.formWrap}>
        {isUnilateral && (
          <Select
            style={styles.field}
            control={control}
            name="side"
            options={[
              { label: "Select side", value: undefined },
              ...sideOptions,
            ]}
            required
          />
        )}

        <Input
          style={styles.field}
          control={control}
          name="weight"
          inputMode="numeric"
          required
        />
        <Input
          style={styles.field}
          control={control}
          name="reps"
          inputMode="numeric"
          required
        />
        <Select
          style={styles.field}
          control={control}
          name="feels"
          options={feelingOptions}
        />
        <Input
          style={styles.field}
          control={control}
          name="comment"
          multiline
        />

        {!isEditing && (
          <>
            <Text>Rest timer:</Text>
            <Text style={styles.timer}>{String(timer)}</Text>
          </>
        )}
      </ScrollView>

      {!isKeyboardVisible && (
        <>
          <View style={{ ...styles.btn, bottom: 40 }}>
            <Button title="Delete set" color="red" onPress={confirmDelete} />
          </View>

          <View style={styles.btn}>
            <Button title="Save set" onPress={editSetParams} />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  field: { marginTop: 20 },
  timer: { fontSize: 44, color: "green" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default SetEditor;
