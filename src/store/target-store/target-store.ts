import { produce } from "immer";
import { create } from "zustand";

interface TargetStore {
  targetSessionId: string | null;
  targetExerciseId: string | null;
  targetSetId: string | null;
  setTargetSessionId: (id: string | null) => void;
  setTargetExerciseId: (id: string | null) => void;
  setTargetSetId: (id: string | null) => void;
}

export const useTargetStore = create<TargetStore>()((set) => ({
  targetSessionId: null,
  targetExerciseId: null,
  targetSetId: null,
  setTargetSessionId: (id: string | null) =>
    set(
      produce((state: TargetStore) => {
        state.targetSessionId = id;
      }),
    ),
  setTargetExerciseId: (id: string | null) =>
    set(
      produce((state: TargetStore) => {
        state.targetExerciseId = id;
      }),
    ),
  setTargetSetId: (id: string | null) =>
    set(
      produce((state: TargetStore) => {
        state.targetSetId = id;
      }),
    ),
}));
