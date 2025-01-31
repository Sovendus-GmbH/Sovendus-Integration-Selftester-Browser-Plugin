import { browserAPI } from "./browser-api";

// interface ExtensionSettings {
//   transmitTestResult: boolean;
//   blacklist: string[];
// }

// const defaultSettings: ExtensionSettings = {
//   transmitTestResult: false,
//   blacklist: [],
// };

// chrome.runtime.onMessage.addListener(
//   (message: ExtensionSettingsEvent, sender) => {
//     console.log("hello", message, sender);
//     const tabId = sender.tab?.id;
//     if (!tabId) {
//       return;
//     }

//     if (message.type === "GET_SETTINGS") {
//       browserAPI.storage.local.get(defaultSettings, (settings) => {
//         void browserAPI.tabs.sendMessage(tabId, {
//           type: "SETTINGS_RESPONSE",
//           settings,
//         });
//         debug(
//           "browserSettingsBridge][serviceWorker",
//           "Received settings request from page and sent back:",
//           settings,
//         );
//       });
//     } else if (message.type === "UPDATE_SETTINGS") {
//       chrome.storage.local.set(
//         message.data.settings as ExtensionSettings,
//         () => {
//           void browserAPI.tabs.sendMessage(tabId, {
//             type: "SETTINGS_UPDATE_RESPONSE",
//             success: true,
//           });
//           debug(
//             "browserSettingsBridge][serviceWorker",
//             "Received update settings request from page:",
//             message.data.settings,
//           );
//         },
//       );
//     }
//   },
// );

const url = browserAPI.runtime.getURL("/browserExtensionLoader.js");
browserAPI.webNavigation.onDOMContentLoaded.addListener(({ tabId }) => {
  void browserAPI.scripting.executeScript({
    target: { tabId },
    args: [url],
    func: injectScriptFn,
  });
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ServiceWorkerWindow extends Window {
  didLoad: boolean;
}

declare const window: ServiceWorkerWindow;
