import { browserAPI } from "../browser-api";
import {
  hideSelfTesterOverlay,
  restoreSelfTesterOverlay,
} from "./integration-test-overlay";
import { scrollDownToNextSection, scrollToTop } from "./scrolling";
import {
  checkStickyBannerAndOverlayIntegration,
  hideOrShowStickyBannerAndOverlay,
} from "./sovendus-overlay";
import { addDelayBetweenScreenshotOnChrome } from "./utils";

export async function createFullPageScreenShot(tabId: number): Promise<{
  screenShotUri?: string;
  success: boolean;
  errorMessage: string | undefined;
}> {
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
    return {
      success: false,
      errorMessage:
        "Error: The mobile device emulation window can not be overlapped by the developer console.",
    };
  }

  // await copyScreenshotsToClipboard(screenshotContainer);
  let errorMessage: string | undefined = undefined;
  if (mobileDeviceEmulatorZoomLevelSet) {
    errorMessage =
      "Warning: Zoom detected, the screenshot might be blurry. Set the zoom to 100% if possible!";
  }
  if (sovendusOverlayIntegration) {
    await hideOrShowStickyBannerAndOverlay(false, tabId);
  }
  await restoreSelfTesterOverlay(tabId);
  const blob = await screenshotContainer.convertToBlob();
  const reader = new FileReader();
  const screenshotUrl = await new Promise<string>(
    (resolve: (value: string) => void) => {
      reader.onloadend = (): void => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        }
      };
      reader.readAsDataURL(blob);
    },
  );
  return {
    success: true,
    screenShotUri: screenshotUrl,
    errorMessage,
  };
}

async function drawFullPageScreenshot(
  tabId: number,
  ctx: OffscreenCanvasRenderingContext2D,
  screenshotContainer: OffscreenCanvas,
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
  ctx: OffscreenCanvasRenderingContext2D;
  screenshotElementVerticalPosition: number;
  viewPortHeight: number;
  remainingScrollHeight: number;
  zoomAdjustedHeight: number;
  zoomLevel: number;
}): Promise<void> {
  return new Promise((resolve) => {
    chrome.tabs.captureVisibleTab(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (screenshotDataUrl): Promise<void> => {
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();
        const screenshotImage = await createImageBitmap(blob);

        let newScreenshotElementVerticalPosition =
          screenshotElementVerticalPosition;

        if (remainingScrollHeight < viewPortHeight) {
          // last screenshot is not full page height,
          // trim the part of the last screenshot out to not overlap them
          ctx.drawImage(
            screenshotImage,
            0,
            screenshotImage.height - remainingScrollHeight * zoomLevel,
            screenshotImage.width,
            screenshotImage.height,
            0,
            newScreenshotElementVerticalPosition,
            screenshotImage.width,
            screenshotImage.height,
          );
        } else {
          ctx.drawImage(
            screenshotImage,
            0,
            newScreenshotElementVerticalPosition,
            screenshotImage.width,
            screenshotImage.height,
          );
        }

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
      },
    );
  });
}

async function createSovendusOverlayScreenshot(
  ctx: OffscreenCanvasRenderingContext2D,
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

async function getScreenShotDimensions(
  tabId: number,
  screenshotContainer: OffscreenCanvas,
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

  const mobileDeviceEmulatorZoomLevelSet = zoomLevelWidth < 0.9;

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
    chrome.tabs.captureVisibleTab(
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      async (screenshotDataUrl) => {
        const response = await fetch(screenshotDataUrl);
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        resolve({ width: bitmap.width, height: bitmap.height });
      },
    );
  });
}

function getScreenshotCanvas(): {
  screenshotContainer: OffscreenCanvas;
  ctx: OffscreenCanvasRenderingContext2D;
} {
  const screenshotContainer: OffscreenCanvas = new OffscreenCanvas(1, 1);
  const ctx: OffscreenCanvasRenderingContext2D = screenshotContainer.getContext(
    "2d",
  ) as OffscreenCanvasRenderingContext2D;
  if (!ctx || !screenshotContainer) {
    throw new Error("No screenshot canvas found");
  }
  return { ctx, screenshotContainer };
}
