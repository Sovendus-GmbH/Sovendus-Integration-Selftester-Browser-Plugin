import { browserAPI } from "../extension-pop-up.js";

export async function checkStickyBannerAndOverlayIntegration(
  tabId: number,
): Promise<boolean> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (): boolean => {
      return !!window.sovApplication?.instances?.some((instance) => {
        return (
          instance.config?.overlay?.showInOverlay ||
          instance.stickyBanner?.bannerExists
        );
      });
    },
  });
  if (result?.[0]?.result === undefined) {
    throw new Error("Failed to check if an overlay is used");
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
      const sovOverlay = document.getElementsByClassName(
        "sov-overlay",
      )?.[0] as HTMLElement | null;
      if (sovOverlay) {
        sovOverlay.style.display = hide ? "none" : "block";
      }
      const stickyBanner = document.querySelector(
        '[id^="sov_"][id$="Toggle"]',
      ) as HTMLElement;
      const parentElement = stickyBanner?.parentElement;
      if (stickyBanner && parentElement) {
        parentElement.style.display = hide ? "none" : "block";
        if (
          [...parentElement.classList].some((cls) => cls.includes("-folded"))
        ) {
          if (!hide) {
            stickyBanner.click();
            await new Promise((r) => setTimeout(r, 500));
          }
        }
      }
      if (!sovOverlay && (!stickyBanner || !parentElement)) {
        throw new Error("Error: sovOverlay or sticky banner not found");
      }
    },
  });
}

export interface SovWindow extends Window {
  sovApplication?: {
    instances?: {
      config?: {
        overlay?: {
          showInOverlay?: boolean;
        };
      };
      stickyBanner?: {
        bannerExists?: boolean;
      };
    }[];
  };
}

declare let window: SovWindow;
