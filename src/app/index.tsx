import { useRouter } from "expo-router";
import {
  FlatList,
  View,
  Button,
  StyleSheet,
  ListRenderItemInfo,
  Text,
} from "react-native";

import { SessionProps } from "./types";
import SessionListItem from "../components/SessionListItem";
import React from "react";
import { useStore } from "../store";

const SessionList = () => {
  const router = useRouter();
  const { sessions } = useStore();
  const renderItem = (props: ListRenderItemInfo<SessionProps>) => (
    <SessionListItem {...props} />
  );
  const onNewSessionClick = () => router.push(`/session/new-session`);

  return (
    <>
      {sessions.length ? (
        <FlatList data={sessions} renderItem={renderItem} />
      ) : (
        <View style={styles.emptyListMsgWrap}>
          <Text>No sessions recorded</Text>
        </View>
      )}

      <View style={styles.confirmBtn}>
        <Button title="New session" onPress={onNewSessionClick} />
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
