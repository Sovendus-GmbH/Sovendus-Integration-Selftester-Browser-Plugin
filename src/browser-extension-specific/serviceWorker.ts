import { error } from "../logger/logger";
import { debugWorker } from "../logger/worker-logger";
import { browserAPI } from "./browser-api";
import { createFullPageScreenShot } from "./take-screenshot/take-screenshot";
import type { ScreenShotRequest, ScreenShotResponse } from "./types";

const initializedTabs = new Map<
  number,
  {
    handler: ScreenshotHandler;
    messageHandler: (
      request: ScreenShotRequest,
      sender: chrome.runtime.MessageSender,
      sendResponse: (response?: ScreenShotResponse) => void,
    ) => void;
  }
>();

class ScreenshotHandler {
  private async takeScreenshot(
    tabId: number,
    sendResponse: (response?: ScreenShotResponse) => void,
  ): Promise<void> {
    try {
      debugWorker("Taking screenshot...", {
        tabId,
      });
      const screenshotResponse = await createFullPageScreenShot(tabId);
      debugWorker("Screenshot taken successfully");
      sendResponse(screenshotResponse);
      debugWorker("Sent screenshot to contentScript...", { success: true });
    } catch (e) {
      error("browserBridge][serviceWorker", "Error taking screenshot:", e);
      sendResponse({
        screenShotUri: "",
        errorMessage: e as string,
        success: false,
      });
    }
  }

  public async handleScreenshotRequest(
    request: ScreenShotRequest,
    tabId: number,
    sendResponse: (response?: ScreenShotResponse) => void,
  ): Promise<void> {
    debugWorker("Processing screenshot request", {
      action: request.action,
      tabId,
    });

    if (request.action === "TAKE_SCREENSHOT_SERVICE_WORKER") {
      debugWorker("Received take screenshot request...", { request });
      await this.takeScreenshot(tabId, sendResponse);
    } else {
      debugWorker("Ignoring unknown request action", {
        action: request.action,
      });
    }
  }
}

function serviceWorker({ tabId }: { tabId: number }): void {
  // If a service worker for this tab is already initialized, shut it down
  if (initializedTabs.has(tabId)) {
    debugWorker(
      "Service worker already initialized, shutting it down before reinitializing",
      { tabId },
    );
    const tab = initializedTabs.get(tabId);
    if (tab) {
      browserAPI.runtime.onMessage.removeListener(tab.messageHandler);
      initializedTabs.delete(tabId);
    }
  }

  debugWorker("Initializing service worker", {
    tabId,
  });

  const screenshotHandler = new ScreenshotHandler();

  const messageHandler = (
    request: ScreenShotRequest,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: ScreenShotResponse) => void,
  ): true => {
    debugWorker("Message handler called", {
      request,
    });
    void screenshotHandler.handleScreenshotRequest(
      request,
      tabId,
      sendResponse,
    );
    return true; // Indicates we'll respond asynchronously
  };

  // Store the new handlers
  initializedTabs.set(tabId, {
    handler: screenshotHandler,
    messageHandler,
  });

  // Setup message listener
  browserAPI.runtime.onMessage.addListener(messageHandler);

  // Inject content script
  void browserAPI.scripting.executeScript({
    target: { tabId },
    args: [browserAPI.runtime.getURL("/browserExtensionLoader.js")],
    func: injectScriptFn,
  });

  // Cleanup on tab close
  browserAPI.tabs.onRemoved.addListener((closedTabId) => {
    if (closedTabId === tabId) {
      const tab = initializedTabs.get(tabId);
      if (tab) {
        browserAPI.runtime.onMessage.removeListener(tab.messageHandler);
        initializedTabs.delete(tabId);
      }
    }
  });

  debugWorker("Setup complete");
}

function injectScriptFn(url: string): void {
  if (!window.didLoad) {
    window.didLoad = true;
    const script = document.createElement("script");
    script.setAttribute("type", "module");
    script.setAttribute("src", url);
    document.body.appendChild(script);
  }
}

// Setup navigation listener
browserAPI.webNavigation.onDOMContentLoaded.removeListener(serviceWorker);
browserAPI.webNavigation.onDOMContentLoaded.addListener(serviceWorker);

interface ServiceWorkerWindow extends Window {
  didLoad: boolean;
}

declare const window: ServiceWorkerWindow;
