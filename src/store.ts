import { create } from "zustand";
import { SessionProps, ExerciseProps, SetProps } from "./app/types";
import { produce } from "immer";

interface SessionsStore {
  sessions: SessionProps[];
  addSession: (newSession: SessionProps) => void;
  addExercise: (sessionId: string, newExercise: ExerciseProps) => void;
  addSet: (sessionId: string, exerciseId: string, newSet: SetProps) => void;
}

export const useStore = create<SessionsStore>()((set) => ({
  sessions: [],
  addSession: (newSession: SessionProps) =>
    set(
      produce((state: SessionsStore) => {
        state.sessions.push(newSession);
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
}));
