import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import { startIntegrationTester } from "../integration-tester-loader/integrationTesterLoader";
import type {
  ExtensionSettingsEvent,
  ExtensionStorage,
} from "../integration-tester-ui/testing-storage";
import { debugExtensionLoader } from "../logger/extension-loader-logger";
import { error } from "../logger/logger";

async function initializeExtension(): Promise<void> {
  debugExtensionLoader("initializeExtension", "Starting integration tester");

  async function getSettings(): Promise<ExtensionStorage> {
    return new Promise((resolve) => {
      const messageHandler = (event: ExtensionSettingsEvent): void => {
        if (event.data.type === "GET_SETTINGS_RESPONSE") {
          debugExtensionLoader(
            "getSettings",
            "Received settings from browser",
            event.data.settings,
          );
          window.removeEventListener("message", messageHandler);
          resolve(event.data.settings as ExtensionStorage);
        }
      };
      window.addEventListener("message", messageHandler);
      debugExtensionLoader("getSettings", "Requesting settings from browser");
      window.postMessage({ type: "GET_SETTINGS" }, "*");
      debugExtensionLoader("getSettings", "Requested settings from browser");
    });
  }

  async function takeScreenshot(): Promise<string> {
    return new Promise((resolve) => {
      const messageHandler = (event: ExtensionSettingsEvent): void => {
        if (event.data.type === "TAKE_SCREENSHOT_RESPONSE") {
          if (event.data.success) {
            debugExtensionLoader(
              "takeScreenshot",
              "Screenshot received from browser",
              event.data.settings,
            );
            window.removeEventListener("message", messageHandler);
            resolve(event.data.screenshotUrl as string);
          } else {
            error("takeScreenshot", "Screenshot request failed", event.data);
            window.removeEventListener("message", messageHandler);
            resolve("");
          }
        }
      };
      window.addEventListener("message", messageHandler);
      debugExtensionLoader(
        "takeScreenshot",
        "Requesting screenshot from browser",
      );
      window.postMessage({ type: "TAKE_SCREENSHOT" }, "*");
      debugExtensionLoader(
        "takeScreenshot",
        "Requested screenshot from browser",
      );
    });
  }

  async function updateSettings(
    newSettings: Partial<ExtensionStorage>,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      debugExtensionLoader(
        "updateSettings",
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
          debugExtensionLoader(
            "updateSettings",
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
  startIntegrationTester(settings, getSettings, updateSettings, takeScreenshot);
}

void initializeExtension();

declare let window: SovSelfTesterWindow;
