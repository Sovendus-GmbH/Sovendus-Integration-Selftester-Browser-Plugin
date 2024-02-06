var overlay = document.getElementById("sovendusOverlay");
if (overlay) {
    overlay.style.display = "none";
    overlay.classList.remove("fullscreen");
    var overlayToggle = document.getElementById("toggleSovendusOverlay");
    overlayToggle.style.display = "none";
}
else {
    removeSovendusNotDetectedOverlay();
}
function removeSovendusNotDetectedOverlay() {
    var overlay = document.getElementById("outerSovendusNotDetectedOverlay");
    overlay.remove();
}
