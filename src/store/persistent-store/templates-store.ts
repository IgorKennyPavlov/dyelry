// TODO PAVLOV 100% copy of sessions-store.ts, the code should be reused
import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { StateStorage } from "zustand/middleware/persist";

import { fileSystemStorage } from "./file-system";
import type { SessionProps, ExerciseProps, SetProps } from "../../global/types";
import { TEMPLATES } from "../keys";

interface TemplatesStore {
  [TEMPLATES]: SessionProps[];
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

export const useTemplatesStore = create<TemplatesStore>()(
  persist(
    (set) => ({
      [TEMPLATES]: [] as SessionProps[],
      addSession: (newSession) =>
        set(
          produce((state: TemplatesStore) => {
            state[TEMPLATES].push(newSession);
          }),
        ),
      editSession: (sessionId, editedSession) =>
        set(
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session) return;

            Object.assign(session, editedSession);
          }),
        ),
      deleteSession: (sessionId) =>
        set(
          produce((state: TemplatesStore) => {
            state[TEMPLATES] = state[TEMPLATES].filter(
              (s) => s.id !== sessionId,
            );
          }),
        ),
      addExercise: (sessionId, newExercise) =>
        set(
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
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
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
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
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
            const session = sessions.find((s) => s.id === sessionId);

            if (!session) return;

            session.exercises = session.exercises?.filter(
              (e) => e.id !== exerciseId,
            );
          }),
        ),
      addSet: (sessionId, exerciseId, newSet) =>
        set(
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
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
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
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
          produce((state: TemplatesStore) => {
            const sessions = state[TEMPLATES];
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
          produce((state: TemplatesStore) => {
            state[TEMPLATES] = [];
          }),
        ),
    }),
    {
      name: TEMPLATES,
      storage: createJSONStorage(() => fileSystemStorage as StateStorage),
      merge: (persisted, current) => {
        return {
          ...current,
          ...persisted,
          [TEMPLATES]: persisted[TEMPLATES] || [],
        };
      },
    },
  ),
);
