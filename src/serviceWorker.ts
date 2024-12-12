if (typeof browser === "undefined") {
  chrome.webNavigation.onDOMContentLoaded.addListener(({ tabId }) => {
    void chrome.scripting.executeScript({
      target: { tabId },
      func: injectScriptFn,
    });
  });
} else {
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "complete") {
      void chrome.scripting.executeScript({
        target: { tabId },
        func: injectScriptFn,
      });
    }
  });
}

function injectScriptFn(): void {
  console.log("Injecting script");
  function injectScript(): void {
    const script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute(
      "src",
      chrome.runtime.getURL("/browserExtensionLoader.js"),
    );
    script.type = "module";
    document.body.appendChild(script);
  }
  if (!window.didLoad) {
    window.didLoad = true;
    injectScript();
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  didLoad: boolean;
}
