export async function toggleSelfTesterOverlayVisibility(
  tabId: number,
  hideButton: HTMLElement,
): Promise<void> {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    func: (): boolean => {
      let isVisibleNow: boolean = false;
      const overlay = document.getElementById("sovendusOverlay");
      if (overlay) {
        const overlayToggle = document.getElementById("toggleSovendusOverlay");
        if (overlay.style.display === "none") {
          overlay.style.display = "block";
          overlay.classList.remove("fullscreen");
          if (overlayToggle) {
            overlayToggle.style.display = "block";
          }
          isVisibleNow = true;
        } else {
          overlay.style.display = "none";
          overlay.classList.remove("fullscreen");
          if (overlayToggle) {
            overlayToggle.style.display = "none";
          }
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
    throw new Error("Failed to check if an overlay is used");
  }
  const isVisibleNow = result[0].result;
  hideButton.innerText = isVisibleNow
    ? "Hide Self Test Overlay"
    : "Show Self Test Overlay";
}
