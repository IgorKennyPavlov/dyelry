import { uuid } from "expo-modules-core";
import { Stack } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

import { ExerciseListItem, listItemCommonStyles } from "../../components";
import {
  useNavigate,
  getSessionTitle,
  getSessionInterval,
  getExerciseInterval,
} from "../../global";
import type { ExerciseProps } from "../../global/types";
import { useTargetStore, useTargetSelectors } from "../../store";

const Session = () => {
  const { navigate } = useNavigate();
  const { setTargetExerciseId } = useTargetStore();

  const { targetSession } = useTargetSelectors();

  const addExercise = useCallback(() => {
    setTargetExerciseId(uuid.v4());
    navigate(`/exercise-editor`);
  }, [navigate, setTargetExerciseId]);

  const title = useMemo(() => getSessionTitle(targetSession), [targetSession]);

  const getListOffset = useCallback(
    () => (getSessionInterval(targetSession)[1] ? 76 : 40),
    [],
  );

  return (
    <>
      <Stack.Screen options={{ title }} />

      {targetSession?.exercises?.length ? (
        <View style={{ paddingBottom: getListOffset() }}>
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

      <View style={styles.btn}>
        <Button title="Add exercise" color="green" onPress={addExercise} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});

export default Session;
