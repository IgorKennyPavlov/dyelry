import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import React from "react";
import {
  Text,
  View,
  ListRenderItemInfo,
  Button,
  FlatList,
  StyleSheet,
} from "react-native";

import { useStore } from "../../store";
import { ExerciseProps } from "../types";
import ExerciseListItem from "../../components/ExerciseListItem";

const Session = () => {
  const router = useRouter();
  const { sessions, addExercise } = useStore();
  const sessionId = useLocalSearchParams().sessionId as string;
  const session = sessions.find((el) => el.id === sessionId);

  const renderItem = (props: ListRenderItemInfo<ExerciseProps>) => (
    <ExerciseListItem {...props} />
  );

  const onNewExerciseClick = () => {
    router.push(`/session/exercise/new-exercise?sessionId=${sessionId}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Session ${session.start.toLocaleDateString("ru-RU")}`,
        }}
      />
      {session.exercises?.length ? (
        <FlatList data={session.exercises} renderItem={renderItem} />
      ) : (
        <View style={styles.emptyListMsgWrap}>
          <Text>No exercises recorded</Text>
        </View>
      )}

      <View style={styles.confirmBtn}>
        <Button title="New exercise" onPress={onNewExerciseClick} />
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

export default Session;
