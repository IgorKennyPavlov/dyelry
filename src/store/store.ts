import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { fileSystemStorage } from "./file-system";
import { SessionProps, ExerciseProps, SetProps } from "../global";

interface SessionsStore {
  sessions: SessionProps[];
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
  clearStore: () => void;
}

export const useStore = create<SessionsStore>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (newSession: SessionProps) =>
        set(
          produce((state: SessionsStore) => {
            state.sessions.push(newSession);
          }),
        ),
      editSession: (sessionId: string, editedSession: SessionProps) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state.sessions;
            const session = sessions.find((s) => s.id === sessionId);

            Object.assign(session, editedSession);
          }),
        ),
      addExercise: (sessionId: string, newExercise: ExerciseProps) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state.sessions;
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
            const sessions = state.sessions;
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session.exercises.find((e) => e.id === exerciseId);

            Object.assign(exercise, editedExercise);
          }),
        ),
      addSet: (sessionId: string, exerciseId: string, newSet: SetProps) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state.sessions;
            const session = sessions.find((s) => s.id === sessionId);
            const exercise = session.exercises.find((e) => e.id === exerciseId);

            if (!exercise.sets) {
              exercise.sets = [];
            }

            exercise.sets.push(newSet);
          }),
        ),
      clearStore: () =>
        set(
          produce((state: SessionsStore) => {
            state.sessions = [];
          }),
        ),
    }),
    {
      name: "sessions",
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
