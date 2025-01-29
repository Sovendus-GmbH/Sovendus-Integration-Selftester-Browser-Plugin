import { debug } from "./logger/logger";

interface ExtensionSettings {
  transmitTestResult: boolean;
  blacklist: string[];
}

const defaultSettings: ExtensionSettings = {
  transmitTestResult: false,
  blacklist: [],
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;

  if (message.type === "GET_SETTINGS") {
    chrome.storage.local.get(defaultSettings, (settings) => {
      chrome.tabs.sendMessage(tabId, {
        type: "SETTINGS_RESPONSE",
        settings,
      });
      debug(
        "serviceWorker",
        `Received settings request from page and sent back:`,
        settings,
      );
    });
  } else if (message.type === "UPDATE_SETTINGS") {
    chrome.storage.local.set(message.settings, () => {
      console.log("Getting update settings request");
      chrome.tabs.sendMessage(tabId, {
        type: "SETTINGS_UPDATE_RESPONSE",
        success: true,
      });
      debug(
        "serviceWorker",
        `Received update settings request from page:`,
        message.settings,
      );
    });
  }
});

if (typeof browser === "undefined") {
  chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId }) => {
    void chrome.scripting.executeScript({
      target: { tabId },
      func: injectScriptFn,
    });
  });
}

function injectScriptFn(): void {
  function injectScript(): void {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute(
      "src",
      chrome.runtime.getURL("/browserExtensionLoader.js"),
    );
    // script.type = "module";
    document.body.appendChild(script);
  }
  if (!window.didLoad) {
    window.didLoad = true;
    injectScript();
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ServiceWorkerWindow extends Window {
  didLoad: boolean;
}

declare const window: ServiceWorkerWindow;
