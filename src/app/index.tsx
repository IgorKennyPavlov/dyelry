import { useCallback, useMemo } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from "react-native";

import { SessionListItem, listItemCommonStyles } from "../components";
import { useNavigate, SESSIONS, SessionProps } from "../global";
import { usePersistentStore, useTargetStore } from "../store";

const SessionList = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { setTargetSessionId } = useTargetStore();
  const { navigate } = useNavigate();

  const reversedSessions = useMemo(() => [...sessions].reverse(), [sessions]);

  const addSession = useCallback(() => {
    setTargetSessionId(String(Date.now()));
    navigate(`/session/session-editor`);
  }, [navigate, setTargetSessionId]);

  return (
    <>
      {sessions?.length ? (
        <View style={styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "25%" }}>Date</Text>
            <Text style={{ width: "45%" }}>Title</Text>
            <Text style={{ width: "20%" }}>Duration</Text>
            <Text style={{ width: "10%" }}>Edit</Text>
          </View>

          <FlatList
            data={reversedSessions}
            renderItem={(props: ListRenderItemInfo<SessionProps>) => (
              <SessionListItem {...props} />
            )}
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
  list: { paddingBottom: 76 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SessionList;
