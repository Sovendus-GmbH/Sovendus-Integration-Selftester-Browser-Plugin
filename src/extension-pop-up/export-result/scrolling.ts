import { browserAPI } from "../extensionPopUp.js";

export async function scrollToTop(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: () => {
      window.scrollTo(0, 0);
    },
  });
}

export async function scrollDownToNextSection(
  tabId: number,
  scrollBy: number,
): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [scrollBy],
    func: (scrollBy) => {
      window.scrollBy(0, scrollBy);
    },
  });
}
