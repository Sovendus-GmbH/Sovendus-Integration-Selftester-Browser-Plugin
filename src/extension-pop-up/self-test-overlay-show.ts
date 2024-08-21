_showOverlay();

function _showOverlay() {
  const overlay = document.getElementById("sovendusOverlay");
  if (overlay) {
    overlay.style.display = "block";
    overlay.classList.add("fullscreen");
    const overlayToggle = document.getElementById("toggleSovendusOverlay");
    if (overlayToggle) {
      overlayToggle.style.display = "block";
    }
    _hideRepeatTestsButton();
  } else {
    _createNotDetectedOverlay();
  }
}

function _hideRepeatTestsButton() {
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
          border: solid;
          padding: 22px;
          background: #293049;
          z-index: 2147483647;
          overflow-y: auto;
          width: 100vw;
          height: 100vh;
          top: 0;
          left: 0;
          max-height: 100vh;
        }
        @media only screen and (max-width: 700px) {
          #sovendusNotDetectedOverlay {
            left: 0;
            right: 0;
            width: 500px;
            max-width: 500px;
            top: 50px;
            padding: 22px;
           
          }
        }
        @media only screen and (min-width: 700px) {
          #sovendusNotDetectedOverlay {
            transform: scale(130%);
            transform-origin: top;
          }
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
      </style>
    `;
}

function _createNotDetectedOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "outerSovendusNotDetectedOverlay";
  overlay.innerHTML = `
      ${_getOverlayStyle()}
      <div class="sovendus-overlay-font" id="sovendusNotDetectedOverlay">  
        <div style="margin:auto;max-width:500px;">
          <div>
            <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Self Test Overlay</h1>
          </div>
          <h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: Sovendus was not detected</h2>
        </div>
      </div>
    `;
  document.body.appendChild(overlay);
}
