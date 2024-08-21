import { checkAvailableIntegrations } from "./check-available-integrations.js";
import { exportResultsScreenshot } from "./export-result/export-result.js";
import { toggleSelfTesterOverlayVisibility } from "./toggleOverlay.js";

document.addEventListener("DOMContentLoaded", () => {
  const captureButton = document.getElementById(
    "capture-button",
  ) as HTMLElement;
  captureButton.addEventListener("click", () => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      void exportResultsScreenshot(tabs, captureButton);
    });
  });
  const hideButton = document.getElementById("hide-button") as HTMLElement;
  hideButton.addEventListener("click", (): void => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      void toggleSelfTesterOverlayVisibility(tabs);
    });
  });
  const checkMethodsButton = document.getElementById(
    "check-methods-button",
  ) as HTMLElement;
  checkMethodsButton.addEventListener("click", (): void => {
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, (tabs: chrome.tabs.Tab[]) => {
      void checkAvailableIntegrations(tabs);
    });
  });
});

export function getTabIdFromTabs(tabs: chrome.tabs.Tab[]): number | undefined {
  const currentTab = tabs[0];
  return currentTab?.id;
}
