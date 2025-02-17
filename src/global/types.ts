import { Feels, Muscles, Sides } from "./constants";

export interface SessionProps {
  id: string;
  title?: string;
  exercises?: ExerciseProps[];
  comment?: string;
}

export interface ExerciseProps {
  id: string;
  title: string;
  sets?: SetProps[];
  comment?: string;
}

export interface SetProps {
  id: string;
  start?: Date;
  end?: Date;
  weight?: number;
  reps?: number;
  feels?: Feels;
  comment?: string;
  side?: Sides;
}

export interface ExerciseDataProps {
  loadingDistribution: Record<Muscles, number>;
  unilateral?: boolean;
  bodyWeightRate?: number;
}
