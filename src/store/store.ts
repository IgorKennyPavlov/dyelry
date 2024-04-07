import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { fileSystemStorage } from "./file-system";
import { SessionProps, ExerciseProps, SetProps, SESSIONS } from "../global";

interface SessionsStore {
  [SESSIONS]: SessionProps[];
  addSession: (newSession: SessionProps) => void;
  editSession: (
    sessionId: string,
    editedSession: Partial<SessionProps>,
  ) => void;
  addExercise: (sessionId: string, newExercise: ExerciseProps) => void;
  editExercise: (
    sessionId: string,
    exerciseId: string,
    editedExercise: Partial<ExerciseProps>,
  ) => void;
  addSet: (sessionId: string, exerciseId: string, newSet: SetProps) => void;
  editSet: (
    sessionId: string,
    exerciseId: string,
    setId: string,
    updatedSet: Partial<SetProps>,
  ) => void;
  clearStore: () => void;
}

export const useStore = create<SessionsStore>()(
  persist(
    (set) => ({
      [SESSIONS]: [],
      addSession: (newSession: SessionProps) =>
        set(
          produce((state: SessionsStore) => {
            state[SESSIONS].push(newSession);
          }),
        ),
      editSession: (sessionId: string, editedSession: SessionProps) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);

            Object.assign(session, editedSession);
          }),
        ),
      addExercise: (sessionId: string, newExercise: ExerciseProps) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session.exercises) {
              session.exercises = [];
            }

            session.exercises.push(newExercise);
          }),
        ),
      editExercise: (
        sessionId: string,
        exerciseId: string,
        editedExercise: Partial<ExerciseProps>,
      ) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session.exercises.find((e) => e.id === exerciseId);

            Object.assign(exercise, editedExercise);
          }),
        ),
      addSet: (sessionId: string, exerciseId: string, newSet: SetProps) =>
        set(
          produce((state: SessionsStore) => {
            // TODO duplicate. How to make getters?
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session.exercises.find((e) => e.id === exerciseId);

            if (!exercise.sets) {
              exercise.sets = [];
            }

            exercise.sets.push(newSet);
          }),
        ),
      editSet: (
        sessionId: string,
        exerciseId: string,
        setId: string,
        updatedSet: Partial<SetProps>,
      ) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[SESSIONS];
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session.exercises.find((e) => e.id === exerciseId);
            const targetSet = exercise.sets.find((s) => s.id === setId);
            Object.assign(targetSet, updatedSet);
          }),
        ),
      clearStore: () =>
        set(
          produce((state: SessionsStore) => {
            state[SESSIONS] = [];
          }),
        ),
    }),
    {
      name: SESSIONS,
      storage: createJSONStorage(() => fileSystemStorage, {
        reviver: (key, value) => {
          if (
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
          // TODO does this stuff stringifies data by default so there is no need to stringify it again in file-system.ts?
          // TODO check!
          // { revivingType: "data", value: value.toISOString() }
          if (["start", "end"].includes(key)) {
            return { revivingType: "data", value };
          }
          return value;
        },
      }),
    },
  ),
);
