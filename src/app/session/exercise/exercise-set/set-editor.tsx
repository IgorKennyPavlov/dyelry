import { Picker } from "@react-native-picker/picker";
import { Stack } from "expo-router";
import {
  useCallback,
  useState,
  useRef,
  useEffect,
  MutableRefObject,
} from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import {
  Feels,
  FeelsReadable,
  getIntervalSeconds,
  useNavigate,
  FeelsColors,
} from "../../../../global";
import { usePersistentStore, useTargetStore } from "../../../../store";
import { useTarget } from "../../../../store/useTarget";

interface SetEditForm {
  weight: string;
  reps: string;
  feels: Feels;
  comment?: string;
}

const SetEditor = () => {
  const { navigate } = useNavigate();
  const { editSet, deleteSet } = usePersistentStore();
  const { targetSessionId, targetExerciseId, targetSetId, setTargetSetId } =
    useTargetStore();

  // TODO separate textarea into a component?
  const [commentHeight, setCommentHeight] = useState(0);
  const [timer, setTimer] = useState(0);
  const intervalId: MutableRefObject<number | null> = useRef(null);

  const { targetSet } = useTarget();

  const isEditing =
    targetSet?.weight !== undefined && targetSet.reps !== undefined;

  const { getValues, control } = useForm<SetEditForm>({
    defaultValues: {
      weight: String(targetSet?.weight || ""),
      reps: String(targetSet?.reps || ""),
      feels: targetSet?.feels || Feels.Ok,
      comment: String(targetSet?.comment || ""),
    },
  });

  useEffect(() => {
    if (isEditing || !targetSet?.end) {
      return;
    }

    intervalId.current = window.setInterval(() => {
      setTimer(getIntervalSeconds(new Date(), targetSet.end as Date));
    }, 1000);

    return () => clearInterval(intervalId.current as number);
  }, [isEditing, targetSet?.end]);

  const editSetParams = useCallback(() => {
    if (!targetSessionId || !targetExerciseId || !targetSetId) {
      return;
    }

    const { weight, reps, feels, comment } = getValues();

    // TODO replace with proper validation
    if (weight === "" || reps === "") {
      alert("Fill the required fields!");
      return;
    }

    const updatedSet = {
      weight: +weight,
      reps: +reps,
      feels,
      comment,
    };
    editSet(targetSessionId, targetExerciseId, targetSetId, updatedSet);

    navigate("/session/exercise/view");
  }, [
    getValues,
    editSet,
    targetSessionId,
    targetExerciseId,
    targetSetId,
    navigate,
  ]);

  const confirmDelete = useCallback(() => {
    if (!targetSessionId || !targetExerciseId || !targetSetId) {
      return;
    }

    Alert.alert(
      "Deleting set",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/session/exercise/view");
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

  return (
    <>
      <Stack.Screen
        options={{
          title: isEditing ? "Edit set" : "Input set params",
          headerBackVisible: false,
        }}
      />

      <ScrollView style={styles.formWrap}>
        <View style={styles.fieldWrap}>
          <Text>Weight:</Text>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                inputMode="numeric"
                style={styles.textField}
                value={value}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
              />
            )}
            rules={{ required: true }}
            name="weight"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text>Reps:</Text>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                inputMode="numeric"
                style={styles.textField}
                value={value}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
              />
            )}
            rules={{ required: true }}
            name="reps"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text>Feels:</Text>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <Picker
                style={styles.selectField}
                selectedValue={value}
                onValueChange={onChange}
                onBlur={onBlur}
              >
                {[...FeelsReadable.entries()].map(([value, label]) => (
                  <Picker.Item
                    color={FeelsColors.get(value)}
                    key={value}
                    label={label}
                    value={value}
                  />
                ))}
              </Picker>
            )}
            name="feels"
          />
        </View>

        <View style={styles.fieldWrap}>
          <Text>Comment:</Text>
          <Controller
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                multiline
                style={{ ...styles.textField, height: commentHeight }}
                value={value}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
                onContentSizeChange={(e) =>
                  setCommentHeight(e.nativeEvent.contentSize.height + 24)
                }
              />
            )}
            name="comment"
          />
        </View>

        {!isEditing && (
          <>
            <Text>Rest timer:</Text>
            <Text style={styles.timer}>{timer.toString()}</Text>
          </>
        )}
      </ScrollView>

      {isEditing && (
        <View style={{ ...styles.btn, bottom: 40 }}>
          <Button title="Delete set" color="red" onPress={confirmDelete} />
        </View>
      )}

      <View style={styles.btn}>
        <Button title="Save set" onPress={editSetParams} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  fieldWrap: { marginTop: 20 },
  textField: {
    minHeight: 44,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  selectField: {
    minHeight: 44,
    fontSize: 20,
    textAlign: "left",
  },
  timer: { fontSize: 44, color: "green" },
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SetEditor;
