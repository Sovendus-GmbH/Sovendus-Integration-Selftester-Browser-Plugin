document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById("capture-button");
  captureButton?.addEventListener("click", function () {
    captureButton.innerText = "Copying In Progress...";
    const { ctx, screenshotContainer } = getScreenshotCanvas();
    async function callback(tabs: chrome.tabs.Tab[]) {
      const tabId = getTabIdFromTabs(tabs);
      if (tabId) {
        await hideOverlay(tabId);
        drawFullPageScreenshot(tabId, ctx, screenshotContainer, async () => {
          await showOverlay(tabId);
          createDebugInfoScreenshot(ctx, async () => {
            copyScreenshotsToClipboard(screenshotContainer);
            if (captureButton) {
              captureButton.innerText = "Copy Test Result Again";
              captureButton.style.background = "green";
              captureButton.style.color = "white";
            }
            restoreOverlay(tabId);
          });
        });
      } else {
        throw new Error("Failed to get tabId for create screenshots function");
      }
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
  const hideButton = document.getElementById("hide-button");
  hideButton?.addEventListener("click", async function () {
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
  });
  const checkMethodsButton = document.getElementById("check-methods-button");
  checkMethodsButton?.addEventListener("click", async function () {
    async function callback(tabs: chrome.tabs.Tab[]) {
      const tabId = getTabIdFromTabs(tabs);
      if (tabId) {
        await checkAvailableIntegrations(tabId);
      } else {
        throw new Error(
          "Failed to get tabId for checkAvailableIntegrations function"
        );
      }
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
});

function getTabIdFromTabs(tabs: chrome.tabs.Tab[]) {
  const currentTab = tabs[0];
  return currentTab?.id;
}

function copyScreenshotsToClipboard(screenshotContainer: HTMLCanvasElement) {
  if (window.hasOwnProperty("ClipboardItem")) {
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

function createDebugInfoScreenshot(
  ctx: CanvasRenderingContext2D,
  onDone: () => void
): void {
  chrome.tabs.captureVisibleTab(function (screenshotDataUrl) {
    const screenshotImage = new Image();
    screenshotImage.src = screenshotDataUrl;
    screenshotImage.onload = () => {
      ctx.drawImage(
        screenshotImage,
        0,
        0,
        screenshotImage.width,
        screenshotImage.height
      );
      onDone();
    };
  });
}

async function drawFullPageScreenshot(
  tabId: number,
  ctx: CanvasRenderingContext2D,
  screenshotContainer: HTMLCanvasElement,
  onDone: () => void
) {
  getScrollableHeight(
    tabId,
    async (
      scrollHeight: number,
      viewPortHeight: number,
      viewPortWidth: number
    ) => {
      await scrollToTop(tabId);
      screenshotContainer.height = scrollHeight + viewPortHeight;
      screenshotContainer.width = viewPortWidth;
      let remainingScrollHeight = scrollHeight;
      let imageDrawHeight = viewPortHeight;
      await drawSegmentScreenshot({
        tabId,
        ctx,
        imageDrawHeight,
        viewPortHeight,
        remainingScrollHeight,
        onDone,
      });
    }
  );
}

async function drawSegmentScreenshot({
  tabId,
  ctx,
  imageDrawHeight,
  viewPortHeight,
  remainingScrollHeight,
  onDone,
}: {
  tabId: number;
  ctx: CanvasRenderingContext2D;
  imageDrawHeight: number;
  viewPortHeight: number;
  remainingScrollHeight: number;
  onDone: () => void;
}) {
  // wait a second as captureVisibleTab only supports once per second on chrome
  // TODO don't do that on firefox
  await new Promise((r) => setTimeout(r, 1000));
  chrome.tabs.captureVisibleTab(async (screenshotDataUrl) => {
    const screenshotImage = new Image();
    screenshotImage.src = screenshotDataUrl;
    screenshotImage.onload = async () => {
      let imagePosition = imageDrawHeight;
      if (remainingScrollHeight < viewPortHeight) {
        imagePosition =
          imageDrawHeight + remainingScrollHeight - viewPortHeight;
      }
      ctx.drawImage(
        screenshotImage,
        0,
        imagePosition,
        screenshotImage.width,
        screenshotImage.height
      );
      console.log({
        tabId,
        ctx,
        imageDrawHeight,
        viewPortHeight,
        remainingScrollHeight,
        onDone,
      });
      imageDrawHeight += viewPortHeight;
      remainingScrollHeight -= viewPortHeight;
      await scrollDownToNextSection(tabId, viewPortHeight);
      if (remainingScrollHeight > 0) {
        await drawSegmentScreenshot({
          tabId,
          ctx,
          imageDrawHeight,
          viewPortHeight,
          remainingScrollHeight,
          onDone,
        });
      } else {
        await scrollToTop(tabId);
        onDone();
      }
    };
  });
}

async function scrollToTop(tabId: number) {
  await executeScriptOnPage(tabId, async () => {
    window.scrollTo(0, 0);
  });
}

function getScrollableHeight(
  tabId: number,
  callback: (
    scrollHeight: number,
    viewPortHeight: number,
    viewPortWidth: number
  ) => Promise<void>
) {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      world: "MAIN",
      func: async (): Promise<[number, number, number]> => {
        const body = document.body,
          html = document.documentElement;
        const height = Math.max(
          body.scrollHeight,
          body.offsetHeight,
          html.clientHeight,
          html.scrollHeight,
          html.offsetHeight
        );
        return [height, window.innerHeight, window.innerWidth];
      },
    },
    (results: chrome.scripting.InjectionResult<[number, number, number]>[]) => {
      if (!results?.[0]?.result) {
        throw new Error("Failed to get scrollable height");
      }
      const [scrollHeight, viewPortHeight, viewPortWidth] = results[0].result;
      callback(scrollHeight, viewPortHeight, viewPortWidth);
    }
  );
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

async function executeScriptOnPage(
  tabId: number,
  pageFunction: () => Promise<void>
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
  const screenshotContainer = document.getElementById(
    "screenshot-canvas"
  ) as HTMLCanvasElement | null;
  const ctx = screenshotContainer?.getContext("2d");
  if (!ctx || !screenshotContainer) {
    throw new Error("No screenshot canvas found");
  }
  return { ctx, screenshotContainer };
}

async function checkAvailableIntegrations(tabId: number) {
  console.log("test1");
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/check-available-integrations.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
