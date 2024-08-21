import { browserAPI } from "../extension-pop-up.js";

export async function checkSovendusOverlayIntegration(
  tabId: number,
): Promise<boolean> {
  const result = await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    func: (): boolean => {
      return !!window.sovApplication?.instances?.some((instance) => {
        return instance.config?.overlay?.showInOverlay;
      });
    },
  });
  if (result?.[0]?.result === undefined) {
    throw new Error("Failed to check if an overlay is used");
  }
  return result[0].result;
}

export async function hideAndShowSovendusOverlay(
  hide: boolean,
  tabId: number,
): Promise<void> {
  await browserAPI.scripting.executeScript({
    target: { tabId },
    world: "MAIN",
    args: [hide],
    func: (hide) => {
      const sovOverlay = document.getElementsByClassName("sov-overlay");
      if (sovOverlay?.[0]) {
        (sovOverlay[0] as HTMLElement).style.display = hide ? "none" : "block";
      } else {
        throw new Error("Error: sovOverlay not found");
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
        stickyBanner?: object;
      };
    }[];
  };
}

declare let window: SovWindow;
