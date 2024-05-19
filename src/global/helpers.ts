export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);
