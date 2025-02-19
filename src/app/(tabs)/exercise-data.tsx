import { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import { listItemCommonStyles, ExerciseDataListItem } from "../../components";
import { SESSIONS, TEMPLATES } from "../../global";
import { useSessionsStore, useTemplatesStore } from "../../store";

const ExerciseData = () => {
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { [TEMPLATES]: templates } = useTemplatesStore();

  const uniqueExerciseTitles = useMemo(() => {
    const exerciseTitles = [...sessions, ...templates]
      .flatMap((s) => s.exercises || [])
      .map((e) => e.title)
      .sort();
    return [...new Set(exerciseTitles)];
  }, [sessions]);

  return (
    <View style={styles.constructorWrap}>
      {uniqueExerciseTitles?.length ? (
        <View style={styles.list}>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "80%" }}>Title</Text>
            <Text style={{ width: "20%" }}>Data</Text>
          </View>

          <FlatList
            data={uniqueExerciseTitles}
            renderItem={(props: ListRenderItemInfo<string>) => (
              <ExerciseDataListItem {...props} />
            )}
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
