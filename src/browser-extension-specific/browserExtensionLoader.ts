import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import { startIntegrationTester } from "../integration-tester-loader/integrationTesterLoader";
import type {
  ExtensionSettingsEvent,
  ExtensionStorage,
} from "../integration-tester-ui/testing-storage";
import { debug } from "../logger/logger";

async function initializeExtension(): Promise<void> {
  debug("browserExtensionLoader", "Starting integration tester");

  async function getSettings(): Promise<ExtensionStorage> {
    return new Promise((resolve) => {
      const messageHandler = (event: ExtensionSettingsEvent): void => {
        if (event.data.type === "GET_SETTINGS_RESPONSE") {
          debug(
            "browserSettingsBridge][browserExtensionLoader",
            "Received settings from browser",
            event.data.settings,
          );
          window.removeEventListener("message", messageHandler);
          resolve(event.data.settings as ExtensionStorage);
        }
      };
      window.addEventListener("message", messageHandler);
      debug(
        "browserSettingsBridge][browserExtensionLoader",
        "Requesting settings from browser",
      );
      window.postMessage({ type: "GET_SETTINGS" }, "*");
      debug(
        "browserSettingsBridge][browserExtensionLoader",
        "Requested settings from browser",
      );
    });
  }

  async function updateSettings(
    newSettings: Partial<ExtensionStorage>,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      debug(
        "browserSettingsBridge][browserExtensionLoader",
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
        if (event.data.type === "UPDATE_SETTINGS_RESPONSE") {
          window.removeEventListener("message", messageHandler);
          debug(
            "browserSettingsBridge][browserExtensionLoader",
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
  startIntegrationTester(settings, getSettings, updateSettings);
}

void initializeExtension();

declare let window: SovSelfTesterWindow;
