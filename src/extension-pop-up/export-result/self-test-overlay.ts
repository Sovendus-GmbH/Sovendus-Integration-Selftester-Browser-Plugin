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
  const hideButton = document.getElementById("hide-button");
  if (hideButton) {
    hideButton.innerText = "Hide Self Test Overlay";
  }
}

export async function showSelfTesterOverlay(tabId: number): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      _showOverlay();

      function _showOverlay(): void {
        const overlay = document.getElementById("sovendusOverlay");
        if (overlay) {
          overlay.style.display = "block";
          overlay.classList.add("fullscreen");
          const overlayToggle = document.getElementById(
            "toggleSovendusOverlay",
          );
          if (overlayToggle) {
            overlayToggle.style.display = "block";
          }
          _hideRepeatTestsButton();
        } else {
          _createNotDetectedOverlay();
        }
      }

      function _hideRepeatTestsButton(): void {
        const repeatTestsButton = document.getElementById(
          "sovendusOverlayRepeatTests",
        );
        if (repeatTestsButton) {
          repeatTestsButton.style.display = "none";
        }
      }

      function _getOverlayStyle(): string {
        return `
            <style>
              #sovendusNotDetectedOverlay {
                position: fixed;
                border: unset;
                width: 100vw;
                height: 100vh;
                top: 0;
                left: 0;
                max-height: 100vh;
                padding-top: 22px !important;
                background: #293049 !important;
                z-index: 2147483648 !important;
                overflow-y: auto !important;
                border-radius: 8px !important;    
                line-height: normal !important;
              }
              #sovendusFontContainer {
                max-width:333px;
              }
              .sovendus-overlay-h1 {
                font-size: 27px !important;
                margin-top: 0 !important;
                margin-bottom: 5px !important;
              }
              .sovendus-overlay-h2 {
                font-size: 20px !important;
                margin-top: 4px !important;
                margin-bottom: 4px !important;
              }
              .sovendus-overlay-font {
                color: white !important;
                font-family: Arial, Helvetica, sans-serif !important;
              }
              @media only screen and (min-width: 700px) {
                .sovendus-overlay-h1 {
                  font-size: 35px !important;
                }
                .sovendus-overlay-h2 {
                  font-size: 28px !important;
                }
                #sovendusFontContainer {
                  max-width:430px;
                }
              }
            </style>
          `;
      }

      function _createNotDetectedOverlay(): void {
        const overlay = document.createElement("div");
        overlay.id = "outerSovendusNotDetectedOverlay";
        overlay.innerHTML = `
            ${_getOverlayStyle()}
            <div class="sovendus-overlay-font" id="sovendusNotDetectedOverlay">  
              <div id="sovendusFontContainer" style="margin:auto;">
                <div>
                  <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Self Test Overlay</h1>
                </div>
                <h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: Sovendus was not detected</h2>
              </div>
            </div>
          `;
        document.body.appendChild(overlay);
      }
    },
  });
}
