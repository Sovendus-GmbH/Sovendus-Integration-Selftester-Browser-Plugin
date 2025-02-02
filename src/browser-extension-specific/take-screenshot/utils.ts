export async function addDelayBetweenScreenshotOnChrome(): Promise<void> {
  if (!isFirefox()) {
    // wait a second as captureVisibleTab only supports once per second on chrome
    await new Promise((r) => setTimeout(r, 1000));
  }
}

function isFirefox(): boolean {
  return !(typeof chrome !== "undefined" && typeof browser === "undefined");
}

// export async function checkIfSovendusIsDetected(
//   tabId: number,
// ): Promise<{ sovendusIntegrated: boolean; overlayVisible: boolean }> {
//   const result = await browserAPI.scripting.executeScript({
//     target: { tabId },
//     world: "MAIN",
//     args: [outerOverlayId, openSovendusOverlayId],
//     func: (
//       outerOverlayId,
//       openSovendusOverlayId,
//     ): { sovendusIntegrated: boolean; overlayVisible: boolean } => {
//       const sovendusIntegrated = !!document.getElementById(outerOverlayId);
//       const overlayToggle = document.getElementById(openSovendusOverlayId);
//       const overlayVisible = overlayToggle?.style.display !== "none";
//       return { sovendusIntegrated, overlayVisible };
//     },
//   });
//   if (result?.[0]?.result === undefined) {
//     // eslint-disable-next-line no-console
//     console.error(
//       "Failed to check if Sovendus is integrated - script injection failed",
//     );
//     void transmitIntegrationError(
//       "Failed to check if Sovendus is integrated - script injection failed",
//       { windowParameter: window },
//     );

//     return { sovendusIntegrated: false, overlayVisible: false };
//   }
//   return result[0].result;
// }

// export interface SovWindow extends Window {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   ClipboardItem?: any;
//   sovSelfTester?: SelfTester;
// }

// declare let window: SovWindow;
