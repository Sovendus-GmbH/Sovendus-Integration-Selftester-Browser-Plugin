browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status == "complete") {
    browser.tabs.executeScript(tabId, {
      file: "page-banner/integration-test-overlay-script-loader.js",
    });
  }
});
