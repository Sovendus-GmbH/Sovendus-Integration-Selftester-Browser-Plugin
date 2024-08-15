import '../page-banner/screenshotCreator.js';

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["page-banner/self-test-overlay-script-loader.js"],
  });
});
