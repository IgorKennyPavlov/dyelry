import { Stack } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItemInfo,
  Dimensions,
} from "react-native";

import SetListItem from "../../../components/list-items/set-list-item";
import { useNavigate, SetProps } from "../../../global";
import { usePersistentStore, useTargetStore } from "../../../store";
import { useTarget } from "../../../store/useTarget";

const Exercise = () => {
  const { navigate } = useNavigate();
  const { editExercise } = usePersistentStore();
  const { targetSessionId, targetExerciseId, setTargetSetId } =
    useTargetStore();

  const { targetExercise } = useTarget();

  const showActionPanel = useMemo(() => {
    if (!targetExercise) {
      return false;
    }

    const { end, sets } = targetExercise;

    if (end) {
      return false;
    }

    return !sets || sets.every((s) => s.end);
  }, [targetExercise]);

  const addSet = useCallback(() => {
    setTargetSetId(null);
    navigate("/session/exercise/exercise-set/timer");
  }, [navigate, setTargetSetId]);

  const endExercise = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) {
      return;
    }

    editExercise(targetSessionId, targetExerciseId, { end: new Date() });
    navigate("/session/view");
  }, [editExercise, navigate, targetExerciseId, targetSessionId]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: targetExercise?.title,
        }}
      />

      {targetExercise?.sets?.length ? (
        <View style={targetExercise.end ? {} : styles.list}>
          <FlatList
            data={targetExercise.sets}
            renderItem={(props: ListRenderItemInfo<SetProps>) => (
              <SetListItem {...props} />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sets recorded</Text>
        </View>
      )}

      {showActionPanel && (
        <>
          <View style={{ ...styles.btn, ...styles.btnLeft }}>
            <Button title="Add set" color="green" onPress={addSet} />
          </View>
          <View style={{ ...styles.btn, ...styles.btnRight }}>
            <Button
              title="Finish exercise"
              color="orange"
              onPress={endExercise}
            />
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  list: { paddingBottom: 36 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: {
    position: "absolute",
    bottom: 0,
    width: Dimensions.get("window").width / 2,
  },
  btnLeft: { left: 0 },
  btnRight: { right: 0 },
});

export default Exercise;
