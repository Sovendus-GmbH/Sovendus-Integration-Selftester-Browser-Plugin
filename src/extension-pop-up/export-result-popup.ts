document.addEventListener("DOMContentLoaded", function () {
  const captureButton = document.getElementById("capture-button");
  captureButton.addEventListener("click", function () {
    captureButton.innerText = "Copying In Progress...";
    const { ctx, screenshotContainer } = getScreenshotCanvas();
    async function callback(tabs: chrome.tabs.Tab[]) {
      const currentTab = tabs[0];
      await showOverlay(currentTab);
      createScreenshot(ctx, screenshotContainer, true, async () => {
        await hideOverlay(currentTab);
        createScreenshot(ctx, screenshotContainer, false, () => {
          copyScreenshotsToClipboard(screenshotContainer);
          captureButton.innerText = "Copy Test Result Again";
          captureButton.style.background = "green";
          captureButton.style.color = "white";
          restoreOverlay(currentTab);
        });
      });
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
  const hideButton = document.getElementById("hide-button");
  hideButton.addEventListener("click", async function () {
    async function callback(tabs: chrome.tabs.Tab[]) {
      const currentTab = tabs[0];
      toggleOverlayVisibility(currentTab);
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
  const checkMethodsButton = document.getElementById("check-methods-button");
  checkMethodsButton.addEventListener("click", async function () {
    async function callback(tabs: chrome.tabs.Tab[]) {
      const currentTab = tabs[0];
      await checkAvailableIntegrations(currentTab);
    }
    const query = { active: true, currentWindow: true };
    chrome.tabs.query(query, callback);
  });
});

function copyScreenshotsToClipboard(screenshotContainer: HTMLCanvasElement) {
  if (window.hasOwnProperty("ClipboardItem")) {
    screenshotContainer.toBlob((blob) => {
      const data = [new ClipboardItem({ [blob.type]: blob })];
      navigator.clipboard.write(data);
    });
  } else {
    fetch(screenshotContainer.toDataURL())
      .then((response) => response.arrayBuffer())
      .then((buffer) => browser.clipboard.setImageData(buffer, "png"));
  }
}

function createScreenshot(
  ctx: CanvasRenderingContext2D,
  screenshotContainer: HTMLCanvasElement,
  isFirstScreenShot: boolean,
  onDone: () => void
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
          screenshotImage.height
        );
      } else {
        ctx.drawImage(
          screenshotImage,
          0,
          screenshotImage.height,
          screenshotImage.width,
          screenshotImage.height
        );
      }
      onDone();
    };
  });
}

async function toggleOverlayVisibility(currentTab: chrome.tabs.Tab) {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["/extension-pop-up/self-test-overlay-toggle.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function showOverlay(currentTab: chrome.tabs.Tab) {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["/extension-pop-up/self-test-overlay-show.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

async function restoreOverlay(currentTab: chrome.tabs.Tab) {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["/extension-pop-up/self-test-overlay-restore.js"],
  });
}

async function hideOverlay(currentTab: chrome.tabs.Tab) {
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["/extension-pop-up/self-test-overlay-hide.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}

function getScreenshotCanvas(): {
  ctx: CanvasRenderingContext2D;
  screenshotContainer: HTMLCanvasElement;
} {
  const screenshotContainer: HTMLCanvasElement = document.getElementById(
    "screenshot-canvas"
  ) as HTMLCanvasElement;
  const ctx = screenshotContainer.getContext("2d");
  return { ctx, screenshotContainer };
}

async function checkAvailableIntegrations(currentTab: chrome.tabs.Tab) {
  console.log("test1")
  chrome.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ["/extension-pop-up/check-available-integrations.js"],
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
