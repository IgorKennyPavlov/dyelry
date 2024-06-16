import { SessionProps } from "./types";

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

export const getSessionTitle = (targetSession?: SessionProps) => {
  let res = "Session";

  if (!targetSession) {
    return "New " + res;
  }

  if (targetSession.start) {
    res += ` ${targetSession.start.toLocaleDateString("ru-RU")}`;
  }

  if (targetSession.title) {
    res += ` (${targetSession.title})`;
  }

  return res;
};
