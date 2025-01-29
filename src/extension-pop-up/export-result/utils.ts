import type SelfTester from "../../integration-tester/integrationTester.js";
import { transmitIntegrationError } from "../../integration-tester/integrationTester.js";
import {
  openSovendusOverlayId,
  outerOverlayId,
} from "../../integration-tester-ui/old/integration-test-overlay-css-vars.js";
import { browserAPI } from "../extensionPopUp.js";

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
              void transmitIntegrationError(
                `Failed to copy to the clipboard, error: ${error}`,
                { windowParameter: window },
              );
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
    args: [outerOverlayId, openSovendusOverlayId],
    func: (
      outerOverlayId,
      openSovendusOverlayId,
    ): { sovendusIntegrated: boolean; overlayVisible: boolean } => {
      const sovendusIntegrated = !!document.getElementById(outerOverlayId);
      const overlayToggle = document.getElementById(openSovendusOverlayId);
      const overlayVisible = overlayToggle?.style.display !== "none";
      return { sovendusIntegrated, overlayVisible };
    },
  });
  if (result?.[0]?.result === undefined) {
    // eslint-disable-next-line no-console
    console.error(
      "Failed to check if Sovendus is integrated - script injection failed",
    );
    void transmitIntegrationError(
      "Failed to check if Sovendus is integrated - script injection failed",
      { windowParameter: window },
    );

    return { sovendusIntegrated: false, overlayVisible: false };
  }
  return result[0].result;
}

export interface SovWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ClipboardItem?: any;
  sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
