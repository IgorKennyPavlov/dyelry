export const SESSIONS = "sessions";

export const enum Feels {
  LikeNothing = 1,
  Easy,
  Ok,
  Hard,
  Failed,
}

export const FeelsReadable = new Map<Feels, string>([
  [1, "Like nothing"],
  [2, "Easy"],
  [3, "Ok"],
  [4, "Hard"],
  [5, "Failed"],
]);

export const FeelsColors = new Map<Feels, string>([
  [1, "gray"],
  [2, "lightgreen"],
  [3, "green"],
  [4, "orange"],
  [5, "red"],
]);

export const PAGE_SIZE = 5;
