import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Text,
  Button,
  View,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import { Feels, FeelsReadable } from "../../../../global";
import { useStore } from "../../../../store";
import { SESSIONS } from "../../../../store/constants";
import { queryfy, getIntervalSeconds } from "../../../../utils";

interface SetEditForm {
  weight: string;
  reps: string;
  feels: Feels;
  comment?: string;
}

const NewSet = () => {
  const { [SESSIONS]: sessions, editSet } = useStore();

  // TODO separate textarea into a component?
  const [commentHeight, setCommentHeight] = useState(0);
  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  const params = useLocalSearchParams() as Record<string, string>;
  const { sessionId, exerciseId, setId } = params;
  const session = sessions.find((s) => s.id === sessionId);
  const exercise = session.exercises.find((e) => e.id === exerciseId);
  const targetSet = exercise.sets.find((s) => s.id === setId);

  const defaultValues: SetEditForm = { weight: "", reps: "", feels: Feels.Ok };
  const config = { defaultValues };
  const { getValues, control } = useForm<SetEditForm>(config);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      setTimer(getIntervalSeconds(new Date(), targetSet.end));
    }, 1000);

    return () => clearInterval(intervalId.current);
  }, [targetSet.end]);

  const editSetParams = useCallback(() => {
    // TODO rename fields to transform data easier?
    const { weight, reps, feels, comment } = getValues();

    // TODO replace with proper validation
    if (weight === "" || reps === "") {
      alert("Fill the required fields!");
      return;
    }

    // TODO remove rest field after the migration
    const updatedSet = {
      weight: +weight,
      reps: +reps,
      feels,
      comment,
      rest: 0,
    };
    editSet(sessionId, exerciseId, setId, updatedSet);

    const q = queryfy({ sessionId });
    router.push(`/session/exercise/${exerciseId}?${q}`);
  }, [editSet, exerciseId, getValues, sessionId, setId]);

  const finishExercise = useCallback(() => {
    Alert.alert(
      "Finishing set",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: editSetParams },
      ],
      { cancelable: true },
    );
  }, [editSetParams]);

  return (
    <>
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
                  <Picker.Item key={value} label={label} value={value} />
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

        <Text>Rest timer:</Text>
        <Text style={styles.timer}>{timer.toString()}</Text>
      </ScrollView>

      <View style={styles.btn}>
        <Button title="Finish rest, save set" onPress={finishExercise} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  fieldWrap: { marginBottom: 20 },
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

export default NewSet;
