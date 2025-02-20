import { uuid } from "expo-modules-core";
import {
  Tabs,
  useFocusEffect,
  useLocalSearchParams,
  router,
} from "expo-router";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button, View, StyleSheet, Alert, Dimensions } from "react-native";

import { Input } from "./form";
import { useKeyboard, getSessionTitle, SESSIONS, TEMPLATES } from "../global";
import type { SessionProps } from "../global/types";
import { useSessionsStore, useTemplatesStore } from "../store";

interface SessionEditForm {
  title: string;
  comment: string;
}

interface SessionEditorProps {
  isTemplate?: boolean;
}

const REPLACER = ["id", "title", "exercises", "sets", "weight", "reps", "side"];

export const SessionEditor = ({ isTemplate }: SessionEditorProps) => {
  const { isKeyboardVisible } = useKeyboard();

  const { sessionID } = useLocalSearchParams<{
    sessionID?: string;
  }>();

  const { addSession: addTemplateSession } = useTemplatesStore();

  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;

  const {
    [storeKey]: sessions,
    addSession,
    editSession,
    deleteSession,
  } = useStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const title = useMemo(
    () => getSessionTitle(targetSession, isTemplate),
    [targetSession],
  );
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
    const { comment, title } = getValues();
    const sessionData: SessionProps = {
      id: sessionID || uuid.v4(),
      comment: comment.trim(),
      title: title.trim(),
    };

    if (sessionID) {
      editSession(sessionID, sessionData);
      router.dismissTo(isTemplate ? "template" : "session");
      return;
    }

    addSession(sessionData);
    router.dismissTo({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]`,
      params: { sessionID: sessionData.id },
    });
  }, [addSession, editSession, getValues, sessionID]);

  const confirmDelete = useCallback(() => {
    if (!sessionID) return;

    Alert.alert(
      "Deleting session",
      "Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: () => {
            router.dismissTo(isTemplate ? "template" : "session");
            deleteSession(sessionID);
          },
        },
      ],
      { cancelable: true },
    );
  }, [deleteSession, sessionID]);

  const copySession = useCallback(() => {
    if (!targetSession) return;

    const tplString = JSON.stringify(targetSession, REPLACER);
    const sessionCopy: SessionProps = JSON.parse(
      tplString,
      (key: string, value: unknown) => (key === "id" ? uuid.v4() : value),
    );

    addTemplateSession({ ...sessionCopy, title: sessionCopy.title + "(copy)" });
    router.replace("template");
  }, [addSession, targetSession]);

  return (
    <>
      <Tabs.Screen options={{ title }} />

      <View style={styles.formWrap}>
        <Input style={styles.field} control={control} name="title" />
        <Input style={styles.field} control={control} name="comment" />
      </View>

      {!isKeyboardVisible && (
        <>
          {sessionID && (
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
                title="Copy to templates"
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
