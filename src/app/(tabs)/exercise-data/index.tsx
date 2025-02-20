import { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import {
  listItemCommonStyles,
  ExerciseDataListItem,
} from "../../../components";
import { useAllSessionData } from "../../../global/hooks/useAllSessionData";

const ExerciseData = () => {
  const allSessions = useAllSessionData();

  const uniqueExerciseTitles = useMemo(() => {
    const exerciseTitles = allSessions
      .flatMap((s) => s.exercises || [])
      .map((e) => e.title)
      .sort();
    return [...new Set(exerciseTitles)];
  }, [allSessions]);

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
