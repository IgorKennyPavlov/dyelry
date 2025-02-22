import { Stack, useLocalSearchParams, router } from "expo-router";
import { useCallback, useMemo } from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Button,
  ListRenderItemInfo,
} from "react-native";

import { SetListItem, listItemCommonStyles } from "./list-items";
import { getExerciseInterval, SESSIONS, TEMPLATES } from "../global";
import type { SetProps } from "../global/types";
import { useSessionsStore, useTemplatesStore } from "../store";
import { uuid } from "expo-modules-core";

interface ExerciseViewProps {
  isTemplate?: boolean;
}

export const Exercise = ({ isTemplate }: ExerciseViewProps) => {
  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID: string;
  }>();
  const { sessionID, exerciseID } = params;

  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;

  const { [storeKey]: sessions, addSet } = useStore();

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const targetExercise = useMemo(
    () => targetSession?.exercises.find((e) => e.id === exerciseID),
    [targetSession, exerciseID],
  );

  const createSet = useCallback(() => {
    if (!isTemplate) {
      router.push({
        pathname: `/session/[sessionID]/exercise/[exerciseID]/set/timer`,
        params: { sessionID, exerciseID },
      });
      return;
    }

    const id = uuid.v4();
    addSet(sessionID, exerciseID, { id });
    router.push({
      pathname: `/template/[sessionID]/exercise/[exerciseID]/set/[setID]`,
      params: { sessionID, exerciseID, setID: id },
    });
  }, []);

  const showAddBtn = useMemo(
    () =>
      isTemplate ||
      !targetExercise?.sets?.length ||
      !!getExerciseInterval(targetExercise)[1],
    [targetExercise, isTemplate],
  );

  const listOffset = useMemo(() => (showAddBtn ? 76 : 40), [showAddBtn]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: (isTemplate ? "(T)" : "") + targetExercise?.title,
        }}
      />

      {targetExercise?.sets?.length ? (
        <View style={{ paddingBottom: listOffset }}>
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
              <SetListItem
                sessionID={sessionID}
                exerciseID={exerciseID}
                isTemplate={isTemplate}
                {...props}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sets recorded</Text>
        </View>
      )}

      {showAddBtn && (
        <View style={styles.btn}>
          <Button title="Add set" color="green" onPress={createSet} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});
