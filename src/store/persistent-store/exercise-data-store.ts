import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware/persist";

import { fileSystemStorage } from "./file-system";
import type { ExerciseDataProps } from "../../global/types";
import { EXERCISE_DATA } from "../keys";

interface ExerciseDataStore {
  [EXERCISE_DATA]: Record<string, ExerciseDataProps>;
  addExerciseData: (title: string, data: ExerciseDataProps) => void;
  editExerciseData: (
    title: string,
    editedExerciseData: Partial<ExerciseDataProps>,
  ) => void;
  deleteExerciseData: (title: string) => void;
  clearExerciseData: () => void;
}

export const useExerciseDataStore = create<ExerciseDataStore>()(
  persist(
    (set) => ({
      [EXERCISE_DATA]: {} as Record<string, ExerciseDataProps>,
      addExerciseData: (title: string, data: ExerciseDataProps) =>
        set(
          produce((state: ExerciseDataStore) => {
            state[EXERCISE_DATA][title] = data;
          }),
        ),
      editExerciseData: (
        title: string,
        editedExerciseData: Partial<ExerciseDataProps>,
      ) =>
        set(
          produce((state: ExerciseDataStore) => {
            const sessions = state[EXERCISE_DATA];
            if (!sessions[title]) return;
            Object.assign(sessions[title], editedExerciseData);
          }),
        ),
      deleteExerciseData: (title: string) =>
        set(
          produce((state: ExerciseDataStore) => {
            delete state[EXERCISE_DATA][title];
          }),
        ),
      clearExerciseData: () =>
        set(
          produce((state: ExerciseDataStore) => {
            state[EXERCISE_DATA] = {};
          }),
        ),
    }),
    {
      name: EXERCISE_DATA,
      storage: createJSONStorage(() => fileSystemStorage as StateStorage),
      merge: (persisted, current) => {
        return {
          ...current,
          ...persisted,
          [EXERCISE_DATA]: persisted[EXERCISE_DATA] || {},
        };
      },
    },
  ),
);
