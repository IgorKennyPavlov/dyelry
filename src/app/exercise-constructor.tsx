import { useMemo } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  ListRenderItemInfo,
} from "react-native";

import { listItemCommonStyles } from "../components";
import { ExerciseConstructorListItem } from "../components/list-items/exercise-constructor-list-item";
import { SESSIONS } from "../global";
import { usePersistentStore } from "../store";

const ExerciseConstructor = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();

  const uniqueExerciseTitles = useMemo(() => {
    const exerciseTitles = sessions
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
              <ExerciseConstructorListItem {...props} />
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

export default ExerciseConstructor;
