function injectScript(): void {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute(
    "src",
    chrome.runtime.getURL("/page-banner/self-test-overlay.js"),
  );
  script.type = "module";
  document.body.appendChild(script);
}

function setupBenefitsApiBridge(): void {
  window.addEventListener("message", (event: MessageEvent): void => {
    if (
      event.source !== window ||
      event.data?.type !== "getSovendusBenefitsApiRequest"
    ) {
      return;
    }
    chrome.runtime.sendMessage(
      { type: "getSovendusBenefitsApiRequest" },
      (response) => {
        window.postMessage(
          {
            type: "sovendusBenefitsApiRequestResponse",
            payload: response?.payload ?? null,
          },
          "*",
        );
      },
    );
  });
}

if (!window.didLoad) {
  window.didLoad = true;
  setupBenefitsApiBridge();
  injectScript();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface Window {
  didLoad: boolean;
}
