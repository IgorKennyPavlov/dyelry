export const SESSIONS = "sessions";
export const EXERCISE_DATA = "exerciseData";

export const enum Feels {
  LikeNothing = 1,
  Easy,
  Ok,
  Hard,
  Failed,
}

export const FeelsReadable = new Map<Feels, string>([
  [Feels.LikeNothing, "Like nothing"],
  [Feels.Easy, "Easy"],
  [Feels.Ok, "Ok"],
  [Feels.Hard, "Hard"],
  [Feels.Failed, "Failed"],
]);

export const FeelsColors = new Map<Feels, string>([
  [Feels.LikeNothing, "gray"],
  [Feels.Easy, "lightgreen"],
  [Feels.Ok, "green"],
  [Feels.Hard, "orange"],
  [Feels.Failed, "red"],
]);

export const enum Muscles {
  Pecs,
  FrontDelts,
  SideDelts,
  RearDelts,
  Bis,
  Tris,
  Forearms,
  Core,
  Traps,
  Lats,
  Erectors,
  Quads,
  Hams,
  Glutes,
  Calves,
}

export const MusclesReadable = new Map<Muscles, string>([
  [Muscles.Pecs, "Pecs"],
  [Muscles.FrontDelts, "Front Delts"],
  [Muscles.SideDelts, "Side Delts"],
  [Muscles.RearDelts, "Rear Delts"],
  [Muscles.Bis, "Bis"],
  [Muscles.Tris, "Tris"],
  [Muscles.Forearms, "Forearms"],
  [Muscles.Core, "Core"],
  [Muscles.Traps, "Traps"],
  [Muscles.Lats, "Lats"],
  [Muscles.Erectors, "Erectors"],
  [Muscles.Quads, "Quads"],
  [Muscles.Hams, "Hams"],
  [Muscles.Glutes, "Glutes"],
  [Muscles.Calves, "Calves"],
]);
