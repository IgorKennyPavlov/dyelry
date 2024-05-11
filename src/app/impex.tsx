import { useCallback } from "react";
import { View, Button, StyleSheet, Alert } from "react-native";

import {
  exportStoreAsync,
  importSessionsAsync,
  usePersistentStore,
} from "../store";

const Impex = () => {
  const { clearStore } = usePersistentStore();

  const tryToClearStore = useCallback(() => {
    Alert.alert(
      "Cleaning storage",
      "Are you REALLY sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: clearStore },
      ],
      { cancelable: true },
    );
  }, [clearStore]);

  const importSessions = useCallback(async () => {
    await importSessionsAsync();
    usePersistentStore.persist.rehydrate();
  }, []);

  const tryToImportSessions = useCallback(() => {
    Alert.alert(
      "Importing sessions",
      "Are you REALLY sure? Your sessions will be overridden!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: importSessions },
      ],
      { cancelable: true },
    );
  }, [importSessions]);

  return (
    <>
      <View style={{ ...styles.confirmBtn, top: 0 }}>
        <Button title="Clear store" color="red" onPress={tryToClearStore} />
      </View>

      <View style={{ ...styles.confirmBtn, top: 40 }}>
        <Button
          title="Export store"
          color="orange"
          onPress={exportStoreAsync}
        />
      </View>

      <View style={{ ...styles.confirmBtn, top: 80 }}>
        <Button
          title="Import store"
          color="green"
          onPress={tryToImportSessions}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  confirmBtn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Impex;
