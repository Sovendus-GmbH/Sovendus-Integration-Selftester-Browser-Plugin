document.addEventListener("DOMContentLoaded", () => {
  const captureButton = document.getElementById(
    "capture-button",
  ) as HTMLElement;
  captureButton.addEventListener("click", () =>
    copyTestResultClick(captureButton),
  );
  const hideButton = document.getElementById("hide-button") as HTMLElement;
  hideButton.addEventListener("click", hideOverlayClick);
  const checkMethodsButton = document.getElementById(
    "check-methods-button",
  ) as HTMLElement;
  checkMethodsButton.addEventListener("click", checkAvailableIntegrationsClick);
});

function copyTestResultClick(captureButton: HTMLElement) {
  captureButton.innerText = "Copying In Progress...";
  const { ctx, screenshotContainer } = getScreenshotCanvas();
  async function callback(tabs: chrome.tabs.Tab[]) {
    const tabId = getTabIdFromTabs(tabs);
    if (tabId) {
      await hideOverlay(tabId);
      const {
        mobileDeviceEmulatorIsOverlappedByDevTools,
        mobileDeviceEmulatorZoomLevelSet,
      } = await drawFullPageScreenshot(tabId, ctx, screenshotContainer);
      const alertContainer = document.getElementById("alertContainer");
      if (mobileDeviceEmulatorIsOverlappedByDevTools) {
        if (captureButton) {
          captureButton.innerText = "Failed to copy";
          captureButton.style.background = "red";
          captureButton.style.color = "white";
        }
        alertContainer.innerText =
          "Error: The mobile device emulation window can not be overlapped by the developer console.";
        alertContainer.style.display = "block";
        restoreOverlay(tabId);
        return;
      }
      await showOverlay(tabId);
      await createDebugInfoScreenshot(ctx);
      copyScreenshotsToClipboard(screenshotContainer);
      if (captureButton) {
        captureButton.innerText = "Copy Test Result Again";
        captureButton.style.background = "green";
        captureButton.style.color = "white";
      }
      if (mobileDeviceEmulatorZoomLevelSet) {
        alertContainer.innerText =
          "Warning: Zoom detected, the screenshot might be blurry. Set the zoom to 100% if possible!";
        alertContainer.style.display = "block";
        alertContainer.style.background = "orange";
      }
      restoreOverlay(tabId);
    } else {
      throw new Error("Failed to get tabId for create screenshots function");
    }
  }
  const query = { active: true, currentWindow: true };
  chrome.tabs.query(query, callback);
}

function hideOverlayClick() {
  async function callback(tabs: chrome.tabs.Tab[]) {
    const tabId = getTabIdFromTabs(tabs);
    if (tabId) {
      toggleOverlayVisibility(tabId);
    } else {
      throw new Error("Failed to get tabId to toggle overlay visibility");
    }
  }
  const query = { active: true, currentWindow: true };
  chrome.tabs.query(query, callback);
}

function checkAvailableIntegrationsClick() {
  async function callback(tabs: chrome.tabs.Tab[]) {
    const tabId = getTabIdFromTabs(tabs);
    if (tabId) {
      await checkAvailableIntegrations(tabId);
    } else {
      throw new Error(
        "Failed to get tabId for checkAvailableIntegrations function",
      );
    }
  }
  const query = { active: true, currentWindow: true };
  chrome.tabs.query(query, callback);
}

function getTabIdFromTabs(tabs: chrome.tabs.Tab[]) {
  const currentTab = tabs[0];
  return currentTab?.id;
}

function copyScreenshotsToClipboard(screenshotContainer: HTMLCanvasElement) {
  if (window.ClipboardItem) {
    screenshotContainer.toBlob((blob: Blob | null) => {
      if (!blob) {
        throw new Error("Failed to save to clipboard");
      }
      const data = [new ClipboardItem({ [blob.type]: blob })];
      navigator.clipboard.write(data);
    });
  } else {
    fetch(screenshotContainer.toDataURL())
      .then((response) => response.arrayBuffer())
      .then((buffer) => browser.clipboard.setImageData(buffer, "png"));
  }
}

async function createDebugInfoScreenshot(
  ctx: CanvasRenderingContext2D,
): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((screenshotDataUrl) => {
      const screenshotImage = new Image();
      screenshotImage.src = screenshotDataUrl;
      screenshotImage.onload = () => {
        ctx.drawImage(
          screenshotImage,
          0,
          0,
          screenshotImage.width,
          screenshotImage.height,
        );
        resolve();
      };
    });
  });
}

async function drawFullPageScreenshot(
  tabId: number,
  ctx: CanvasRenderingContext2D,
  screenshotContainer: HTMLCanvasElement,
): Promise<{
  mobileDeviceEmulatorIsOverlappedByDevTools: boolean;
  mobileDeviceEmulatorZoomLevelSet: boolean;
}> {
  const {
    zoomAdjustedWidth,
    zoomAdjustedHeight,
    scrollHeight,
    viewPortHeight,
    viewPortWidth,
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
    zoomLevel,
  } = await getScreenShotDimensions(tabId);
  // skip when screenshot will be malformed
  if (!mobileDeviceEmulatorIsOverlappedByDevTools) {
    await scrollToTop(tabId);
    console.log(
      "zoomAdjustedWidth",
      zoomAdjustedWidth,
      "zoomAdjustedHeight",
      zoomAdjustedHeight,
      "scrollHeight",
      scrollHeight,
      "viewPortHeight",
      viewPortHeight,
      "viewPortWidth",
      viewPortWidth,
      "mobileDeviceEmulatorIsOverlappedByDevTools",
      mobileDeviceEmulatorIsOverlappedByDevTools,
      "mobileDeviceEmulatorZoomLevelSet",
      mobileDeviceEmulatorZoomLevelSet,
      "zoomLevel",
      zoomLevel,
    );

    // Adjust canvas size considering the zoom factor
    screenshotContainer.height = scrollHeight * zoomLevel + zoomAdjustedHeight;
    screenshotContainer.width = zoomAdjustedWidth;

    const remainingScrollHeight = scrollHeight;
    const imageDrawHeight = zoomAdjustedHeight;

    await drawSegmentScreenshot({
      tabId,
      ctx,
      imageDrawHeight,
      viewPortHeight,
      remainingScrollHeight,
      zoomAdjustedWidth,
      zoomAdjustedHeight,
      zoomLevel,
    });
  }
  return {
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
  };
}

async function drawSegmentScreenshot({
  tabId,
  ctx,
  imageDrawHeight,
  viewPortHeight,
  remainingScrollHeight,
  zoomAdjustedWidth,
  zoomAdjustedHeight,
  zoomLevel,
}: {
  tabId: number;
  ctx: CanvasRenderingContext2D;
  imageDrawHeight: number;
  viewPortHeight: number;
  remainingScrollHeight: number;
  zoomAdjustedWidth: number;
  zoomAdjustedHeight: number;
  zoomLevel: number;
}): Promise<void> {
  // wait a second as captureVisibleTab only supports once per second on chrome
  // TODO don't do that on firefox
  await new Promise((r) => setTimeout(r, 1000));

  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(async (screenshotDataUrl) => {
      const screenshotImage = new Image();
      screenshotImage.src = screenshotDataUrl;
      screenshotImage.onload = async () => {
        let imagePosition = imageDrawHeight;
        if (remainingScrollHeight < viewPortHeight) {
          imagePosition =
            imageDrawHeight +
            remainingScrollHeight * zoomLevel -
            zoomAdjustedHeight;
        }

        // Draw the image using the zoom-adjusted dimensions
        ctx.drawImage(
          screenshotImage,
          0,
          imagePosition,
          zoomAdjustedWidth,
          zoomAdjustedHeight,
        );

        imageDrawHeight += zoomAdjustedHeight;
        remainingScrollHeight -= viewPortHeight;

        await scrollDownToNextSection(tabId, viewPortHeight);
        if (remainingScrollHeight > 0) {
          await drawSegmentScreenshot({
            tabId,
            ctx,
            imageDrawHeight,
            viewPortHeight,
            remainingScrollHeight,
            zoomAdjustedWidth,
            zoomAdjustedHeight,
            zoomLevel,
          });
        } else {
          await scrollToTop(tabId);
        }
        resolve();
      };
    });
  });
}

async function scrollToTop(tabId: number) {
  await executeScriptOnPage(tabId, async () => {
    window.scrollTo(0, 0);
  });
}

async function getScreenShotDimensions(tabId: number): Promise<{
  zoomAdjustedWidth: number;
  zoomAdjustedHeight: number;
  scrollHeight: number;
  viewPortHeight: number;
  viewPortWidth: number;
  mobileDeviceEmulatorIsOverlappedByDevTools: boolean;
  mobileDeviceEmulatorZoomLevelSet: boolean;
  zoomLevel: number;
}> {
  const { width: zoomAdjustedWidth, height: zoomAdjustedHeight } =
    await getZoomAdjustedDimensions();

  const { scrollHeight, viewPortHeight, viewPortWidth } =
    await getScrollableHeight(tabId);

  const zoomLevelHeight = zoomAdjustedHeight / viewPortHeight;
  const zoomLevelWidth = zoomAdjustedWidth / viewPortWidth;

  // Calculate the percentage difference between height and width to check if dev tools are overlapping the mobile device emulator window
  const percentageDifference = zoomLevelWidth - zoomLevelHeight;
  const mobileDeviceEmulatorIsOverlappedByDevTools =
    percentageDifference > 0.01;

  const mobileDeviceEmulatorZoomLevelSet = zoomLevelWidth < 0.95;

  return {
    zoomAdjustedWidth,
    zoomAdjustedHeight,
    scrollHeight,
    viewPortHeight,
    viewPortWidth,
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
    zoomLevel: zoomLevelWidth,
  };
}

async function getScrollableHeight(tabId: number): Promise<{
  scrollHeight: number;
  viewPortHeight: number;
  viewPortWidth: number;
}> {
  const result = await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: async (): Promise<{
      scrollHeight: number;
      viewPortHeight: number;
      viewPortWidth: number;
    }> => {
      const body = document.body;
      const html = document.documentElement;
      const scrollHeight = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight,
      );
      return {
        scrollHeight,
        viewPortHeight: window.innerHeight,
        viewPortWidth: window.innerWidth,
      };
    },
  });
  const { scrollHeight, viewPortHeight, viewPortWidth } = result[0].result;
  return { scrollHeight, viewPortHeight, viewPortWidth };
}

async function scrollDownToNextSection(tabId: number, scrollBy: number) {
  await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [scrollBy],
    func: async (scrollBy) => {
      window.scrollBy(0, scrollBy);
    },
  });
}

async function getZoomAdjustedDimensions(): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab({ format: "png" }, (screenshotDataUrl) => {
      const img = new Image();
      img.src = screenshotDataUrl;
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
    });
  });
}

async function executeScriptOnPage(
  tabId: number,
  pageFunction: () => Promise<void>,
): Promise<void> {
  await chrome.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: pageFunction,
  });
  return undefined;
}

async function toggleOverlayVisibility(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/self-test-overlay-toggle.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function showOverlay(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/self-test-overlay-show.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function restoreOverlay(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/self-test-overlay-restore.js"],
  });
}

async function hideOverlay(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/self-test-overlay-hide.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function getScreenshotCanvas(): {
  ctx: CanvasRenderingContext2D;
  screenshotContainer: HTMLCanvasElement;
} {
  const screenshotContainer: HTMLCanvasElement = document.getElementById(
    "screenshot-canvas",
  ) as HTMLCanvasElement;
  const ctx = screenshotContainer.getContext("2d") as CanvasRenderingContext2D;
  if (!ctx || !screenshotContainer) {
    throw new Error("No screenshot canvas found");
  }
  return { ctx, screenshotContainer };
}

async function checkAvailableIntegrations(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/check-available-integrations.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
