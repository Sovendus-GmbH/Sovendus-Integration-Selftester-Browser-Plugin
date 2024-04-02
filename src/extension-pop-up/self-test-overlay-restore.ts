var overlay = document.getElementById("sovendusOverlay");
overlay.style.display = "block";
overlay.classList.remove("fullscreen");
var overlayToggle = document.getElementById("toggleSovendusOverlay");
overlayToggle.style.display = "block";
showRepeatTestsButton()

function showRepeatTestsButton(){
    const repeatTestsButton = document.getElementById("sovendusOverlayRepeatTests");
    repeatTestsButton.style.display = "block";
  }