export const browserAPI: typeof chrome = (
  typeof browser === "undefined" ? chrome : browser
) as typeof chrome;
