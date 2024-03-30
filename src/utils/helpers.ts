export const queryfy = (
  obj: Record<string, string | number | boolean | null | undefined>,
) =>
  Object.entries(obj)
    .map((entry) => entry.join("="))
    .join("&");
