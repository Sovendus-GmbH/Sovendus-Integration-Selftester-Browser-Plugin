import { overlayRootId } from "../../constants";
import { error } from "../../logger/logger";
import { browserAPI } from "../browser-api";

export async function hideSelfTesterOverlay(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [overlayRootId],
    func: (overlayRootId) => {
      const overlay = document.getElementById(overlayRootId);
      if (overlay) {
        overlay.style.display = "none";
      } else {
        error("browserBridge][serviceWorker", "Overlay not found");
      }
    },
  });
}

export async function restoreSelfTesterOverlay(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [overlayRootId],
    func: (overlayRootId) => {
      const overlay = document.getElementById(overlayRootId);
      if (overlay) {
        overlay.style.display = "block";
      } else {
        error("browserBridge][serviceWorker", "Overlay not found");
      }
    },
  });
}
