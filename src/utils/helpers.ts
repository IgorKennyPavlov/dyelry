export const queryfy = (
  obj: Record<string, string | number | boolean | null | undefined>,
) =>
  Object.entries(obj)
    .map((entry) => entry.join("="))
    .join("&");

export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);
