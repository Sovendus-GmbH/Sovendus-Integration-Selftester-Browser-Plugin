import { browserAPI } from "./browser-api";

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
