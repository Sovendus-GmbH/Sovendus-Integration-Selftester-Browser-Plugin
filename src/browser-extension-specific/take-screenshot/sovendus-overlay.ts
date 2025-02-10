import { error } from "../../logger/logger";
import type SelfTester from "../../tester/integration-tester";
import { transmitIntegrationError } from "../../tester/integration-tester";
import { browserAPI } from "../browser-api";

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

  if (result?.[0]?.result === undefined) {
    const sitesUrl = await getSiteUrlFromPage(tabId);
    error(
      "takeScreenshot][checkStickyBannerAndOverlayIntegration",
      "Failed to check if an overlay is used",
    );
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

async function getSiteUrlFromPage(tabId: number): Promise<string | false> {
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
    func: (hide) => {
      // TODO handle this
      window.sovSelfTester?.hideOverlayBanners(hide);
    },
  });
}

export interface SovWindow extends Window {
  // sovSelfTester?: SelfTester;
}

declare let window: SovWindow;
