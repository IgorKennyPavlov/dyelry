import type { SessionProps, ExerciseProps } from "./types";
import { t } from "i18next";

type Interval = [Date | undefined, Date | undefined];

export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);

export const reduceSeconds = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days) {
    return `${days}d ${hours % 24}h`;
  }

  if (hours) {
    return `${hours}h ${minutes % 60}m`;
  }

  if (minutes) {
    return `${minutes}m ${seconds % 60}s`;
  }

  return `${seconds}s`;
};

export const getExerciseInterval = (e?: ExerciseProps): Interval => {
  if (!e?.sets?.length) return [undefined, undefined];
  const [first] = e.sets;
  return [first.start, e.sets.at(-1)?.end];
};

export const getSessionInterval = (s?: SessionProps): Interval => {
  if (!s?.exercises?.length) return [undefined, undefined];
  const [first] = s.exercises;
  const [start] = getExerciseInterval(first);
  const [, end] = getExerciseInterval(s.exercises.at(-1));
  return [start, end];
};

export const getSessionTitle = (
  targetSession?: SessionProps,
  isTemplate?: boolean,
) => {
  let res: string;

  if (isTemplate) {
    res = targetSession ? t("header.template") : t("header.newTemplate");
  } else {
    res = targetSession ? t("header.session") : t("header.newSession");
  }

  if (!targetSession) {
    return res;
  }

  const [start] = getSessionInterval(targetSession);

  if (start) {
    res += ` ${start.toLocaleDateString("ru-RU")}`;
  }

  if (targetSession.title) {
    res += ` (${targetSession.title})`;
  }

  return res;
};
