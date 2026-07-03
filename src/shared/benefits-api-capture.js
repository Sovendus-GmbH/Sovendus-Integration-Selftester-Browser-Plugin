// Benefits API capture — see README-for-devs.md ("Architecture") for details.
// Loaded as a classic script (Chrome importScripts(), Firefox background.scripts),
// so NO ES import/export. Exposes one global: setupBenefitsApiCapture(api).
// `api` is the WebExtension namespace: `chrome` on Chrome, `browser` on Firefox.
function setupBenefitsApiCapture(api) {
  // tabId -> parsed /v2/list request payload
  const capturedBenefitsApiRequests = {};

  api.webRequest.onBeforeRequest.addListener(
    (details) => {
      if (details.method !== "POST" || details.tabId < 0) {
        return;
      }
      const payload = parseRequestBody(details.requestBody);
      if (payload) {
        capturedBenefitsApiRequests[details.tabId] = payload;
      }
    },
    { urls: ["https://benefits-api.sovendus.com/v2/list*"] },
    ["requestBody"],
  );

  // Drop stale per-tab data on navigation or close.
  api.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      delete capturedBenefitsApiRequests[tabId];
    }
  });
  api.tabs.onRemoved.addListener((tabId) => {
    delete capturedBenefitsApiRequests[tabId];
  });

  // Serve the captured payload to the overlay via the content-script bridge.
  api.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "getSovendusBenefitsApiRequest") {
      const tabId = sender.tab?.id;
      sendResponse({
        payload:
          tabId === undefined
            ? null
            : (capturedBenefitsApiRequests[tabId] ?? null),
      });
    }
    return false;
  });

  function parseRequestBody(requestBody) {
    if (!requestBody) {
      return null;
    }
    // JSON / text bodies arrive as raw bytes.
    if (requestBody.raw?.[0]?.bytes) {
      try {
        const decoded = new TextDecoder("utf-8").decode(
          requestBody.raw[0].bytes,
        );
        return JSON.parse(decoded);
      } catch {
        return null;
      }
    }
    // application/x-www-form-urlencoded / multipart bodies arrive as formData.
    if (requestBody.formData) {
      const result = {};
      for (const [key, values] of Object.entries(requestBody.formData)) {
        result[key] = Array.isArray(values) ? values[0] : values;
      }
      return result;
    }
    return null;
  }
}
