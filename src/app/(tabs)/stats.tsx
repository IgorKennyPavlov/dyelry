import { useMemo, useCallback } from "react";
import { Text, StyleSheet, View, FlatList } from "react-native";

import { StatsListItem } from "../../components";
import {
  MusclesReadable,
  getSessionInterval,
  Sides,
  listItemCommonStyles,
} from "../../global";
import type {
  ExerciseProps,
  ExerciseDataProps,
  SetProps,
} from "../../global/types";
import { useSessionsStore, useExerciseDataStore } from "../../store";
import { SESSIONS, EXERCISE_DATA } from "../../store/keys";
import { useTranslation } from "react-i18next";

const Stats = () => {
  const { t } = useTranslation();
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { [EXERCISE_DATA]: describedExercises } = useExerciseDataStore();

  const lastWeekExercises = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const lastWeekSessions = sessions.filter((s) => {
      const [start] = getSessionInterval(s);
      return start && start >= weekAgo;
    });

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

  const getRawWeight = (sets?: SetProps[]) => {
    if (!sets) return 0;
    return sets.reduce((a, c) => a + (c.weight || 0) * (c.reps || 0), 0);
  };

  const getTotalWeight = (rawWeight: number, bodyWeightRate = 100) => {
    return Math.round((rawWeight / 100) * (bodyWeightRate || 100));
  };

  // TODO PAVLOV calculation is NOT optimal and NOT readable. Needs refactoring.
  const getStatItems = useCallback(() => {
    if (!lastWeekExercises?.length) {
      return [];
    }

    const describedLastWeek = lastWeekExercises
      .filter((e) => describedExercises[e.title])
      .map(({ title, sets }) => {
        const data: ExerciseDataProps = describedExercises[title];
        const { loadingDistribution, bodyWeightRate } = data;

        const setsAmount = sets?.length || 0;

        const leftSideSets =
          sets?.filter((s) => !s.side || +s.side === Sides.Left) || [];

        const rightSideSets =
          sets?.filter((s) => !s.side || +s.side === Sides.Right) || [];

        const rawWeightLeft = getRawWeight(leftSideSets);
        const rawWeightRight = getRawWeight(rightSideSets);

        const totalWeightLeft = getTotalWeight(rawWeightLeft, bodyWeightRate);
        const totalWeightRight = getTotalWeight(rawWeightRight, bodyWeightRate);

        const loadEntries = Object.entries(loadingDistribution);
        return loadEntries.map(([muscle, rate]) => {
          return {
            muscle,
            setsAmount,
            weight: [
              Math.round((totalWeightLeft / 100) * (rate || 0)),
              Math.round((totalWeightRight / 100) * (rate || 0)),
            ],
          };
        });
      })
      .flat();

    return Array.from(MusclesReadable.entries())
      .map(([title, translationKey]) => {
        const lastWeekMuscleData = describedLastWeek.filter(
          ({ muscle }) => title === +muscle,
        );

        const sets = lastWeekMuscleData.reduce(
          (acc, { setsAmount: s }) => acc + s,
          0,
        );
        const [left, right] = lastWeekMuscleData.reduce(
          ([al, ar], { weight: [l, r] }) => [al + l, ar + r],
          [0, 0],
        );
        return {
          title: t(translationKey),
          sets,
          weight: [left, right],
        };
      })
      .filter((muscle) => muscle.sets);
  }, [t, describedExercises, lastWeekExercises]);

  return (
    <View style={styles.statsWrap}>
      {showStats ? (
        <View>
          <View style={listItemCommonStyles.header}>
            <Text style={{ width: "50%" }}>
              {t("list.stats.title").toUpperCase()}
            </Text>
            <Text style={{ width: "25%" }}>
              {t("list.stats.setsPerWeek").toUpperCase()}
            </Text>
            <Text style={{ width: "25%" }}>
              {t("list.stats.kgPerWeek").toUpperCase()}
            </Text>
          </View>
          <FlatList
            data={getStatItems()}
            renderItem={(props) => <StatsListItem {...props} />}
          />
        </View>
      ) : (
        <View style={styles.emptyStats}>
          <Text>{t("list.stats.empty.title")}</Text>
          <Text>{t("list.stats.empty.text")}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statsWrap: { flex: 1, marginBottom: 40 },
  emptyStats: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
});

export default Stats;
