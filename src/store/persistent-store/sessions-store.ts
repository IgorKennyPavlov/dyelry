import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StateStorage } from "zustand/middleware/persist";

import { fileSystemStorage } from "./file-system";
import type { SessionProps, ExerciseProps, SetProps } from "../../global/types";
import { SESSIONS } from "../keys";

interface SessionsStore {
  [SESSIONS]: SessionProps[];
  addSession: (newSession: SessionProps) => void;
  editSession: (
    sessionId: string,
    editedSession: Partial<SessionProps>,
  ) => void;
  deleteSession: (sessionId: string) => void;
  addExercise: (sessionId: string, newExercise: ExerciseProps) => void;
  editExercise: (
    sessionId: string,
    exerciseId: string,
    editedExercise: Partial<ExerciseProps>,
  ) => void;
  deleteExercise: (sessionId: string, exerciseId: string) => void;
  addSet: (sessionId: string, exerciseId: string, newSet: SetProps) => void;
  editSet: (
    sessionId: string,
    exerciseId: string,
    setId: string,
    updatedSet: Partial<SetProps>,
  ) => void;
  deleteSet: (sessionId: string, exerciseId: string, setId: string) => void;
  clearSessions: () => void;
}

export const useSessionsStore = create<SessionsStore>()(
  persist(
    (set) => ({
      [SESSIONS]: [] as SessionProps[],
      addSession: (newSession) =>
        set(
          produce((state: SessionsStore) => {
            state[SESSIONS].push(newSession);
          }),
        ),
      editSession: (sessionId, editedSession) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session) return;

            Object.assign(session, editedSession);
          }),
        ),
      deleteSession: (sessionId) =>
        set(
          produce((state: SessionsStore) => {
            state[SESSIONS] = state[SESSIONS].filter((s) => s.id !== sessionId);
          }),
        ),
      addExercise: (sessionId, newExercise) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session) return;

            if (!session.exercises) {
              session.exercises = [];
            }

            session.exercises.push(newExercise);
          }),
        ),
      editExercise: (sessionId, exerciseId, editedExercise) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session?.exercises?.find(
              (e) => e.id === exerciseId,
            );

            if (!exercise) return;

            Object.assign(exercise, editedExercise);
          }),
        ),
      deleteExercise: (sessionId, exerciseId) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session) return;

            session.exercises = session.exercises?.filter(
              (e) => e.id !== exerciseId,
            );
          }),
        ),
      addSet: (sessionId, exerciseId, newSet) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session?.exercises?.find(
              (e) => e.id === exerciseId,
            );

            if (!exercise) return;

            if (!exercise.sets) {
              exercise.sets = [];
            }

            exercise.sets.push(newSet);
          }),
        ),
      editSet: (sessionId, exerciseId, setId, updatedSet) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session?.exercises?.find(
              (e) => e.id === exerciseId,
            );
            const targetSet = exercise?.sets?.find((s) => s.id === setId);

            if (!targetSet) return;

            Object.assign(targetSet, updatedSet);
          }),
        ),
      deleteSet: (sessionId, exerciseId, setId) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session?.exercises?.find(
              (e) => e.id === exerciseId,
            );

            if (!exercise) return;

            exercise.sets = exercise.sets?.filter((s) => s.id !== setId);
          }),
        ),
      clearSessions: () =>
        set(
          produce((state: SessionsStore) => {
            state[SESSIONS] = [];
          }),
        ),
    }),
    {
      name: SESSIONS,
      storage: createJSONStorage(() => fileSystemStorage as StateStorage, {
        reviver: (key, value) => {
          if (
            value &&
            typeof value === "object" &&
            "revivingType" in value &&
            "value" in value &&
            value.revivingType === "data"
          ) {
            return new Date(value.value as string);
          }
          return value;
        },
        replacer: (key, value) => {
          // TODO why value instanceof Date doesn't work?
          // if (value instanceof Date) {
          //   return { revivingType: "data", value: value.toISOString() };
          // }
          if (["start", "end"].includes(key)) {
            return { revivingType: "data", value };
          }

          return value;
        },
      }),
      merge: (persisted, current) => {
        return {
          ...current,
          ...persisted,
          [SESSIONS]: persisted[SESSIONS] || [],
        };
      },
    },
  ),
);
