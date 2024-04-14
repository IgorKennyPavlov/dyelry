import { View, Button, StyleSheet, Alert } from "react-native";

import {
  exportStoreAsync,
  importSessionsAsync,
  useSessionsStore,
} from "../store";

const Impex = () => {
  const { clearStore } = useSessionsStore();

  const tryToClearStore = () => {
    Alert.alert(
      "Cleaning storage",
      "Are you REALLY sure?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: clearStore },
      ],
      { cancelable: true },
    );
  };

  const importSessions = async () => {
    await importSessionsAsync();
    useSessionsStore.persist.rehydrate();
  };

  const tryToImportSessions = () => {
    Alert.alert(
      "Importing sessions",
      "Are you REALLY sure? Your sessions will be overridden!",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", style: "default", onPress: importSessions },
      ],
      { cancelable: true },
    );
  };

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
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default Impex;
