export const enum Feels {
  LikeNothing = 1,
  Easy,
  Ok,
  Hard,
  Failed,
}

export const FeelsReadable = new Map<Feels, string>([
  [Feels.LikeNothing, "enums.feels.likeNothing"],
  [Feels.Easy, "enums.feels.easy"],
  [Feels.Ok, "enums.feels.ok"],
  [Feels.Hard, "enums.feels.hard"],
  [Feels.Failed, "enums.feels.failed"],
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
  Abs,
  Obliques,
  UpperTraps,
  LowerTraps,
  Lats,
  Erectors,
  Quads,
  Hams,
  Glutes,
  Abductors,
  Adductors,
  Calves,
}

export const MusclesReadable = new Map<Muscles, string>([
  [Muscles.Pecs, "enums.muscles.pecs"],
  [Muscles.FrontDelts, "enums.muscles.frontDelts"],
  [Muscles.SideDelts, "enums.muscles.sideDelts"],
  [Muscles.RearDelts, "enums.muscles.rearDelts"],
  [Muscles.Bis, "enums.muscles.bis"],
  [Muscles.Tris, "enums.muscles.tris"],
  [Muscles.Forearms, "enums.muscles.forearms"],
  [Muscles.Abs, "enums.muscles.abs"],
  [Muscles.Obliques, "enums.muscles.obliques"],
  [Muscles.UpperTraps, "enums.muscles.upperTraps"],
  [Muscles.LowerTraps, "enums.muscles.lowerTraps"],
  [Muscles.Lats, "enums.muscles.lats"],
  [Muscles.Erectors, "enums.muscles.erectors"],
  [Muscles.Quads, "enums.muscles.quads"],
  [Muscles.Hams, "enums.muscles.hams"],
  [Muscles.Glutes, "enums.muscles.glutes"],
  [Muscles.Abductors, "enums.muscles.abductors"],
  [Muscles.Adductors, "enums.muscles.adductors"],
  [Muscles.Calves, "enums.muscles.calves"],
]);

export const enum Sides {
  Left,
  Right,
}

export const SidesReadable = new Map<Sides, string>([
  [Sides.Left, "enums.sides.left"],
  [Sides.Right, "enums.sides.right"],
]);
