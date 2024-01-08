chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ['self-test-overlay-script-loader.js'],
  });
});
