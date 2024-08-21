import { getTabIdFromTabs } from "./extension-pop-up.js";

export async function toggleSelfTesterOverlayVisibility(
  tabs: chrome.tabs.Tab[],
): Promise<void> {
  const tabId = getTabIdFromTabs(tabs);
  if (tabId) {
    await _toggleSelfTesterOverlayVisibility(tabId);
  } else {
    throw new Error("Failed to get tabId to toggle overlay visibility");
  }
}

async function _toggleSelfTesterOverlayVisibility(
  tabId: number,
): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const overlay = document.getElementById("sovendusOverlay");
      if (overlay) {
        const overlayToggle = document.getElementById("toggleSovendusOverlay");
        if (overlay.style.display === "none") {
          overlay.style.display = "block";
          overlay.classList.remove("fullscreen");
          if (overlayToggle) {
            overlayToggle.style.display = "block";
          }
        } else {
          overlay.style.display = "none";
          overlay.classList.remove("fullscreen");
          if (overlayToggle) {
            overlayToggle.style.display = "none";
          }
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
    },
  });
}
