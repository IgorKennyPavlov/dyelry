import { Stack, useRouter } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from "react-native";

import ExerciseListItem from "../../components/list-items/exercise-list-item";
import { SESSIONS } from "../../global";
import { useSessionsStore, useTargetStore } from "../../store";

const Session = () => {
  const router = useRouter();

  const { [SESSIONS]: sessions, editSession } = useSessionsStore();
  const { targetSessionId } = useTargetStore();

  const targetSession = useMemo(
    () => sessions.find((el) => el.id === targetSessionId),
    [sessions, targetSessionId],
  );

  const showActionPanel = useMemo(() => {
    if (!targetSession) {
      return false;
    }

    const { end, exercises } = targetSession;

    if (end) {
      return false;
    }

    return !exercises || exercises.every((e) => e.end);
  }, [targetSession]);

  const renderItem = (props: ListRenderItemInfo<string>) => (
    <ExerciseListItem {...props} />
  );

  const addExercise = useCallback(
    () => router.push(`/session/exercise/new-exercise`),
    [router],
  );

  const endSession = useCallback(() => {
    editSession(targetSessionId, { end: new Date() });
    router.push(`/`);
  }, [editSession, router, targetSessionId]);

  return (
    <>
      <Stack.Screen
        options={{
          title: `Session ${targetSession.start.toLocaleDateString("ru-RU")}`,
        }}
      />
      {targetSession.exercises?.length ? (
        <View style={targetSession.end ? {} : styles.list}>
          <FlatList
            data={targetSession.exercises.map((e) => e.id)}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No exercises recorded</Text>
        </View>
      )}

      {showActionPanel && (
        <>
          <View style={{ ...styles.btn, ...styles.btnLeft }}>
            <Button title="Add exercise" color="green" onPress={addExercise} />
          </View>
          <View style={{ ...styles.btn, ...styles.btnRight }}>
            <Button
              title="Finish session"
              color="orange"
              onPress={endSession}
            />
          </View>
        </>
      )}
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
  btn: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width / 2,
  },
  btnLeft: { left: 0 },
  btnRight: { right: 0 },
});

export default Session;
