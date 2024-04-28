import { useMemo } from "react";

import { useSessionsStore } from "./store";
import { useTargetStore } from "./targetStore";
import { SESSIONS, SessionProps, ExerciseProps, SetProps } from "../global";

export const useTarget = () => {
  const { [SESSIONS]: sessions } = useSessionsStore();
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
