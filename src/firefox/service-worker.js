browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    browser.tabs.executeScript(tabId, {
      file: "page-banner/self-test-overlay-script-loader.js",
    });
  }
});
