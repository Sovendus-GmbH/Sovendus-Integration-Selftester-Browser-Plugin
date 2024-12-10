import { browserAPI } from "./extensionPopUp.js";

export async function checkAvailableIntegrations(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    func: () => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        chrome.runtime.getURL(
          "/extension-pop-up/available-integration-script.js",
        ),
      );
      script.type = "module";
      document.body.appendChild(script);
    },
  });
}
