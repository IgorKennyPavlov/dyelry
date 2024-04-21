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
import { useNavigate } from "../../global";
import { useSessionsStore, useTargetStore } from "../../store";
import { useTarget } from "../../store/useTarget";

const Session = () => {
  const { navigate } = useNavigate();
  const { editSession } = useSessionsStore();
  const { targetSessionId, setTargetExerciseId } = useTargetStore();

  const { targetSession } = useTarget();

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

  const addExercise = useCallback(() => {
    setTargetExerciseId(String(Date.now()));
    navigate(`/session/exercise/exercise-editor`);
  }, [navigate, setTargetExerciseId]);

  const endSession = useCallback(() => {
    if (!targetSessionId) {
      return;
    }

    editSession(targetSessionId, { end: new Date() });
    navigate(`/`);
  }, [editSession, navigate, targetSessionId]);

  return (
    <>
      {targetSession?.exercises?.length ? (
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
