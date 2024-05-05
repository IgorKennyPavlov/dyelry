import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from "react-native";

import { SessionListItem, listItemCommonStyles } from "../components";
import {
  useNavigate,
  SESSIONS,
  SessionProps,
  getPage,
  PAGE_SIZE,
} from "../global";
import { usePersistentStore, useTargetStore } from "../store";

const SessionList = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { setTargetSessionId } = useTargetStore();
  const { navigate } = useNavigate();

  const [pageNumber, setPageNumber] = useState(0);
  const reversedSessions = useMemo(() => [...sessions].reverse(), [sessions]);
  const page = useMemo(
    () => getPage(reversedSessions, pageNumber),
    [pageNumber, reversedSessions],
  );

  const toPage = useCallback(
    (pageNumber: number) => {
      const maxPage = Math.ceil(sessions.length / PAGE_SIZE) - 1;
      const targetPage = Math.max(0, Math.min(pageNumber, maxPage));
      setPageNumber(targetPage);
    },
    [sessions.length],
  );

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
            data={page}
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

      {sessions.length > PAGE_SIZE && (
        <View style={styles.paginationPanel}>
          <Button title="<= Prev page" onPress={() => toPage(pageNumber - 1)} />
          <Button title="Next page =>" onPress={() => toPage(pageNumber + 1)} />
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
  paginationPanel: { position: "absolute", bottom: 40, flexDirection: "row" },
  confirmBtn: { position: "absolute", bottom: 0, left: 0, right: 0 },
});

export default SessionList;
