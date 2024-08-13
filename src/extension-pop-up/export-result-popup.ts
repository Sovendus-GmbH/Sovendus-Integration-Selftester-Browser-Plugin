document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById(
    "capture-button",
  ) as HTMLElement;
  captureButton.addEventListener("click", function () {
    captureButton.innerText = "Copying In Progress...";
    const { ctx, screenshotContainer } = getScreenshotCanvas();
    async function callback(tabs: chrome.tabs.Tab[]) {
      const tabId = getTabIdFromTabs(tabs);
      if (tabId) {
        await showOverlay(tabId);
        createScreenshot(ctx, screenshotContainer, true, async () => {
          await hideOverlay(tabId);
          createScreenshot(ctx, screenshotContainer, false, () => {
            copyScreenshotsToClipboard(screenshotContainer);
            captureButton.innerText = "Copy Test Result Again";
            captureButton.style.background = "green";
            captureButton.style.color = "white";
            restoreOverlay(tabId);
          });
        });
      }
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
  const hideButton = document.getElementById("hide-button") as HTMLElement;
  hideButton.addEventListener("click", async function () {
    async function callback(tabs: chrome.tabs.Tab[]) {
      const tabId = getTabIdFromTabs(tabs);
      if (tabId) {
        toggleOverlayVisibility(tabId);
      }
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
  const checkMethodsButton = document.getElementById(
    "check-methods-button",
  ) as HTMLElement;
  checkMethodsButton.addEventListener("click", async function () {
    async function callback(tabs: chrome.tabs.Tab[]) {
      const tabId = getTabIdFromTabs(tabs);
      if (tabId) {
        await checkAvailableIntegrations(tabId);
      }
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
});

function copyScreenshotsToClipboard(screenshotContainer: HTMLCanvasElement) {
  if (window.ClipboardItem) {
    screenshotContainer.toBlob((blob) => {
      if (blob) {
        const data = [new ClipboardItem({ [blob.type]: blob })];
        navigator.clipboard.write(data);
      }
    });
  } else {
    fetch(screenshotContainer.toDataURL())
      .then((response) => response.arrayBuffer())
      .then((buffer) => browser.clipboard.setImageData(buffer, "png"));
  }
}

function getTabIdFromTabs(tabs: chrome.tabs.Tab[]) {
  const currentTab = tabs[0];
  return currentTab?.id;
}

function createScreenshot(
  ctx: CanvasRenderingContext2D,
  screenshotContainer: HTMLCanvasElement,
  isFirstScreenShot: boolean,
  onDone: () => void,
) {
  chrome.tabs.captureVisibleTab(function (screenshotDataUrl) {
    const screenshotImage = new Image();
    screenshotImage.src = screenshotDataUrl;
    screenshotImage.onload = () => {
      if (isFirstScreenShot) {
        screenshotContainer.width = screenshotImage.width;
        screenshotContainer.height = screenshotImage.height * 2;
        ctx.drawImage(
          screenshotImage,
          0,
          0,
          screenshotImage.width,
          screenshotImage.height,
        );
      } else {
        ctx.drawImage(
          screenshotImage,
          0,
          screenshotImage.height,
          screenshotImage.width,
          screenshotImage.height,
        );
      }
      onDone();
    };
  });
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
  return { ctx, screenshotContainer };
}

async function checkAvailableIntegrations(tabId: number) {
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["/extension-pop-up/check-available-integrations.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
