export async function addDelayBetweenScreenshotOnChrome(): Promise<void> {
  if (!isFirefox()) {
    // wait a second as captureVisibleTab only supports once per second on chrome
    await new Promise((r) => setTimeout(r, 1000));
  }
}

function isFirefox(): boolean {
  return !(typeof chrome !== "undefined" && typeof browser === "undefined");
}
