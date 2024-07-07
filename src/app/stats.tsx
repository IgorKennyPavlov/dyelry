import { useMemo, useCallback } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";

import { listItemCommonStyles, StatsListItem } from "../components";
import {
  SESSIONS,
  EXERCISE_DATA,
  MusclesReadable,
  ExerciseProps,
  Muscles,
} from "../global";
import { usePersistentStore } from "../store";
import { useExerciseDataStore } from "../store/persistent-store/exercise-data-store";

const Stats = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { [EXERCISE_DATA]: describedExercises } = useExerciseDataStore();

  const lastWeekExercises = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const lastWeekSessions = sessions.filter((s) => s.start >= weekAgo);

    const filteredExercises = lastWeekSessions
      ?.flatMap((s) => s.exercises)
      .filter((e) => e);

    return filteredExercises as ExerciseProps[] | undefined;
  }, [sessions]);

  const showStats = useMemo(() => {
    if (!lastWeekExercises) {
      return false;
    }

    if (!Object.keys(describedExercises).length) {
      return false;
    }

    return lastWeekExercises.some((e) => describedExercises[e.title]);
  }, [describedExercises, lastWeekExercises]);

  // TODO PAVLOV calculation is not optimal. Needs refactoring.
  // TODO PAVLOV add unilateral exercise calculations
  const getStatItems = useCallback(() => {
    if (!lastWeekExercises?.length) {
      return;
    }

    const describedLastWeek = lastWeekExercises
      .filter((e) => describedExercises[e.title])
      .map(({ title, sets }) => {
        const data = describedExercises[title];
        const { loadingDistribution, bodyWeightRate } = data;

        const setsAmount = sets?.length || 0;
        const rawWeight =
          sets?.reduce((a, c) => a + (c.weight || 0) * (c.reps || 0), 0) || 0;

        const totalWeight = Math.round(
          (rawWeight / 100) * (bodyWeightRate || 100),
        );

        const loadEntries = Object.entries(loadingDistribution);
        return loadEntries.map(([muscle, rate]) => {
          return [
            muscle,
            [setsAmount, Math.round((totalWeight / 100) * (rate || 0))],
          ] as unknown as [Muscles, [number, number]];
        });
      })
      .flat();

    return Array.from(MusclesReadable.entries())
      .map(([title, readableTitle]) => {
        const lastWeekMuscleData = describedLastWeek
          .filter(([muscle]) => title === +muscle)
          .map(([, data]) => data);

        const sets = lastWeekMuscleData.reduce((acc, [s]) => acc + s, 0);
        const weight = lastWeekMuscleData.reduce((acc, [, w]) => acc + w, 0);
        return { title: readableTitle, sets, weight };
      })
      .filter((muscle) => muscle.sets);
  }, [describedExercises, lastWeekExercises]);

  return (
    <View style={styles.statsWrap}>
      {showStats ? (
        <View>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "50%" }}>Title</Text>
            <Text style={{ width: "25%" }}>Sets / Week</Text>
            <Text style={{ width: "25%" }}>Kg / Week</Text>
          </View>
          <FlatList
            data={getStatItems()}
            renderItem={(props) => <StatsListItem {...props} />}
          />
        </View>
      ) : (
        <View style={styles.emptyStats}>
          <Text>No stats available.</Text>
          <Text>
            Record some training sessions and describe the exercises with
            exercise constructor.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsWrap: { flex: 1 },
  emptyStats: { height: 200, justifyContent: "center", alignItems: "center" },
});

export default Stats;
