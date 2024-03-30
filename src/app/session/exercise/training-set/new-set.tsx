import { Picker } from "@react-native-picker/picker";
import { useLocalSearchParams, router } from "expo-router";
import { useCallback, useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Text, Button, View, StyleSheet, TextInput, Alert } from "react-native";

import { Feels, FeelsReadable } from "../../../../global";
import { useStore } from "../../../../store";
import { queryfy } from "../../../../utils";

interface SetEditForm {
  weight: string;
  reps: string;
  feels: Feels;
  comment: string;
}

const NewSet = () => {
  const { addSet } = useStore();

  const [timer, setTimer] = useState(0);
  const intervalId = useRef(null);

  const params = useLocalSearchParams() as Record<string, string>;
  const { sessionId, exerciseId, start } = params;

  const config = { defaultValues: { feels: Feels.Ok } };
  const { getValues, control } = useForm<SetEditForm>(config);

  useEffect(() => {
    intervalId.current = setInterval(
      () => setTimer((prevTimer) => prevTimer + 1),
      1000,
    );
  }, []);

  const finishExercise = useCallback(() => {
    Alert.alert(
      "Finishing set",
      "Are you sure?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            clearInterval(intervalId.current);

            const id = Date.now().toString();
            const { weight, reps, feels, comment } = getValues();

            // TODO replace with proper validation
            if (weight === "" || reps === "") {
              alert("Fill the required fields!");
              return;
            }

            addSet(sessionId, exerciseId, {
              id,
              start: new Date(start),
              end: new Date(),
              weight: +weight,
              reps: +reps,
              feels,
              comment,
              rest: timer,
            });

            const q = queryfy({ sessionId });
            router.push(`/session/exercise/${exerciseId}?${q}`);
          },
        },
      ],
      { cancelable: true },
    );
  }, [addSet, exerciseId, getValues, sessionId, start, timer]);

  return (
    <>
      <View style={styles.formWrap}>
        <View style={styles.fieldWrap}>
          <Text>Weight:</Text>
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
                  <Picker.Item label={label} value={value} />
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
                style={styles.textField}
                value={value}
                onChangeText={(value) => onChange(value)}
                onBlur={onBlur}
              />
            )}
            name="comment"
          />
        </View>

        <Text>Rest timer:</Text>
        <Text style={styles.timer}>{timer.toString()}</Text>
      </View>

      <View style={styles.btn}>
        <Button title="Finish rest, save set" onPress={finishExercise} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  fieldWrap: { marginBottom: 20 },
  textField: { height: 44, fontSize: 20, borderWidth: 1, borderColor: "#000" },
  selectField: { height: 44, fontSize: 20, textAlign: "left" },
  timer: { fontSize: 44, color: "green" },
  btn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default NewSet;
