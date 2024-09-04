import type SelfTester from "@src/page-banner/integration-tester.js";

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
  if (result?.[0]?.result === undefined) {
    // eslint-disable-next-line no-console
    console.error("Failed to check if an overlay is used");
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
