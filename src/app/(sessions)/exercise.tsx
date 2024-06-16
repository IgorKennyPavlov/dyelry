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

import { SetListItem, listItemCommonStyles } from "../../components";
import { useNavigate, SetProps } from "../../global";
import { usePersistentStore, useTargetStore, useTarget } from "../../store";

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
    navigate("/timer");
  }, [navigate, setTargetSetId]);

  const endExercise = useCallback(() => {
    if (!targetSessionId || !targetExerciseId) return;

    editExercise(targetSessionId, targetExerciseId, { end: new Date() });
    navigate("/session");
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
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "15%" }}>Weight</Text>
            <Text style={{ width: "15%" }}>Reps</Text>
            <Text style={{ width: "20%" }}>Duration</Text>
            <Text style={{ width: "30%" }}>Feels</Text>
            <Text style={{ width: "20%" }}>Rest</Text>
          </View>

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

export default Exercise;
