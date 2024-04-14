import { useRouter } from "expo-router";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from "react-native";

import SessionListItem from "../components/SessionListItem";
import { SessionProps } from "../global";
import { useStore } from "../store";

const SessionList = () => {
  const router = useRouter();
  const { sessions } = useStore();

  const renderItem = (props: ListRenderItemInfo<SessionProps>) => (
    <SessionListItem {...props} />
  );
  const addSession = () => router.push(`/session/new-session`);

  return (
    <>
      {sessions?.length ? (
        <View style={styles.list}>
          <FlatList data={sessions} renderItem={renderItem} />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sessions recorded</Text>
        </View>
      )}

      <View style={styles.confirmBtn}>
        <Button title="Add session" onPress={addSession} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 36 },
  emptyList: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SessionList;
