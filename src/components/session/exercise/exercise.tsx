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

import { getExerciseInterval, listItemCommonStyles } from "../../../global";
import type { SetProps } from "../../../global/types";
import { useSessionsStore, useTemplatesStore } from "../../../store";
import { uuid } from "expo-modules-core";
import { SetListItem } from "./set";
import { TEMPLATES, SESSIONS } from "../../../store/keys";
import { useTranslation } from "react-i18next";

interface ExerciseViewProps {
  isTemplate?: boolean;
}

export const Exercise = ({ isTemplate }: ExerciseViewProps) => {
  const params = useLocalSearchParams<{
    sessionID: string;
    exerciseID: string;
  }>();
  const { sessionID, exerciseID } = params;
  const { t } = useTranslation();

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
          title: (isTemplate ? "*" : "") + targetExercise?.title,
        }}
      />

      {targetExercise?.sets?.length ? (
        <View style={{ paddingBottom: listOffset }}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "15%" }}>
              {t("list.set.weight").toUpperCase()}
            </Text>
            <Text style={{ width: "15%" }}>
              {t("list.set.reps").toUpperCase()}
            </Text>
            <Text style={{ width: "20%" }}>
              {t("list.set.duration").toUpperCase()}
            </Text>
            <Text style={{ width: "30%" }}>
              {t("list.set.feels").toUpperCase()}
            </Text>
            <Text style={{ width: "20%" }}>
              {t("list.set.rest").toUpperCase()}
            </Text>
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
          <Text>{t("list.set.empty.title")}</Text>
        </View>
      )}

      {showAddBtn && (
        <View style={styles.btn}>
          <Button
            title={t("action.addSet")}
            color="green"
            onPress={createSet}
          />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});
