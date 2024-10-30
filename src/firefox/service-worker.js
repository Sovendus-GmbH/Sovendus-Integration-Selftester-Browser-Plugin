browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    browser.tabs.executeScript(tabId, {
      file: "integration-tester-ui/browser-extension-ui-script-loader.js",
    });
  }
});
