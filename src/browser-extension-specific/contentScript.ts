import { defaultStorage } from "../integration-tester-ui/testing-flow-config";
import { debug } from "../logger/logger";
import { browserAPI } from "./browser-api";
import type { ExtensionSettingsEvent, ExtensionStorageLoaded } from "./types";

// Handle saving and retrieving settings from the browser
window.addEventListener("message", (event: ExtensionSettingsEvent) => {
  if (event.source !== window) {
    return;
  }
  if (event.data.type === "GET_SETTINGS") {
    debug(
      "browserSettingsBridge][contentScript",
      "Received GET settings request from page...",
    );
    browserAPI.storage.local.get(defaultStorage, (settings) => {
      try {
        window.postMessage(
          {
            type: "GET_SETTINGS_RESPONSE",
            settings: settings as ExtensionStorageLoaded,
          },
          "*",
        );
        debug(
          "browserSettingsBridge][contentScript",
          "Sent successfully:",
          settings,
        );
      } catch (error) {
        debug(
          "browserSettingsBridge][contentScript",
          "Error sending settings:",
          { error, settings },
        );
      }
    });
  } else if (event.data.type === "UPDATE_SETTINGS") {
    debug(
      "browserSettingsBridge][contentScript",
      "Received UPDATE settings request from page...",
    );
    browserAPI.storage.local.set(
      event.data.settings as ExtensionStorageLoaded,
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
        } catch (error) {
          debug(
            "browserSettingsBridge][contentScript",
            "Error updating settings:",
            { error, settings: event.data.settings },
          );
        }
      },
    );
  }
});
