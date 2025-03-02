import { useCallback, useMemo } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

import {
  useSessionsStore,
  useExerciseDataStore,
  useTemplatesStore,
  useUsersStore,
  importStoreAsync,
  exportStoreAsync,
} from "../../store";
import { USERS, SESSIONS, TEMPLATES, EXERCISE_DATA } from "../../store/keys";

// TODO copy-pasted code. Refactoring is needed.
const Impex = () => {
  const { [USERS]: users } = useUsersStore();

  const { clearSessions } = useSessionsStore();
  const { clearSessions: clearTemplates } = useTemplatesStore();
  const { clearExerciseData } = useExerciseDataStore();

  const activeUser = useMemo(
    () => Object.keys(users).find((key) => users[key]),
    [users],
  );

  const tryToClearSessions = useCallback(() => {
    Alert.alert(
      "Cleaning storage",
      "Are you REALLY sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: clearSessions },
      ],
      { cancelable: true },
    );
  }, [clearSessions]);

  const importSessionsStore = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await importStoreAsync(SESSIONS + postfix);
    useSessionsStore.persist.rehydrate();
  }, [activeUser]);

  const tryToImportSessions = useCallback(() => {
    Alert.alert(
      "Importing sessions",
      "Are you REALLY sure? Your sessions will be overridden!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: importSessionsStore },
      ],
      { cancelable: true },
    );
  }, [importSessionsStore]);

  const exportSessions = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await exportStoreAsync(SESSIONS + postfix);
  }, [activeUser]);

  const tryToClearTemplates = useCallback(() => {
    Alert.alert(
      "Cleaning storage",
      "Are you REALLY sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: clearTemplates },
      ],
      { cancelable: true },
    );
  }, [clearTemplates]);

  const importTemplatesStore = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await importStoreAsync(TEMPLATES + postfix);
    useTemplatesStore.persist.rehydrate();
  }, [activeUser]);

  const tryToImportTemplates = useCallback(() => {
    Alert.alert(
      "Importing exercises",
      "Are you REALLY sure? Your exercise library will be overridden!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: importTemplatesStore },
      ],
      { cancelable: true },
    );
  }, [importTemplatesStore]);

  const exportTemplates = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await exportStoreAsync(TEMPLATES + postfix);
  }, [activeUser]);

  const tryToClearExerciseData = useCallback(() => {
    Alert.alert(
      "Cleaning storage",
      "Are you REALLY sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: clearExerciseData },
      ],
      { cancelable: true },
    );
  }, [clearExerciseData]);

  const importExerciseDataStore = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await importStoreAsync(EXERCISE_DATA + postfix);
    useExerciseDataStore.persist.rehydrate();
  }, [activeUser]);

  const tryToImportExerciseData = useCallback(() => {
    Alert.alert(
      "Importing exercises",
      "Are you REALLY sure? Your exercise library will be overridden!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: importExerciseDataStore },
      ],
      { cancelable: true },
    );
  }, [importExerciseDataStore]);

  const exportExerciseData = useCallback(async () => {
    const postfix = activeUser ? `-${activeUser.replaceAll(" ", "_")}` : "";
    await exportStoreAsync(EXERCISE_DATA + postfix);
  }, [activeUser]);

  return (
    <View style={styles.btnPanel}>
      <View style={styles.confirmBtn}>
        <Button
          title="Clear sessions"
          color="red"
          onPress={tryToClearSessions}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Export sessions"
          color="orange"
          onPress={exportSessions}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Import sessions"
          color="green"
          onPress={tryToImportSessions}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, marginTop: 40 }}>
        <Button
          title="Clear templates"
          color="red"
          onPress={tryToClearTemplates}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Export templates"
          color="orange"
          onPress={exportTemplates}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Import templates"
          color="green"
          onPress={tryToImportTemplates}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, marginTop: 40 }}>
        <Button
          title="Clear exercise data"
          color="red"
          onPress={tryToClearExerciseData}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Export exercise data"
          color="orange"
          onPress={exportExerciseData}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title="Import exercise data"
          color="green"
          onPress={tryToImportExerciseData}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnPanel: { flex: 1 },
  confirmBtn: { width: "100%", height: 40 },
});

export default Impex;
