import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItemInfo,
} from "react-native";
import { useStore } from "../../../store";
import SetListItem from "../../../components/SetListItem";
import { SetProps } from "../../types";

const Exercise = () => {
  const router = useRouter();
  const { sessions, addExercise } = useStore();
  const sessionId = useLocalSearchParams().sessionId as string;
  const exerciseId = useLocalSearchParams().exerciseId as string;
  const session = sessions.find((el) => el.id === sessionId);
  const exercise = session.exercises.find((el) => el.id === exerciseId);

  const renderItem = (props: ListRenderItemInfo<SetProps>) => (
    <SetListItem {...props} />
  );

  const onNewExerciseClick = () => {
    // const id = Date.now().toString();
    // addExercise(sessionId, { id, start: new Date() });
    // router.push(`/session/${sessionId}/exercise/${id}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: exercise.title,
        }}
      />
      {exercise.sets?.length ? (
        <FlatList data={exercise.sets} renderItem={renderItem} />
      ) : (
        <View style={styles.emptyListMsgWrap}>
          <Text>No sets recorded</Text>
        </View>
      )}

      <View style={styles.confirmBtn}>
        <Button title="New set" onPress={onNewExerciseClick} />
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

export default Exercise;
