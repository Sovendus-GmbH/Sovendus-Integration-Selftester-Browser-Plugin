import { checkAvailableIntegrations } from "./check-available-integrations.js";
import { exportResultsScreenshot } from "./export-result/export-result.js";
import { checkIfSovendusIsDetected } from "./export-result/utils.js";
import { toggleSelfTesterOverlayVisibility } from "./toggle-overlay.js";

document.addEventListener("DOMContentLoaded", () => {
  const captureButton = document.getElementById(
    "capture-button",
  ) as HTMLElement;
  const alertContainer = document.getElementById(
    "alertContainer",
  ) as HTMLElement;
  const hideButton = document.getElementById("hide-button") as HTMLElement;
  const checkMethodsButton = document.getElementById(
    "check-methods-button",
  ) as HTMLElement;
  chrome.tabs.query(
    { active: true, currentWindow: true },
    (tabs: chrome.tabs.Tab[]) => {
      const tabId = getTabIdFromTabs(tabs, "toggleSelfTesterOverlayVisibility");
      void (async (): Promise<void> => {
        const { sovendusIntegrated, overlayVisible } =
          await checkIfSovendusIsDetected(tabId);
        addExportResultClickEvent(tabId, captureButton, alertContainer);
        addCheckAvailableMethodsClickEvent(
          tabId,
          sovendusIntegrated,
          checkMethodsButton,
        );
        addCheckIfSovendusIsDetectedClickEvent(
          tabId,
          sovendusIntegrated,
          overlayVisible,
          hideButton,
          alertContainer,
        );
      })();
    },
  );
});

function addExportResultClickEvent(
  tabId: number,
  captureButton: HTMLElement,
  alertContainer: HTMLElement,
): void {
  captureButton.addEventListener("click", () => {
    void exportResultsScreenshot(tabId, captureButton, alertContainer);
  });
}

function addCheckAvailableMethodsClickEvent(
  tabId: number,
  sovendusIntegrated: boolean,
  checkMethodsButton: HTMLElement,
): void {
  if (!sovendusIntegrated) {
    checkMethodsButton.addEventListener("click", (): void => {
      void checkAvailableIntegrations(tabId);
    });
    checkMethodsButton.style.display = "block";
  }
}

function addCheckIfSovendusIsDetectedClickEvent(
  tabId: number,
  sovendusIntegrated: boolean,
  overlayVisible: boolean,
  hideButton: HTMLElement,
  alertContainer: HTMLElement,
): void {
  if (sovendusIntegrated) {
    hideButton.addEventListener("click", (): void => {
      void toggleSelfTesterOverlayVisibility(tabId, hideButton);
    });
    hideButton.style.display = "block";
    hideButton.innerText = overlayVisible
      ? "Hide Self Test Overlay"
      : "Show Self Test Overlay";
  } else {
    hideButton.style.display = "none";
    alertContainer.innerText = "No Sovendus integration detected";
    alertContainer.style.display = "block";
  }
}

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

export const browserAPI = (
  typeof browser === "undefined" ? chrome : browser
) as typeof chrome;
