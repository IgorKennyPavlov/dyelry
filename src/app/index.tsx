import { useCallback } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from "react-native";

import SessionListItem from "../components/list-items/session-list-item";
import { useNavigate, SESSIONS } from "../global";
import { useSessionsStore, useTargetStore } from "../store";

const SessionList = () => {
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { setTargetSessionId } = useTargetStore();
  const { navigate } = useNavigate();

  const renderItem = (props: ListRenderItemInfo<string>) => (
    <SessionListItem {...props} />
  );

  const addSession = useCallback(() => {
    setTargetSessionId(String(Date.now()));
    navigate(`/session/session-editor`);
  }, [navigate, setTargetSessionId]);

  return (
    <>
      {sessions?.length ? (
        <View style={styles.list}>
          <FlatList
            data={sessions.map((s) => s.id).reverse()}
            renderItem={renderItem}
          />
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
