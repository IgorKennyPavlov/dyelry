import { useRouter, Stack } from "expo-router";
import { useMemo } from "react";
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
import { SESSIONS } from "../../../global";
import { useSessionsStore, useTargetStore } from "../../../store";

const Exercise = () => {
  const router = useRouter();
  const { [SESSIONS]: sessions, editExercise } = useSessionsStore();
  const { targetSessionId, targetExerciseId, setTargetSetId } =
    useTargetStore();

  const targetExercise = useMemo(
    () =>
      sessions
        .find((s) => s.id === targetSessionId)
        .exercises.find((e) => e.id === targetExerciseId),
    [sessions, targetExerciseId, targetSessionId],
  );

  const showActionPanel = useMemo(() => {
    const { end, sets } = targetExercise;

    if (end) {
      return false;
    }

    return !sets || sets.every((s) => s.end);
  }, [targetExercise]);

  const renderItem = (props: ListRenderItemInfo<string>) => (
    <SetListItem {...props} />
  );

  const addSet = () => {
    setTargetSetId(null);
    router.push("/session/exercise/exercise-set/timer");
  };

  const endExercise = () => {
    editExercise(targetSessionId, targetExerciseId, { end: new Date() });
    router.push("/session/view");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: targetExercise.title,
        }}
      />
      {targetExercise.sets?.length ? (
        <View style={targetExercise.end ? {} : styles.list}>
          <FlatList
            data={targetExercise.sets.map((s) => s.id)}
            renderItem={renderItem}
          />
        </View>
      ) : (
        <View style={styles.emptyListMsgWrap}>
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
  emptyListMsgWrap: {
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

export default Exercise;
