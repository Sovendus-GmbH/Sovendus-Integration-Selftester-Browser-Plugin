import { overlayRootId } from "../../constants";
import { browserAPI } from "../browser-api";

export async function toggleSelfTesterOverlayVisibility(
  tabId: number,
  hideButton: HTMLElement,
): Promise<void> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [overlayRootId],
    func: (overlayRootId: string): boolean => {
      let isVisibleNow = false;
      const overlay = document.getElementById(overlayRootId);
      if (overlay) {
        if (overlay.style.display === "none") {
          overlay.style.display = "block";
          isVisibleNow = true;
        } else {
          overlay.style.display = "none";
          isVisibleNow = false;
        }
      }

      return isVisibleNow;
    },
  });
  if (result?.[0]?.result === undefined) {
    throw new Error(
      `Failed to check if an overlay is used, result: ${JSON.stringify(result)}`,
    );
  }
  const isVisibleNow = result[0].result;
  hideButton.innerText = isVisibleNow
    ? "Hide Self Test Overlay"
    : "Show Self Test Overlay";
}
