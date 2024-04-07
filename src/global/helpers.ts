export const querify = (
  obj: string[][] | Record<string, string> | string | URLSearchParams,
) => new URLSearchParams(obj).toString();

export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);
