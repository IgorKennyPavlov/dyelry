import { uuid } from "expo-modules-core";
import { Tabs, useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, View, StyleSheet, Alert, Dimensions } from "react-native";

import { Input } from "../components";
import { useNavigate, useKeyboard, getSessionTitle } from "../global";
import type { SessionProps } from "../global/types";
import {
  usePersistentStore,
  useTargetStore,
  useTargetSelectors,
} from "../store";

interface SessionEditForm {
  title: string;
  comment: string;
}

const SessionEditor = () => {
  const { navigate } = useNavigate();
  const { isKeyboardVisible } = useKeyboard();
  const { addSession, editSession, deleteSession } = usePersistentStore();
  const { targetSessionId, setTargetSessionId } = useTargetStore();
  const { targetSession } = useTargetSelectors();

  const title = useMemo(() => getSessionTitle(targetSession), [targetSession]);
  const { getValues, control, reset } = useForm<SessionEditForm>();

  useFocusEffect(
    useCallback(() => {
      reset({
        title: targetSession?.title || "",
        comment: targetSession?.comment || "",
      });
    }, [reset, targetSession]),
  );

  const saveSession = useCallback(() => {
    if (!targetSessionId) return;

    const { comment, title } = getValues();
    const sessionData: SessionProps = {
      id: targetSessionId,
      comment: comment.trim(),
      title: title.trim(),
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
    if (!targetSessionId) return;

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

  const copySession = useCallback(() => {
    if (!targetSession) return;

    const replacer = ["id", "title", "exercises", "sets", "weight", "reps"];
    const tplString = JSON.stringify(targetSession, replacer);
    const sessionCopy: SessionProps = JSON.parse(
      tplString,
      (key: string, value: unknown) => (key === "id" ? uuid.v4() : value),
    );

    // TODO add saving/loading session templates
    // addTplSession({ ...sessionCopy, title: sessionCopy.title + "(copy)" });
    addSession({ ...sessionCopy, title: `${sessionCopy.title} (copy)` });
    navigate("/");
  }, [addSession, navigate, targetSession]);

  return (
    <>
      <Tabs.Screen options={{ title }} />

      <View style={styles.formWrap}>
        <Input style={styles.field} control={control} name="title" />
        <Input style={styles.field} control={control} name="comment" />
      </View>

      {!isKeyboardVisible && (
        <>
          {targetSessionId && (
            <View style={{ ...styles.btn, bottom: 40 }}>
              <Button
                title="Delete session"
                color="red"
                onPress={confirmDelete}
              />
            </View>
          )}

          <>
            <View style={{ ...styles.btnCompact, ...styles.btnLeft }}>
              <Button
                title={`${targetSession ? "Update" : "Add"} session`}
                onPress={saveSession}
              />
            </View>
            <View style={{ ...styles.btnCompact, ...styles.btnRight }}>
              <Button
                title="Copy session"
                color="orange"
                disabled={!targetSession}
                onPress={copySession}
              />
            </View>
          </>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  formWrap: { flex: 1 },
  field: { marginTop: 20 },
  btn: { position: "absolute", bottom: 0, width: "100%" },
  btnCompact: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width / 2,
  },
  btnLeft: { left: 0 },
  btnRight: { right: 0 },
});

export default SessionEditor;
