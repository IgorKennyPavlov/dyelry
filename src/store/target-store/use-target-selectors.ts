import { useMemo } from "react";

import { useTargetStore } from "./target-store";
import { SESSIONS } from "../../global";
import type { SessionProps, ExerciseProps, SetProps } from "../../global/types";
import { usePersistentStore } from "../persistent-store";

export const useTargetSelectors = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();
  const { targetSessionId, targetExerciseId, targetSetId } = useTargetStore();

  const targetSession: SessionProps | undefined = useMemo(
    () => sessions.find((s) => s.id === targetSessionId),
    [sessions, targetSessionId],
  );

  const targetExercise: ExerciseProps | undefined = useMemo(
    () => targetSession?.exercises?.find((e) => e.id === targetExerciseId),
    [targetSession?.exercises, targetExerciseId],
  );

  const targetSet: SetProps | undefined = useMemo(
    () => targetExercise?.sets?.find((s) => s.id === targetSetId),
    [targetExercise?.sets, targetSetId],
  );

  return { targetSession, targetExercise, targetSet };
};
