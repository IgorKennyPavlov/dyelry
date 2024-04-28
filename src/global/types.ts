import { Feels } from "./constants";

export interface SessionProps {
  id: string;
  start: Date;
  end?: Date;
  title?: string;
  exercises?: ExerciseProps[];
  comment?: string;
}

export interface ExerciseProps {
  id: string;
  title: string;
  start: Date;
  end?: Date;
  sets?: SetProps[];
  comment?: string;
}

export interface SetProps {
  id: string;
  start: Date;
  end?: Date;
  weight?: number;
  reps?: number;
  feels?: Feels;
  rest?: number;
  comment?: string;
}
