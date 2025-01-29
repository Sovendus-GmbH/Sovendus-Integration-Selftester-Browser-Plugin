import { debug } from "../logger/logger";
import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import { startIntegrationTester } from "./integrationTesterLoader";

export interface ExtensionSettings {
  transmitTestResult: boolean;
  blacklist: string[];
}

async function initializeExtension(): Promise<void> {
  debug("browserExtensionLoader", "Starting integration tester");

  async function getSettings(): Promise<ExtensionSettings> {
    return new Promise((resolve) => {
      debug("browserExtensionLoader", "Requesting settings from browser");
      window.postMessage({ type: "GET_SETTINGS" }, "*");
      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "SETTINGS_RESPONSE") {
          debug(
            "browserExtensionLoader",
            "Received settings from browser",
            event.data.settings,
          );
          window.removeEventListener("message", messageHandler);
          resolve(event.data.settings);
        }
      };

      window.addEventListener("message", messageHandler);
    });
  }

  async function updateSettings(
    newSettings: Partial<ExtensionSettings>,
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

      const messageHandler = (event: MessageEvent) => {
        if (event.data.type === "SETTINGS_UPDATE_RESPONSE") {
          window.removeEventListener("message", messageHandler);
          debug(
            "browserExtensionLoader",
            "Success updating settings from browser",
            newSettings,
          );
          resolve(event.data.success);
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
