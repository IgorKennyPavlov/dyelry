import { useCallback, useMemo } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

import { useTranslation } from "react-i18next";
import { USERS, SESSIONS, TEMPLATES, EXERCISE_DATA } from "../store/keys";
import {
  useUsersStore,
  useSessionsStore,
  useTemplatesStore,
  useExerciseDataStore,
  importStoreAsync,
  exportStoreAsync,
} from "../store";

// TODO copy-pasted code. Refactoring is needed.
export const Impex = () => {
  const { t } = useTranslation();
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
      t("alert.cleanStorageConfirm.title"),
      t("alert.cleanStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        { text: t("action.confirm"), style: "default", onPress: clearSessions },
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
      t("alert.importStorageConfirm.title"),
      t("alert.importStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: importSessionsStore,
        },
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
      t("alert.cleanStorageConfirm.title"),
      t("alert.cleanStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: clearTemplates,
        },
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
      t("alert.importStorageConfirm.title"),
      t("alert.importStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: importTemplatesStore,
        },
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
      t("alert.cleanStorageConfirm.title"),
      t("alert.cleanStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: clearExerciseData,
        },
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
      t("alert.importStorageConfirm.title"),
      t("alert.importStorageConfirm.text"),
      [
        { text: t("action.cancel"), style: "cancel" },
        {
          text: t("action.confirm"),
          style: "default",
          onPress: importExerciseDataStore,
        },
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
          title={t("action.clearSessions")}
          color="red"
          onPress={tryToClearSessions}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.exportSessions")}
          color="orange"
          onPress={exportSessions}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.importSessions")}
          color="green"
          onPress={tryToImportSessions}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, marginTop: 40 }}>
        <Button
          title={t("action.clearTemplates")}
          color="red"
          onPress={tryToClearTemplates}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.exportTemplates")}
          color="orange"
          onPress={exportTemplates}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.importTemplates")}
          color="green"
          onPress={tryToImportTemplates}
        />
      </View>

      {/*===========================================================*/}

      <View style={{ ...styles.confirmBtn, marginTop: 40 }}>
        <Button
          title={t("action.clearExerciseData")}
          color="red"
          onPress={tryToClearExerciseData}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.exportExerciseData")}
          color="orange"
          onPress={exportExerciseData}
        />
      </View>

      <View style={styles.confirmBtn}>
        <Button
          title={t("action.importExerciseData")}
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
