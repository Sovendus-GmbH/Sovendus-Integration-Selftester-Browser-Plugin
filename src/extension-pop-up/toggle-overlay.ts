import {
  fullscreenClass,
  overlayId,
  toggleSovendusOverlayId,
} from "../page-banner/integration-test-overlay-css-vars.js";
import { browserAPI } from "./extension-pop-up.js";

export async function toggleSelfTesterOverlayVisibility(
  tabId: number,
  hideButton: HTMLElement,
): Promise<void> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [toggleSovendusOverlayId, overlayId, fullscreenClass],
    func: (
      toggleSovendusOverlayId: string,
      overlayId: string,
      fullscreenClass: string,
    ): boolean => {
      let isVisibleNow: boolean = false;
      const overlay = document.getElementById(overlayId);
      const overlayToggle = document.getElementById(toggleSovendusOverlayId);
      if (overlay && overlayToggle) {
        if (overlayToggle.style.display === "none") {
          overlay.style.display = "block";
          overlay.classList.remove(fullscreenClass);
          overlayToggle.style.display = "block";
          isVisibleNow = true;
        } else {
          overlay.style.display = "none";
          overlay.classList.remove(fullscreenClass);
          overlayToggle.style.display = "none";
          isVisibleNow = false;
        }
      }

      const checkerOverlay = document.getElementById(
        "outerSovendusIntegrationMethodCheckerOverlay",
      );
      if (checkerOverlay) {
        if (checkerOverlay.style.display === "none") {
          checkerOverlay.style.display = "block";
        } else {
          checkerOverlay.style.display = "none";
        }
      }
      return isVisibleNow;
    },
  });
  if (result?.[0]?.result === undefined) {
    throw new Error(
      `Failed to check if an overlay is used, result: ${JSON.stringify(
        result,
      )}`,
    );
  }
  const isVisibleNow = result[0].result;
  hideButton.innerText = isVisibleNow
    ? "Hide Self Test Overlay"
    : "Show Self Test Overlay";
}
