import {
  outerOverlayId,
  toggleSovendusOverlayId,
} from "../../page-banner/integration-test-overlay-css-vars.js";
import { browserAPI } from "../extension-pop-up.js";

export async function copyScreenshotsToClipboard(
  screenshotContainer: HTMLCanvasElement,
): Promise<void> {
  await new Promise<void>((resolve) => {
    void (async (): Promise<void> => {
      if (isFirefox()) {
        const response = await fetch(screenshotContainer.toDataURL());
        const buffer = await response.arrayBuffer();
        await browser.clipboard.setImageData(buffer, "png");
        resolve();
      } else {
        screenshotContainer.toBlob((blob: Blob | null): void => {
          if (!blob) {
            throw new Error("Failed to save to clipboard");
          }
          const data = [new ClipboardItem({ [blob.type]: blob })];
          navigator.clipboard
            .write(data)
            .then(() => {
              resolve();
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.error("Failed to copy to the clipboard, error:", error);
            });
        });
      }
    })();
  });
}

export async function addDelayBetweenScreenshotOnChrome(): Promise<void> {
  if (!isFirefox()) {
    // wait a second as captureVisibleTab only supports once per second on chrome
    await new Promise((r) => setTimeout(r, 1000));
  }
}

function isFirefox(): boolean {
  return !window.ClipboardItem;
}

export async function checkIfSovendusIsDetected(
  tabId: number,
): Promise<{ sovendusIntegrated: boolean; overlayVisible: boolean }> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [outerOverlayId, toggleSovendusOverlayId],
    func: (
      outerOverlayId,
      toggleSovendusOverlayId,
    ): { sovendusIntegrated: boolean; overlayVisible: boolean } => {
      const sovendusIntegrated = !!document.getElementById(outerOverlayId);
      const overlayToggle = document.getElementById(toggleSovendusOverlayId);
      const overlayVisible = overlayToggle?.style.display !== "none";
      return { sovendusIntegrated, overlayVisible };
    },
  });
  if (result?.[0]?.result === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      "Failed to check if Sovendus is integrated - script injection failed",
    );
    return { sovendusIntegrated: false, overlayVisible: false };
  }
  return result[0].result;
}

export interface SovWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ClipboardItem?: any;
}

declare let window: SovWindow;
