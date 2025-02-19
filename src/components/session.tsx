import { Stack, useLocalSearchParams, router } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

import { ExerciseListItem, listItemCommonStyles } from "./list-items";
import {
  getSessionTitle,
  getSessionInterval,
  SESSIONS,
  TEMPLATES,
} from "../global";
import type { ExerciseProps } from "../global/types";
import { useSessionsStore, useTemplatesStore } from "../store";

interface SessionViewProps {
  isTemplate?: boolean;
}

export const Session = ({ isTemplate }: SessionViewProps) => {
  const storeKey = isTemplate ? TEMPLATES : SESSIONS;
  const useStore = isTemplate ? useTemplatesStore : useSessionsStore;

  const { [storeKey]: sessions } = useStore();

  const params = useLocalSearchParams<{ sessionID: string }>();
  const { sessionID } = params;

  const targetSession = useMemo(
    () => sessions.find((s) => s.id === sessionID),
    [sessions, sessionID],
  );

  const addExercise = useCallback(() => {
    router.navigate({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/editor`,
      params: { sessionID },
    });
  }, [sessionID]);

  const title = useMemo(
    () => getSessionTitle(targetSession, isTemplate),
    [targetSession],
  );

  const listOffset = useMemo(
    () => (getSessionInterval(targetSession)[1] ? 76 : 40),
    [targetSession],
  );

  return (
    <>
      <Stack.Screen options={{ title }} />

      {targetSession?.exercises?.length ? (
        <View style={{ paddingBottom: listOffset }}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "40%" }}>Title</Text>
            <Text style={{ width: "30%" }}>Duration</Text>
            <Text style={{ width: "20%" }}>Kg/Min</Text>
            <Text style={{ width: "10%" }}>Edit</Text>
          </View>

          <FlatList
            data={targetSession.exercises}
            renderItem={(props: ListRenderItemInfo<ExerciseProps>) => (
              <ExerciseListItem
                sessionID={sessionID}
                isTemplate={isTemplate}
                {...props}
              />
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
