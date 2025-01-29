import { debug } from "./logger/logger";

const script = document.createElement("script");
script.src = chrome.runtime.getURL("browserExtensionLoader.js");
document.documentElement.appendChild(script);

// Handle messages from page to service worker
window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (
    event.data.type === "GET_SETTINGS" ||
    event.data.type === "UPDATE_SETTINGS"
  ) {
    chrome.runtime.sendMessage(event.data);
    debug(
      "contentScript",
      `Forwarded ${event.data.type} message to serviceWorker`,
      event.data,
    );
  }
});

// Handle messages from service worker to page
chrome.runtime.onMessage.addListener((message) => {
  window.postMessage(message, "*");
  debug("contentScript", `Forwarded ${message} message to page`);
});

