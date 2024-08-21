import {
  fullscreenClass,
  overlayId,
  sovendusOverlayFontClass,
  sovendusOverlayH1Class,
  sovendusOverlayH2Class,
  sovendusOverlayRepeatTestsId,
  testLoadedIFrameId,
  toggleSovendusOverlayId,
} from "../../page-banner/self-test-overlay-css-vars.js";
import { browserAPI } from "../extension-pop-up.js";

export async function hideSelfTesterOverlay(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [toggleSovendusOverlayId, overlayId, fullscreenClass],
    func: (toggleSovendusOverlayId, overlayId, fullscreenClass) => {
      const overlay = document.getElementById(overlayId);
      if (overlay) {
        overlay.style.display = "none";
        overlay.classList.remove(fullscreenClass);
        const overlayToggle = document.getElementById(toggleSovendusOverlayId);
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
  await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [
      toggleSovendusOverlayId,
      overlayId,
      fullscreenClass,
      sovendusOverlayRepeatTestsId,
      testLoadedIFrameId,
    ],
    func: (
      toggleSovendusOverlayId,
      overlayId,
      fullscreenClass,
      sovendusOverlayRepeatTestsId,
      testLoadedIFrameId,
    ) => {
      function _restoreOverlay(): void {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
          overlay.style.display = "block";
          overlay.classList.remove(fullscreenClass);
          const overlayToggle = document.getElementById(
            toggleSovendusOverlayId,
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
        const repeatTestsButton = (
          document.getElementById(
            testLoadedIFrameId,
          ) as HTMLIFrameElement | null
        )?.contentDocument?.getElementById(sovendusOverlayRepeatTestsId);
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
  await browserAPI.scripting.executeScript({
    target: { tabId },
    args: [
      toggleSovendusOverlayId,
      overlayId,
      fullscreenClass,
      sovendusOverlayFontClass,
      sovendusOverlayH1Class,
      sovendusOverlayH2Class,
      sovendusOverlayRepeatTestsId,
      testLoadedIFrameId,
    ],
    func: (
      toggleSovendusOverlayId,
      overlayId,
      fullscreenClass,
      sovendusOverlayFontClass,
      sovendusOverlayH1Class,
      sovendusOverlayH2Class,
      sovendusOverlayRepeatTestsId,
      testLoadedIFrameId,
    ) => {
      _showOverlay();

      function _showOverlay(): void {
        const overlay = document.getElementById(overlayId);
        if (overlay) {
          overlay.style.display = "block";
          overlay.classList.add(fullscreenClass);
          const overlayToggle = document.getElementById(
            toggleSovendusOverlayId,
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
        const repeatTestsButton = (
          document.getElementById(
            testLoadedIFrameId,
          ) as HTMLIFrameElement | null
        )?.contentDocument?.getElementById(sovendusOverlayRepeatTestsId);
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
              .${sovendusOverlayH1Class} {
                font-size: 27px !important;
                margin-top: 0 !important;
                margin-bottom: 5px !important;
              }
              .${sovendusOverlayH2Class} {
                font-size: 20px !important;
                margin-top: 4px !important;
                margin-bottom: 4px !important;
              }
              .${sovendusOverlayFontClass} {
                color: white !important;
                font-family: Arial, Helvetica, sans-serif !important;
              }
              @media only screen and (min-width: 700px) {
                .${sovendusOverlayH1Class} {
                  font-size: 35px !important;
                }
                .${sovendusOverlayH2Class} {
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
            <div class="${sovendusOverlayFontClass}" id="sovendusNotDetectedOverlay">  
              <div id="sovendusFontContainer" style="margin:auto;">
                <div>
                  <h1 class="${sovendusOverlayFontClass} ${sovendusOverlayH1Class}">Sovendus Self Test Overlay</h1>
                </div>
                <h2 class="${sovendusOverlayFontClass} ${sovendusOverlayH2Class}" style="color:red !important;">Error: Sovendus was not detected</h2>
              </div>
            </div>
          `;
        document.body.appendChild(overlay);
      }
    },
  });
}
