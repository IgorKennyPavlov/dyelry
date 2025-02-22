import { useCallback } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

import {
  useSessionsStore,
  useExerciseDataStore,
  useTemplatesStore,
} from "../../store";

// TODO copy-pasted code. Refactoring is needed.
const Impex = () => {
  const { clearSessions, importSessions, exportSessions } = useSessionsStore();

  const { clearExerciseData, importExerciseData, exportExerciseData } =
    useExerciseDataStore();

  const {
    clearSessions: clearTemplates,
    importSessions: importTemplates,
    exportSessions: exportTemplates,
  } = useTemplatesStore();

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
    await importSessions();
    useSessionsStore.persist.rehydrate();
  }, [importSessions]);

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
    await importExerciseData();
    useExerciseDataStore.persist.rehydrate();
  }, [importExerciseData]);

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
    await importTemplates();
    useTemplatesStore.persist.rehydrate();
  }, [importTemplates]);

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

  return (
    <>
      <View style={{ ...styles.confirmBtn, top: 0 }}>
        <Button
          title="Clear sessions"
          color="red"
          onPress={tryToClearSessions}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 40 }}>
        <Button
          title="Export sessions"
          color="orange"
          onPress={exportSessions}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 80 }}>
        <Button
          title="Import sessions"
          color="green"
          onPress={tryToImportSessions}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, top: 160 }}>
        <Button
          title="Clear exercise data"
          color="red"
          onPress={tryToClearExerciseData}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 200 }}>
        <Button
          title="Export exercise data"
          color="orange"
          onPress={exportExerciseData}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 240 }}>
        <Button
          title="Import exercise data"
          color="green"
          onPress={tryToImportExerciseData}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, top: 320 }}>
        <Button
          title="Clear templates"
          color="red"
          onPress={tryToClearTemplates}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 360 }}>
        <Button
          title="Export templates"
          color="orange"
          onPress={exportTemplates}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 400 }}>
        <Button
          title="Import templates"
          color="green"
          onPress={tryToImportTemplates}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  confirmBtn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Impex;
