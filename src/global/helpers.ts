import { PAGE_SIZE } from "./constants";

export const getIntervalSeconds = (from: Date, to: Date) =>
  Math.floor((from.valueOf() - to.valueOf()) / 1000);

export const getPage = <T>(list: T[], pageNumber = 0, pageSize = PAGE_SIZE) => {
  const start = pageNumber * pageSize;
  const end = start + pageSize;
  return list.slice(start, end);
};
