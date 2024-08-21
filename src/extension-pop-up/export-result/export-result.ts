import { browserAPI } from "../extension-pop-up.js";
import { scrollDownToNextSection, scrollToTop } from "./scrolling.js";
import {
  hideSelfTesterOverlay,
  restoreSelfTesterOverlay,
  showSelfTesterOverlay,
} from "./self-test-overlay.js";
import {
  checkStickyBannerAndOverlayIntegration,
  hideOrShowStickyBannerAndOverlay,
} from "./sovendus-overlay.js";
import {
  addDelayBetweenScreenshotOnChrome,
  copyScreenshotsToClipboard,
} from "./utils.js";

export async function exportResultsScreenshot(
  tabId: number,
  captureButton: HTMLElement,
  alertContainer: HTMLElement,
): Promise<void> {
  captureButton.innerText = "Copying In Progress...";

  const { ctx, screenshotContainer } = getScreenshotCanvas();
  await hideSelfTesterOverlay(tabId);
  const sovendusOverlayIntegration =
    await checkStickyBannerAndOverlayIntegration(tabId);
  const {
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
  } = await drawFullPageScreenshot(
    tabId,
    ctx,
    screenshotContainer,
    sovendusOverlayIntegration,
  );

  if (mobileDeviceEmulatorIsOverlappedByDevTools) {
    return abortEarlyAndSetErrorMessage(tabId, captureButton, alertContainer);
  }

  await copyScreenshotsToClipboard(screenshotContainer);

  if (mobileDeviceEmulatorZoomLevelSet) {
    setZoomDetectedWarningMessage(alertContainer);
  }
  if (sovendusOverlayIntegration) {
    await hideOrShowStickyBannerAndOverlay(false, tabId);
  }
  await restoreSelfTesterOverlay(tabId);
  setSuccessMessage(captureButton);
}

async function drawFullPageScreenshot(
  tabId: number,
  ctx: CanvasRenderingContext2D,
  screenshotContainer: HTMLCanvasElement,
  sovendusOverlayIntegration: boolean,
): Promise<{
  mobileDeviceEmulatorIsOverlappedByDevTools: boolean;
  mobileDeviceEmulatorZoomLevelSet: boolean;
}> {
  const {
    zoomAdjustedHeight,
    scrollHeight,
    viewPortHeight,
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
    zoomLevel,
    screenshotElementVerticalPosition,
  } = await getScreenShotDimensions(
    tabId,
    screenshotContainer,
    sovendusOverlayIntegration,
  );

  // skip when screenshot will be malformed
  if (!mobileDeviceEmulatorIsOverlappedByDevTools) {
    await scrollToTop(tabId);
    if (sovendusOverlayIntegration) {
      await createSovendusOverlayScreenshot(ctx, zoomAdjustedHeight);
      await hideOrShowStickyBannerAndOverlay(true, tabId);
      await addDelayBetweenScreenshotOnChrome();
    }
    await drawSegmentScreenshot({
      tabId,
      ctx,
      screenshotElementVerticalPosition,
      viewPortHeight,
      remainingScrollHeight: scrollHeight,
      zoomAdjustedHeight,
      zoomLevel,
    });

    await showSelfTesterOverlay(tabId);
    await createDebugInfoScreenshot(ctx);
  }
  return {
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
  };
}

async function drawSegmentScreenshot({
  tabId,
  ctx,
  screenshotElementVerticalPosition,
  viewPortHeight,
  remainingScrollHeight,
  zoomAdjustedHeight,
  zoomLevel,
}: {
  tabId: number;
  ctx: CanvasRenderingContext2D;
  screenshotElementVerticalPosition: number;
  viewPortHeight: number;
  remainingScrollHeight: number;
  zoomAdjustedHeight: number;
  zoomLevel: number;
}): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((screenshotDataUrl): void => {
      const screenshotImage = new Image();
      screenshotImage.src = screenshotDataUrl;
      screenshotImage.onload = async (): Promise<void> => {
        let newScreenshotElementVerticalPosition =
          screenshotElementVerticalPosition;
        if (remainingScrollHeight < viewPortHeight) {
          // last screenshot is not full page height,
          // shift a bit to the top to overwrite parts of the previous screenshot
          newScreenshotElementVerticalPosition =
            screenshotElementVerticalPosition +
            remainingScrollHeight * zoomLevel -
            zoomAdjustedHeight;
        }

        ctx.drawImage(
          screenshotImage,
          0,
          newScreenshotElementVerticalPosition,
          screenshotImage.width,
          screenshotImage.height,
        );

        newScreenshotElementVerticalPosition += zoomAdjustedHeight;
        remainingScrollHeight -= viewPortHeight;

        if (remainingScrollHeight > 0) {
          await scrollDownToNextSection(tabId, viewPortHeight);
          await addDelayBetweenScreenshotOnChrome();
          await drawSegmentScreenshot({
            tabId,
            ctx,
            screenshotElementVerticalPosition:
              newScreenshotElementVerticalPosition,
            viewPortHeight,
            remainingScrollHeight,
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

async function createSovendusOverlayScreenshot(
  ctx: CanvasRenderingContext2D,
  zoomAdjustedHeight: number,
): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((screenshotDataUrl) => {
      const screenshotImage = new Image();
      screenshotImage.src = screenshotDataUrl;
      screenshotImage.onload = (): void => {
        ctx.drawImage(
          screenshotImage,
          0,
          zoomAdjustedHeight,
          screenshotImage.width,
          screenshotImage.height,
        );
        resolve();
      };
    });
  });
}

async function createDebugInfoScreenshot(
  ctx: CanvasRenderingContext2D,
): Promise<void> {
  await addDelayBetweenScreenshotOnChrome();
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab((screenshotDataUrl) => {
      const screenshotImage = new Image();
      screenshotImage.src = screenshotDataUrl;
      screenshotImage.onload = (): void => {
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

async function getScreenShotDimensions(
  tabId: number,
  screenshotContainer: HTMLCanvasElement,
  sovendusOverlayIntegration: boolean,
): Promise<{
  zoomAdjustedHeight: number;
  scrollHeight: number;
  viewPortHeight: number;
  mobileDeviceEmulatorIsOverlappedByDevTools: boolean;
  mobileDeviceEmulatorZoomLevelSet: boolean;
  zoomLevel: number;
  screenshotElementVerticalPosition: number;
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

  let screenshotElementVerticalPosition: number;
  if (sovendusOverlayIntegration) {
    // Adjust canvas size considering the zoom factor
    screenshotContainer.height =
      scrollHeight * zoomLevelWidth + zoomAdjustedHeight * 2;
    screenshotContainer.width = zoomAdjustedWidth;
    screenshotElementVerticalPosition = zoomAdjustedHeight * 2;
  } else {
    // Adjust canvas size considering the zoom factor
    screenshotContainer.height =
      scrollHeight * zoomLevelWidth + zoomAdjustedHeight;
    screenshotContainer.width = zoomAdjustedWidth;
    screenshotElementVerticalPosition = zoomAdjustedHeight;
  }

  console.log({
    zoomAdjustedHeight,
    scrollHeight,
    viewPortHeight,
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
    zoomLevel: zoomLevelWidth,
    screenshotElementVerticalPosition,
  });

  return {
    zoomAdjustedHeight,
    scrollHeight,
    viewPortHeight,
    mobileDeviceEmulatorIsOverlappedByDevTools,
    mobileDeviceEmulatorZoomLevelSet,
    zoomLevel: zoomLevelWidth,
    screenshotElementVerticalPosition,
  };
}

async function getScrollableHeight(tabId: number): Promise<{
  scrollHeight: number;
  viewPortHeight: number;
  viewPortWidth: number;
}> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (): {
      scrollHeight: number;
      viewPortHeight: number;
      viewPortWidth: number;
    } => {
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
  if (!result?.[0]?.result) {
    throw new Error("Failed to get window dimension");
  }
  const { scrollHeight, viewPortHeight, viewPortWidth } = result[0].result;
  return { scrollHeight, viewPortHeight, viewPortWidth };
}

async function getZoomAdjustedDimensions(): Promise<{
  width: number;
  height: number;
}> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab({ format: "png" }, (screenshotDataUrl) => {
      const img = new Image();
      img.src = screenshotDataUrl;
      img.onload = (): void => {
        resolve({ width: img.width, height: img.height });
      };
    });
  });
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

async function abortEarlyAndSetErrorMessage(
  tabId: number,
  captureButton: HTMLElement,
  alertContainer: HTMLElement,
): Promise<void> {
  captureButton.innerText = "Failed to copy";
  captureButton.style.background = "red";
  captureButton.style.color = "white";
  alertContainer.innerText =
    "Error: The mobile device emulation window can not be overlapped by the developer console.";
  alertContainer.style.display = "block";
  await restoreSelfTesterOverlay(tabId);
}

function setZoomDetectedWarningMessage(alertContainer: HTMLElement): void {
  alertContainer.innerText =
    "Warning: Zoom detected, the screenshot might be blurry. Set the zoom to 100% if possible!";
  alertContainer.style.display = "block";
  alertContainer.style.background = "orange";
}

function setSuccessMessage(captureButton: HTMLElement): void {
  captureButton.innerText = "Copy Test Result Again";
  captureButton.style.background = "green";
  captureButton.style.color = "white";
}
