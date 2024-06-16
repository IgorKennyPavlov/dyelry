import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Tabs, useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, View, StyleSheet, Alert } from "react-native";

import { Input, DatePicker } from "../components";
import {
  useNavigate,
  SessionProps,
  useKeyboard,
  SESSIONS,
  getSessionTitle,
} from "../global";
import { usePersistentStore, useTargetStore, useTarget } from "../store";

interface SessionEditForm {
  title: string;
  date: Date;
  comment: string;
}

const SessionEditor = () => {
  const { navigate } = useNavigate();
  const { isKeyboardVisible } = useKeyboard();
  const {
    [SESSIONS]: sessions,
    addSession,
    editSession,
    deleteSession,
  } = usePersistentStore();
  const { targetSessionId, setTargetSessionId } = useTargetStore();
  const { targetSession } = useTarget();

  const { getValues, control, setValue, reset } = useForm<SessionEditForm>();

  useFocusEffect(
    useCallback(() => {
      reset({
        title: targetSession?.title || "",
        date: targetSession?.start || new Date(),
        comment: targetSession?.comment || "",
      });
    }, [reset, targetSession]),
  );

  const selectDate = useCallback(
    (_: DateTimePickerEvent, date?: Date) => date && setValue("date", date),
    [setValue],
  );

  const saveSession = useCallback(() => {
    if (!targetSessionId) {
      return;
    }

    const sessionData: SessionProps = {
      id: targetSessionId,
      start: getValues().date,
      ...getValues(),
    };

    if (targetSession) {
      editSession(targetSessionId, sessionData);
      navigate("/");
      return;
    }

    addSession(sessionData);
    navigate("/session");
  }, [
    addSession,
    editSession,
    getValues,
    navigate,
    targetSession,
    targetSessionId,
  ]);

  const confirmDelete = useCallback(() => {
    if (!targetSessionId) {
      return;
    }

    Alert.alert(
      "Deleting session",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            navigate("/");
            deleteSession(targetSessionId);
            setTargetSessionId(null);
          },
        },
      ],
      { cancelable: true },
    );
  }, [deleteSession, navigate, setTargetSessionId, targetSessionId]);

  const resumeSession = useCallback(() => {
    if (!targetSessionId || !targetSession) {
      return;
    }

    const isSessionLast = targetSession === sessions.at(-1);

    if (!isSessionLast) {
      alert("You can resume only the last session!");
      return;
    }

    editSession(targetSessionId, {
      ...targetSession,
      end: undefined,
    });

    navigate("/");
  }, [editSession, navigate, sessions, targetSession, targetSessionId]);

  const title = useMemo(() => getSessionTitle(targetSession), [targetSession]);

  return (
    <>
      <Tabs.Screen options={{ title }} />

      <View style={styles.formWrap}>
        <Input style={styles.field} control={control} name="title" />
        <DatePicker
          style={styles.field}
          name="date"
          control={control}
          onChange={selectDate}
        />
        <Input style={styles.field} control={control} name="comment" />
      </View>

      {!isKeyboardVisible && (
        <>
          {targetSession?.end && (
            <View style={{ ...styles.btn, bottom: 80 }}>
              <Button
                title="Resume session"
                color="orange"
                onPress={resumeSession}
              />
            </View>
          )}

          {targetSession && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button
                title="Delete session"
                color="red"
                onPress={confirmDelete}
              />
            </View>
          )}

          <View style={styles.btn}>
            <Button
              title={`${targetSession ? "Update" : "Add"} session`}
              onPress={saveSession}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  field: { marginTop: 20 },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default SessionEditor;
