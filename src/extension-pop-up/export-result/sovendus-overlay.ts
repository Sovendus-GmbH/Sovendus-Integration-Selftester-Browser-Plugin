import type SelfTester from "../../page-banner/integration-tester.js";
import { transmitIntegrationError } from "../../page-banner/integration-tester.js";
import { browserAPI } from "../extension-pop-up.js";

export async function checkStickyBannerAndOverlayIntegration(
  tabId: number,
): Promise<boolean> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (): boolean => {
      return !!window.sovSelfTester?.isOverlayOrStickyBanner.elementValue;
    },
  });
  const sitesUrl = await getWindowFromPage(tabId);

  if (sitesUrl) {
    void transmitIntegrationError("Cors error test", {
      url: sitesUrl,
    });
  } else {
    void transmitIntegrationError("Cors error test no siteWindow", {
      windowParameter: window,
    });
  }

  if (result?.[0]?.result === undefined) {
    // eslint-disable-next-line no-console
    console.error("Failed to check if an overlay is used");
    if (sitesUrl) {
      void transmitIntegrationError("Failed to check if an overlay is used", {
        url: sitesUrl,
      });
    } else {
      void transmitIntegrationError(
        "Failed to check if an overlay is used and also failed to get sites window",
        { windowParameter: window },
      );
    }
    return false;
  }
  return result[0].result;
}

async function getWindowFromPage(tabId: number): Promise<string | false> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (): string => {
      return window.location.href;
    },
  });
  if (result?.[0]?.result === undefined) {
    return false;
  }
  return result[0].result;
}

export async function hideOrShowStickyBannerAndOverlay(
  hide: boolean,
  tabId: number,
): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [hide],
    func: async (hide) => {
      await window.sovSelfTester?.hideOverlayBanners(hide);
    },
  });
}

export interface SovWindow extends Window {
  sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
