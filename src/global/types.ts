import { Feels } from "./constants";

export interface SessionProps {
  id: string;
  start: Date;
  end?: Date;
  exercises?: ExerciseProps[];
}

export interface ExerciseProps {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  sets?: SetProps[];
  rest?: number;
}

export interface SetProps {
  id: string;
  start: Date;
  end: Date;
  weight: number;
  reps: number;
  feels: Feels;
  rest: number;
  comment?: string;
}
