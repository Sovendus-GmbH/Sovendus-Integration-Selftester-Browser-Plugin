import {
  defaultStorage,
  type ExtensionSettingsEvent,
  type ExtensionStorage,
} from "../integration-tester-ui/testing-storage";
import { debug, error } from "../logger/logger";
import { browserAPI } from "./browser-api";

function contentScript(event: ExtensionSettingsEvent): void {
  if (event.source !== window) {
    return;
  }

  if (event.data.type === "TAKE_SCREENSHOT") {
    chrome.runtime.sendMessage(
      { action: "TAKE_SCREENSHOT_SERVICE_WORKER" },
      (response) => {
        if (response && response.screenshotUrl) {
          debug(
            "browserSettingsBridge][contentScript",
            "Received screenshot from background...",
            response.screenshotUrl,
          );
          window.postMessage(
            {
              type: "TAKE_SCREENSHOT_RESPONSE",
              screenshotUrl: response.screenshotUrl,
              success: true,
            },
            "*",
          );
        } else {
          error(
            "browserSettingsBridge][contentScript",
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
      "browserSettingsBridge][contentScript",
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
        debug(
          "browserSettingsBridge][contentScript",
          "Sent successfully:",
          settings,
        );
      } catch (e) {
        error(
          "browserSettingsBridge][contentScript",
          "Error sending settings:",
          { error: e, settings },
        );
      }
    });
  } else if (event.data.type === "UPDATE_SETTINGS") {
    debug(
      "browserSettingsBridge][contentScript",
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
            "browserSettingsBridge][contentScript",
            "UPDATED settings successfully:",
            event.data.settings,
          );
        } catch (e) {
          error(
            "browserSettingsBridge][contentScript",
            "Error updating settings:",
            { error: e, settings: event.data.settings },
          );
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
