import { Stack } from "expo-router";
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

import { ExerciseListItem, listItemCommonStyles } from "../../components";
import type { ExerciseProps } from "../../global";
import { useNavigate, getSessionTitle } from "../../global";
import {
  usePersistentStore,
  useTargetStore,
  useTargetSelectors,
} from "../../store";

const Session = () => {
  const { navigate } = useNavigate();
  const { editSession } = usePersistentStore();
  const { targetSessionId, setTargetExerciseId } = useTargetStore();

  const { targetSession } = useTargetSelectors();

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

  const addExercise = useCallback(() => {
    setTargetExerciseId(String(Date.now()));
    navigate(`/exercise-editor`);
  }, [navigate, setTargetExerciseId]);

  const endSession = useCallback(() => {
    if (!targetSessionId) return;

    editSession(targetSessionId, { end: new Date() });
    navigate(`/`);
  }, [editSession, navigate, targetSessionId]);

  const title = useMemo(() => getSessionTitle(targetSession), [targetSession]);

  return (
    <>
      <Stack.Screen options={{ title }} />

      {targetSession?.exercises?.length ? (
        <View style={targetSession.end ? {} : styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "40%" }}>Title</Text>
            <Text style={{ width: "30%" }}>Duration</Text>
            <Text style={{ width: "20%" }}>Kg/Min</Text>
            <Text style={{ width: "10%" }}>Edit</Text>
          </View>

          <FlatList
            data={targetSession.exercises}
            renderItem={(props: ListRenderItemInfo<ExerciseProps>) => (
              <ExerciseListItem {...props} />
            )}
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
  list: { paddingBottom: 76 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width / 2,
  },
  btnLeft: { left: 0 },
  btnRight: { right: 0 },
});

export default Session;
