addScreenshotEventListener();

function addScreenshotEventListener() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
      // Inject the script to listen for custom events on the page
      chrome.scripting.executeScript({
        target: { tabId },
        func: injectEventListener,
      });
    }
  });

  function injectEventListener() {
    // Listen for a custom event called 'triggerScreenshot'
    document.addEventListener("triggerScreenshot", () => {
      // Send a message to the background script when the event occurs
      chrome.runtime.sendMessage({ action: "captureScreenshot" });
    });
  }

  chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === "captureScreenshot" && sender.tab) {
      captureAndProcessScreenshot(sender.tab);
    }
  });
}

async function captureAndProcessScreenshot(tab: chrome.tabs.Tab) {
  // Capture the screenshot when the event occurs
  chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
    if (chrome.runtime.lastError) {
      console.error(
        "Failed to capture screenshot:",
        chrome.runtime.lastError.message,
      );
      return;
    }

    console.log("Screenshot captured:", dataUrl);

    // Inject the screenshot back into the page or handle it as needed
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: displayScreenshot,
      args: [dataUrl],
    });
  });

  return true; // Indicate that we want to send a response asynchronously
}

function displayScreenshot(screenshotDataUrl: string) {
  // Display the screenshot on the page
  const img = document.createElement("img");
  img.src = screenshotDataUrl;
  img.style.position = "fixed";
  img.style.top = "10px";
  img.style.left = "10px";
  img.style.zIndex = "10000";
  img.style.border = "2px solid black";
  document.body.appendChild(img);
}
