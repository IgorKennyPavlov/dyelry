import { SessionProps } from "./types";

export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);

export const getWeek = (sessions: SessionProps[], monday: Date) => {
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);
  return sessions.filter((s) => s.start > monday && s.start < sunday);
};
