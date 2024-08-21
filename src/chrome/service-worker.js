chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["page-banner/self-test-overlay-script-loader.js"],
  });
});
