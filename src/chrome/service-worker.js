// Loads the shared benefits-api capture logic (defines setupBenefitsApiCapture).
importScripts("shared/benefits-api-capture.js");

chrome.webNavigation.onDOMContentLoaded.addListener(async ({ tabId }) => {
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ["page-banner/self-test-overlay-script-loader.js"],
  });
});

// Capture the Sovendus Benefits API request so the overlay can validate
// sandboxed integrations (e.g. Shopify) where the page globals never appear.
setupBenefitsApiCapture(chrome);
