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
