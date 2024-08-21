export async function hideSelfTesterOverlay(tabId: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const overlay = document.getElementById("sovendusOverlay");
      if (overlay) {
        overlay.style.display = "none";
        overlay.classList.remove("fullscreen");
        const overlayToggle = document.getElementById("toggleSovendusOverlay");
        if (overlayToggle) {
          overlayToggle.style.display = "none";
        }
      } else {
        document.getElementById("outerSovendusNotDetectedOverlay")?.remove();
      }
    },
  });
}
