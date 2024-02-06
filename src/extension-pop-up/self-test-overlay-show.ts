var overlay = document.getElementById("sovendusOverlay");
if (overlay) {
  overlay.style.display = "block";
  overlay.classList.add("fullscreen");
  var overlayToggle = document.getElementById("toggleSovendusOverlay");
  overlayToggle.style.display = "block";
} else {
  createNotDetectedOverlay();
}

function getOverlayStyle() {
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

function createNotDetectedOverlay() {
  var overlay = document.createElement("div");
  overlay.id = "outerSovendusNotDetectedOverlay";
  overlay.innerHTML = `
      ${getOverlayStyle()}
      <div class="sovendus-overlay-font" id="sovendusNotDetectedOverlay">  
        <div style="margin:auto;max-width:500px;">
          <div>
            <h1 class="sovendus-overlay-font sovendus-overlay-h1">Sovendus Selftest Overlay</h1>
          </div>
          <h2 class="sovendus-overlay-font sovendus-overlay-h2" style="color:red !important;">Error: Sovendus was not detected</h2>
        </div>
      </div>
    `;
  document.getElementsByTagName("body")[0].appendChild(overlay);
}
