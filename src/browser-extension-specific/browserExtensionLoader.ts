import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import { startIntegrationTester } from "../integration-tester-loader/integrationTesterLoader";
import { debug } from "../logger/logger";
import type { ExtensionSettingsEvent, ExtensionStorage } from "./types";

async function initializeExtension(): Promise<void> {
  debug("browserExtensionLoader", "Starting integration tester");

  async function getSettings(): Promise<ExtensionStorage> {
    return new Promise((resolve) => {
      debug("browserExtensionLoader", "Requesting settings from browser");
      window.postMessage({ type: "GET_SETTINGS" }, "*");
      const messageHandler = (event: ExtensionSettingsEvent): void => {
        if (event.data.type === "SETTINGS_RESPONSE") {
          debug(
            "browserExtensionLoader",
            "Received settings from browser",
            event.data.settings,
          );
          window.removeEventListener("message", messageHandler);
          resolve(event.data.settings as ExtensionStorage);
        }
      };

      window.addEventListener("message", messageHandler);
    });
  }

  async function updateSettings(
    newSettings: Partial<ExtensionStorage>,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      debug(
        "browserExtensionLoader",
        "Started updating settings from browser",
        newSettings,
      );

      window.postMessage(
        {
          type: "UPDATE_SETTINGS",
          settings: newSettings,
        },
        "*",
      );

      const messageHandler = (event: ExtensionSettingsEvent): void => {
        if (event.data.type === "SETTINGS_UPDATE_RESPONSE") {
          window.removeEventListener("message", messageHandler);
          debug(
            "browserExtensionLoader",
            "Success updating settings from browser",
            newSettings,
          );
          resolve(event.data.success || false);
        }
      };

      window.addEventListener("message", messageHandler);
    });
  }
  const settings = await getSettings();
  window.transmitTestResult = settings.transmitTestResult;
  void startIntegrationTester(settings, getSettings, updateSettings);
}

void initializeExtension();

declare let window: SovSelfTesterWindow;
