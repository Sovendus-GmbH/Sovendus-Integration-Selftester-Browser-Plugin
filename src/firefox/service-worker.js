// setupBenefitsApiCapture is provided by shared/benefits-api-capture.js, which
// is listed before this file in the manifest's background.scripts array.

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete") {
    browser.tabs.executeScript(tabId, {
      file: "page-banner/self-test-overlay-script-loader.js",
    });
  }
});

// Capture the Sovendus Benefits API request so the overlay can validate
// sandboxed integrations (e.g. Shopify) where the page globals never appear.
setupBenefitsApiCapture(browser);
