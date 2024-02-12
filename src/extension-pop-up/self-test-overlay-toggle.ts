var overlay = document.getElementById("sovendusOverlay");
if (overlay) {
  var overlayToggle = document.getElementById("toggleSovendusOverlay");
  if (overlay.style.display === "none") {
    overlay.style.display = "block";
    overlay.classList.remove("fullscreen");
    overlayToggle.style.display = "block";
  } else {
    overlay.style.display = "none";
    overlay.classList.remove("fullscreen");
    overlayToggle.style.display = "none";
  }
}
