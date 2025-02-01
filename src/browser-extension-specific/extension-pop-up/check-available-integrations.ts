import { browserAPI } from "../browser-api";

export async function checkAvailableIntegrations(tabId: number): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    func: () => {
      const script = document.createElement("script");
      script.setAttribute("type", "text/javascript");
      script.setAttribute(
        "src",
        // TODO FIX
        chrome.runtime.getURL("/availableIntegrationScript.js"),
      );
      script.type = "module";
      document.body.appendChild(script);
    },
  });
}
