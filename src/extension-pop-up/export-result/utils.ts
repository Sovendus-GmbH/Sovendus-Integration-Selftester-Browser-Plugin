import type SelfTester from "../../page-banner/self-tester.js";
import { StatusCodes } from "../../page-banner/self-tester-data-to-sync-with-dev-hub.js";

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
              console.error(error);
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
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [StatusCodes.TestDidNotRun],
    func: (
      testDidNotRunStatusCode,
    ): { sovendusIntegrated: boolean; overlayVisible: boolean } => {
      const sovendusIntegrated =
        !!window.sovSelfTester &&
        window.sovSelfTester.wasExecuted?.statusCode !==
          testDidNotRunStatusCode;
      const overlayToggle = document.getElementById("toggleSovendusOverlay");
      const overlayVisible = overlayToggle?.style.display !== "none";
      return { sovendusIntegrated, overlayVisible };
    },
  });
  if (result?.[0]?.result === undefined) {
    throw new Error(
      "Failed to check if Sovendus is integrated - script injection failed",
    );
  }
  return result[0].result;
}

export interface SovWindow extends Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ClipboardItem?: any;
  sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
