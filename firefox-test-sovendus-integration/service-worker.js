browser.tabs.onUpdated.addListener(function (tabId, changeInfo) {
  if (changeInfo.status == "complete") {
    browser.tabs.executeScript(tabId, {
      file: "self-test-overlay-script-loader.js",
    });
  }
});
