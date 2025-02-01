import { debug, error } from "../logger/logger";
import { browserAPI } from "./browser-api";
import { createFullPageScreenShot } from "./take-screenshot/take-screenshot";

let isInitialized = false;

function serviceWorker(): void {
  if (isInitialized) {
    debug("serviceWorker", "Service worker already initialized, skipping...");
    return;
  }
  isInitialized = true;
  const url = browserAPI.runtime.getURL("/browserExtensionLoader.js");

  browserAPI.webNavigation.onDOMContentLoaded.addListener(({ tabId }) => {
    void browserAPI.scripting.executeScript({
      target: { tabId },
      args: [url],
      func: injectScriptFn,
    });
    // browserAPI.runtime.onMessage.addListener((request, sender, sendResponse) => {
    //   if (request.action === "TAKE_SCREENSHOT_SERVICE_WORKER") {
    //     void chrome.tabs.captureVisibleTab((dataUrl) => {
    //       sendResponse({ screenshotUrl: dataUrl });
    //     });
    //     return true; // Will respond asynchronously.
    //   }
    // });
    browserAPI.runtime.onMessage.addListener(
      (request, _sender, sendResponse) => {
        if (request.action === "TAKE_SCREENSHOT_SERVICE_WORKER") {
          debug(
            "browserSettingsBridge][serviceWorker",
            "Received take screenshot from contentScript...",
          );
          createFullPageScreenShot(tabId)
            .then((screenshotUrl) => {
              sendResponse({ screenshotUrl: screenshotUrl });
              debug(
                "browserSettingsBridge][serviceWorker",
                "Sent screenshot to contentScript...",
              );
            })
            .catch((e) => {
              error(
                "browserSettingsBridge][serviceWorker",
                "Error taking screenshot:",
                e,
              );
              sendResponse({ screenshotUrl: "", error: e });
            });
        }
      },
    );
    debug("browserSettingsBridge][serviceWorker", "Service worker loaded...");
  });

  function injectScriptFn(url: string): void {
    function injectScript(): void {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute("src", url);
      script.setAttribute("type", "module");
      document.body.appendChild(script);
    }
    if (!window.didLoad) {
      window.didLoad = true;
      injectScript();
    }
  }
}

serviceWorker();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ServiceWorkerWindow extends Window {
  didLoad: boolean;
}

declare const window: ServiceWorkerWindow;
