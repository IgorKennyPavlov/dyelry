import { produce } from "immer";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { StateStorage } from "zustand/middleware/persist";

import {
  fileSystemStorage,
  importStoreAsync,
  exportStoreAsync,
} from "./file-system";
import type { ExerciseDataProps } from "../../global";
import { EXERCISE_DATA } from "../../global";

interface SessionsStore {
  [EXERCISE_DATA]: Record<string, ExerciseDataProps>;
  addExerciseData: (title: string, data: ExerciseDataProps) => void;
  editExerciseData: (
    title: string,
    editedExerciseData: Partial<ExerciseDataProps>,
  ) => void;
  deleteExerciseData: (title: string) => void;
  clearExerciseData: () => void;
  importExerciseData: () => Promise<void>;
  exportExerciseData: () => Promise<void>;
}

export const useExerciseDataStore = create<SessionsStore>()(
  persist(
    (set) => ({
      [EXERCISE_DATA]: {} as Record<string, ExerciseDataProps>,
      addExerciseData: (title: string, data: ExerciseDataProps) =>
        set(
          produce((state: SessionsStore) => {
            state[EXERCISE_DATA][title] = data;
          }),
        ),
      editExerciseData: (
        title: string,
        editedExerciseData: Partial<ExerciseDataProps>,
      ) =>
        set(
          produce((state: SessionsStore) => {
            const sessions = state[EXERCISE_DATA];
            if (!sessions[title]) return;
            Object.assign(sessions[title], editedExerciseData);
          }),
        ),
      deleteExerciseData: (title: string) =>
        set(
          produce((state: SessionsStore) => {
            delete state[EXERCISE_DATA][title];
          }),
        ),

      clearExerciseData: () =>
        set(
          produce((state: SessionsStore) => {
            state[EXERCISE_DATA] = {};
          }),
        ),
      importExerciseData: () => importStoreAsync(EXERCISE_DATA),
      exportExerciseData: () => exportStoreAsync(EXERCISE_DATA),
    }),
    {
      name: EXERCISE_DATA,
      storage: createJSONStorage(() => fileSystemStorage as StateStorage, {
        reviver: (key, value) => {
          return value;
        },
        replacer: (key, value) => {
          return value;
        },
      }),
    },
  ),
);
