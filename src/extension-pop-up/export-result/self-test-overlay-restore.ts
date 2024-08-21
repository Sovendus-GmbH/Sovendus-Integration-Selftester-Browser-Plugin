export async function restoreSelfTesterOverlay(tabId: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      function _restoreOverlay(): void {
        const overlay = document.getElementById("sovendusOverlay");
        if (overlay) {
          overlay.style.display = "block";
          overlay.classList.remove("fullscreen");
          const overlayToggle = document.getElementById(
            "toggleSovendusOverlay",
          );
          if (overlayToggle) {
            overlayToggle.style.display = "block";
          }
          _showRepeatTestsButton();
        } else {
          _removeSovendusNotDetectedOverlay();
        }
      }

      function _showRepeatTestsButton(): void {
        const repeatTestsButton = document.getElementById(
          "sovendusOverlayRepeatTests",
        );
        if (repeatTestsButton) {
          repeatTestsButton.style.display = "block";
        }
      }

      function _removeSovendusNotDetectedOverlay(): void {
        document.getElementById("outerSovendusNotDetectedOverlay")?.remove();
      }

      _restoreOverlay();
    },
  });
}
