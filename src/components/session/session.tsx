import { Stack, useLocalSearchParams, router, Tabs } from "expo-router";
import { useMemo, useCallback } from "react";
import {
  Text,
  View,
  Button,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";

import { getSessionTitle, listItemCommonStyles } from "../../global";
import type { ExerciseProps } from "../../global/types";
import { useSessionsStore, useTemplatesStore } from "../../store";
import { ExerciseListItem } from "./exercise";
import { TEMPLATES, SESSIONS } from "../../store/keys";
import { useTranslation } from "react-i18next";

interface SessionViewProps {
  isTemplate?: boolean;
}

export const Session = ({ isTemplate }: SessionViewProps) => {
  const { t } = useTranslation();
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
    router.push({
      pathname: `/${isTemplate ? "template" : "session"}/[sessionID]/editor`,
      params: { sessionID },
    });
  }, [sessionID]);

  const title = useMemo(
    () => getSessionTitle(targetSession, isTemplate),
    [t, targetSession],
  );

  return (
    <>
      <Tabs.Screen options={{ title, headerShown: true }} />

      {targetSession?.exercises?.length ? (
        <View style={{ paddingBottom: 76 }}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "40%" }}>
              {t("list.exercise.title").toUpperCase()}
            </Text>
            <Text style={{ width: "30%" }}>
              {t("list.exercise.duration").toUpperCase()}
            </Text>
            <Text style={{ width: "20%" }}>
              {t("list.exercise.kgPerMin").toUpperCase()}
            </Text>
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
          <Text>{t("list.exercise.empty.title")}</Text>
        </View>
      )}

      <View style={styles.btn}>
        <Button
          title={t("action.addExercise")}
          color="green"
          onPress={addExercise}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
  btn: { position: "absolute", bottom: 0, width: "100%" },
});
