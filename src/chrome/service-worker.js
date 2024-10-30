chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["integration-tester-ui/browser-extension-ui-script-loader.js"],
  });
});
