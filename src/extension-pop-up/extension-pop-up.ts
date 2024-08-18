import { checkAvailableIntegrations } from "./check-available-integrations.js";
import { exportResultsScreenshot } from "./export-result/export-result.js";
import { checkIfSovendusIsDetected } from "./export-result/utils.js";
import { toggleSelfTesterOverlayVisibility } from "./toggleOverlay.js";

document.addEventListener("DOMContentLoaded", () => {
  const captureButton = document.getElementById(
    "capture-button",
  ) as HTMLElement;
  const alertContainer = document.getElementById(
    "alertContainer",
  ) as HTMLElement;
  captureButton.addEventListener("click", () => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      const tabId = getTabIdFromTabs(tabs, "exportResultsScreenshot");
      void exportResultsScreenshot(tabId, captureButton, alertContainer);
    });
  });
  const hideButton = document.getElementById("hide-button") as HTMLElement;
  hideButton.addEventListener("click", (): void => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      const tabId = getTabIdFromTabs(tabs, "toggleSelfTesterOverlayVisibility");
      void toggleSelfTesterOverlayVisibility(tabId, hideButton);
    });
  });
  const checkMethodsButton = document.getElementById(
    "check-methods-button",
  ) as HTMLElement;
  checkMethodsButton.addEventListener("click", (): void => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      const tabId = getTabIdFromTabs(tabs, "checkAvailableIntegrations");
      void checkAvailableIntegrations(tabId);
    });
  });
  const query = { active: true, currentWindow: true };
  chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
    void (async (): Promise<void> => {
      const tabId = getTabIdFromTabs(tabs, "checkIfSovendusIsDetected");
      const { sovendusIntegrated, overlayVisible } =
        await checkIfSovendusIsDetected(tabId);
      if (!sovendusIntegrated) {
        hideButton.style.display = "none";
        alertContainer.innerText = "No Sovendus integration detected";
        alertContainer.style.display = "block";
      } else {
        hideButton.innerText = overlayVisible
          ? "Hide Self Test Overlay"
          : "Show Self Test Overlay";
      }
    })();
  });
});

function getTabIdFromTabs(
  tabs: chrome.tabs.Tab[],
  functionName: string,
): number {
  const currentTab = tabs[0];
  if (currentTab?.id) {
    return currentTab.id;
  }
  throw new Error(`Failed to get tabId for ${functionName}`);
}
