import {
  defaultStorage,
  type ExtensionSettingsEvent,
  type ExtensionStorage,
} from "../integration-tester-ui/testing-storage";
import { debug, error } from "../logger/logger";
import { browserAPI } from "./browser-api";
import type { ScreenShotRequest, ScreenShotResponse } from "./types";

function contentScript(event: ExtensionSettingsEvent): void {
  if (event.source !== window) {
    return;
  }

  if (event.data.type === "TAKE_SCREENSHOT") {
    chrome.runtime.sendMessage(
      {
        action: "TAKE_SCREENSHOT_SERVICE_WORKER",
      } satisfies ScreenShotRequest,
      (response: ScreenShotResponse) => {
        if (response && response.screenShotUri) {
          debug(
            "browserBridge][contentScript",
            "Received screenshot from background...",
            { screenShotUri: response.screenShotUri, source: event.source },
          );
          window.postMessage(
            {
              type: "TAKE_SCREENSHOT_RESPONSE",
              screenshotUrl: response.screenShotUri,
              success: true,
            },
            "*",
          );
        } else {
          error(
            "browserBridge][contentScript",
            "Error taking screenshot:",
            response,
          );
          window.postMessage(
            {
              type: "TAKE_SCREENSHOT_RESPONSE",
              success: false,
            },
            "*",
          );
        }
      },
    );
  } else if (event.data.type === "GET_SETTINGS") {
    debug(
      "browserBridge][contentScript",
      "Received GET settings request from page...",
    );
    browserAPI.storage.local.get(defaultStorage, (settings) => {
      try {
        window.postMessage(
          {
            type: "GET_SETTINGS_RESPONSE",
            settings: settings as ExtensionStorage,
          },
          "*",
        );
        debug("browserBridge][contentScript", "Sent successfully:", settings);
      } catch (e) {
        error("browserBridge][contentScript", "Error sending settings:", {
          error: e,
          settings,
        });
      }
    });
  } else if (event.data.type === "UPDATE_SETTINGS") {
    debug(
      "browserBridge][contentScript",
      "Received UPDATE settings request from page...",
    );
    browserAPI.storage.local.set(
      event.data.settings as ExtensionStorage,
      () => {
        try {
          window.postMessage(
            {
              type: "SETTINGS_UPDATE_RESPONSE",
              success: true,
            },
            "*",
          );
          debug(
            "browserBridge][contentScript",
            "UPDATED settings successfully:",
            event.data.settings,
          );
        } catch (e) {
          error("browserBridge][contentScript", "Error updating settings:", {
            error: e,
            settings: event.data.settings,
          });
        }
      },
    );
  }
}

if (window.contentScriptDidLoad) {
  window.removeEventListener("message", contentScript);
} else {
  window.contentScriptDidLoad = true;
}
window.addEventListener("message", contentScript);

interface ContentScriptWindow extends Window {
  contentScriptDidLoad: boolean;
}

declare const window: ContentScriptWindow;
