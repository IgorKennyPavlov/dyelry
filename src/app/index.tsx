import { useRouter } from "expo-router";
import { useCallback } from "react";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

import { SessionProps } from "./types";
import SessionListItem from "../components/SessionListItem";
import { mockSessionList } from "../mock";

const SessionList = () => {
  const router = useRouter();
  const renderItem = (props: ListRenderItemInfo<SessionProps>) => (
    <SessionListItem {...props} />
  );
  const onNewSessionClick = () => router.push(`/session/new-session`);

  return (
    <>
      <View id="btn-panel" style={styles.actionPanel}>
        <Button title="new session" onPress={onNewSessionClick} />
        <Button title="Another Action" />
      </View>
      <FlatList data={mockSessionList} renderItem={renderItem} />
    </>
  );
};

const styles = StyleSheet.create({
  actionPanel: {
    marginVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export default SessionList;
