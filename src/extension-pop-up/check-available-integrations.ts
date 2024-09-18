import { browserAPI } from "./extension-pop-up.js";

export async function checkAvailableIntegrations(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    func: () => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        chrome.runtime.getURL("/extension-pop-up/test-integration.js"),
      );
      script.type = "module";
      document.body.appendChild(script);
    },
  });
}
