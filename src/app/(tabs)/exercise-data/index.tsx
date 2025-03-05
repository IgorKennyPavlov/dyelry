import { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import {
  ExerciseDataListItem,
  ExerciseDataListItemProps,
} from "../../../components";
import { useAllSessionData } from "../../../global/hooks/useAllSessionData";
import { listItemCommonStyles, getUniqueExerciseTitles } from "../../../global";
import { useTranslation } from "react-i18next";
import { EXERCISE_DATA } from "../../../store/keys";
import { useExerciseDataStore } from "../../../store";

const ExerciseData = () => {
  const { t } = useTranslation();
  const allSessions = useAllSessionData();
  const { [EXERCISE_DATA]: exercises } = useExerciseDataStore();

  const uniqueExerciseTitles = useMemo(() => {
    return getUniqueExerciseTitles(allSessions)
      .map((title) => ({ title, isDescribed: !!exercises[title] }))
      .sort((a, b) => {
        const notDescribed = Number(a.isDescribed) - Number(b.isDescribed);
        if (notDescribed) return notDescribed;
        return a.title < b.title ? -1 : 1;
      });
  }, [allSessions, exercises]);

  return (
    <View style={styles.constructorWrap}>
      {uniqueExerciseTitles?.length ? (
        <View style={styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "75%" }}>
              {t("list.exerciseData.title").toUpperCase()}
            </Text>
            <Text style={{ width: "25%", textAlign: "right" }}>
              {t("list.exerciseData.description").toUpperCase()}
            </Text>
          </View>

          <FlatList
            data={uniqueExerciseTitles}
            renderItem={(
              props: ListRenderItemInfo<ExerciseDataListItemProps>,
            ) => <ExerciseDataListItem {...props} />}
          />
        </View>
      ) : (
        <View style={styles.emptyList}>
          <Text>No sessions recorded</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  constructorWrap: { flex: 1 },
  list: { paddingBottom: 40 },
  emptyList: { height: 200, justifyContent: "center", alignItems: "center" },
});

export default ExerciseData;
