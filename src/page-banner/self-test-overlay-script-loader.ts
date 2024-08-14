import type { SovWindow } from "./self-tester";

function injectScript() {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute(
    "src",
    chrome.runtime.getURL("/page-banner/self-test-overlay.js"),
  );
  script.type = "module";
  document.body.appendChild(script);
}
if (!window.didLoad) {
  window.didLoad = true;
  injectScript();
}

declare let window: SovWindow;
