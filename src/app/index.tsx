import { useRouter } from "expo-router";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
  Alert,
} from "react-native";

import SessionListItem from "../components/SessionListItem";
import { SessionProps } from "../global";
import { useStore, exportStoreAsync, importSessionsAsync } from "../store";

const SessionList = () => {
  const router = useRouter();
  const { sessions, clearStore } = useStore();

  const renderItem = (props: ListRenderItemInfo<SessionProps>) => (
    <SessionListItem {...props} />
  );
  const addSession = () => router.push(`/session/new-session`);

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
    useStore.persist.rehydrate();
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
      {sessions?.length ? (
        <FlatList data={sessions} renderItem={renderItem} />
      ) : (
        <View style={styles.emptyListMsgWrap}>
          <Text>No sessions recorded</Text>
        </View>
      )}

      <View style={{ ...styles.confirmBtn, bottom: 120 }}>
        <Button
          title="Import store"
          color="green"
          onPress={tryToImportSessions}
        />
      </View>

      <View style={{ ...styles.confirmBtn, bottom: 80 }}>
        <Button
          title="Export store"
          color="orange"
          onPress={exportStoreAsync}
        />
      </View>

      <View style={{ ...styles.confirmBtn, bottom: 40 }}>
        <Button title="Clear store" color="red" onPress={tryToClearStore} />
      </View>

      <View style={styles.confirmBtn}>
        <Button title="Add session" onPress={addSession} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyListMsgWrap: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SessionList;
