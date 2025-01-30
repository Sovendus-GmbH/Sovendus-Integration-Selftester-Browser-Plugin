import type { Dispatch, SetStateAction } from "react";

import { defaultBlacklist } from "../constants";
import type { SovSelfTesterWindow } from "../integration-tester/integrationTester";
import SelfTester from "../integration-tester/integrationTester";
import { logger } from "../logger/logger";

export interface IntegrationDetectorData {
  shouldCheck: boolean;
  selfTester: SelfTester | undefined;
  integrationState: IntegrationState;
  isBlackListedPage: boolean;
}

export interface IntegrationState {
  detected: boolean;
  status: {
    detectionState: DetectionState;
    page: IntegrationPageState;
    thankYouPage: IntegrationThankYouPageState;
  };
}

interface IntegrationThankYouPageState {
  isSovendusThankYouPage: boolean;
  voucherNetwork: {
    hasSovConsumer: boolean;
    hasSovIframes: boolean;
    hasSovApplication: boolean;
    hasSovInstances: boolean;
    hasThankYouPageScript: boolean;
  };
  awin: {
    hasAwinIntegration: boolean;
    hasAwinSalesTracking: boolean;
    hasThankYouPageScript: boolean;
  };
  checkoutProducts: {
    hasPixel: boolean;
  };
  optimize: {
    hasConversionScript: boolean;
    hasThankYouPageScript: boolean;
  };
}

interface IntegrationPageState {
  isSovendusPage: boolean;
  voucherNetwork: {
    hasPageScript: boolean;
  };
  awin: {
    hasAwinIntegration: boolean;
  };
  checkoutProducts: {
    hasTokenInUrl: boolean;
    hasTokenInCookie: boolean;
  };
  optimize: {
    hasOptimizePageScript: boolean;
    hasPageScript: boolean;
  };
}

export enum DetectionState {
  NOT_DETECTED = "not-detected",
  DETECTED = "detected",
  LOADED = "loaded",
}

export class IntegrationDetectorLoop {
  private state: IntegrationDetectorData;
  private setState: Dispatch<SetStateAction<IntegrationDetectorData>>;

  constructor(
    setState: Dispatch<SetStateAction<IntegrationDetectorData>>,
    state: IntegrationDetectorData,
  ) {
    this.state = state;
    this.setState = setState;
    void this.integrationDetectionLoop();
  }

  private async integrationDetectionLoop(): Promise<void> {
    await this.repeatUntilStopped(async () => {
      await this.integrationDetection();
    });
  }

  private async integrationDetection(): Promise<void> {
    await this.waitForSovendusIntegrationDetected();
    await this.waitForSovendusIntegrationToBeLoaded();
    const sovSelfTester = (window.sovSelfTester = new SelfTester(this.state));
    sovSelfTester.selfTestIntegration();
    this.setState((prevState) => ({
      ...prevState,
      integrationState: {
        ...prevState.integrationState,
        detectionState: DetectionState.LOADED,
      },
      selfTester: sovSelfTester,
    }));
    // eslint-disable-next-line no-console
    logger("Integration tests finished");
  }

  private async repeatUntilStopped(tests: () => Promise<void>): Promise<void> {
    let visitedPath = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.state.shouldCheck) {
        if (visitedPath !== window.location.pathname) {
          visitedPath = window.location.pathname;
          await tests();
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  private async waitForSovendusIntegrationDetected(): Promise<void> {
    // eslint-disable-next-line no-console
    logger("No Sovendus integration detected yet");

    let sovendusDetectionStatus: IntegrationState = defaultIntegrationState;
    while (!sovendusDetectionStatus.detected) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      sovendusDetectionStatus = this.isSovendusDetected();
      if (
        sovendusDetectionStatus.status.detectionState !==
        this.state.integrationState.status.detectionState
      ) {
        this.updateState(sovendusDetectionStatus);
      }
    }
    // eslint-disable-next-line no-console
    logger("Sovendus has been detected");
  }

  private updateState(sovendusDetectionStatus: IntegrationState): void {
    this.setState((prevState) => ({
      ...prevState,
      integrationState: sovendusDetectionStatus,
      selfTester: sovendusDetectionStatus.detected
        ? prevState.selfTester
        : undefined,
    }));
  }

  private async waitForSovendusIntegrationToBeLoaded(): Promise<void> {
    await this.waitForSovApplicationObject();
    if (this.sovApplicationExists()) {
      await this.waitForBannerToBeLoaded();
    }
  }

  private isSovendusDetected(): IntegrationState {
    const { hasOptimizePageScript, hasOptimizeConversionScript } =
      this.hasOptimizeScript();
    const sovendusThankYouPageStatus = this.isSovendusThankYouPage(
      hasOptimizeConversionScript,
    );
    const sovendusPageStatus = this.isSovendusPage(hasOptimizePageScript);
    const detected =
      sovendusThankYouPageStatus.detected || sovendusPageStatus.detected;
    return {
      detected,
      status: {
        detectionState: detected
          ? DetectionState.DETECTED
          : DetectionState.NOT_DETECTED,
        page: sovendusPageStatus.status,
        thankYouPage: sovendusThankYouPageStatus.status,
      },
    };
  }

  private isSovendusThankYouPage(hasOptimizeConversionScript: boolean): {
    detected: boolean;
    status: IntegrationThankYouPageState;
  } {
    const hasThankYouPageScripts = this.hasThankYouPageScripts();
    const sovConsumerExists = this.sovConsumerExists();
    const sovIframesExists = this.sovIframesExists();
    const sovApplicationExists = this.sovApplicationExists();
    const hasCheckoutProductsPixel = this.hasCheckoutProductsPixel();
    if (
      hasThankYouPageScripts ||
      sovConsumerExists ||
      sovIframesExists ||
      sovApplicationExists ||
      hasOptimizeConversionScript ||
      hasCheckoutProductsPixel
    ) {
      const newState: IntegrationThankYouPageState = {
        isSovendusThankYouPage: true,
        voucherNetwork: {
          hasSovConsumer: sovConsumerExists,
          hasSovIframes: sovIframesExists,
          hasSovApplication: sovApplicationExists,
          hasSovInstances: false,
          hasThankYouPageScript: hasThankYouPageScripts,
        },
        awin: {
          hasAwinIntegration: false,
          hasAwinSalesTracking: false,
          hasThankYouPageScript: hasThankYouPageScripts,
        },
        checkoutProducts: {
          hasPixel: hasCheckoutProductsPixel,
        },
        optimize: {
          hasConversionScript: hasOptimizeConversionScript,
          hasThankYouPageScript: hasThankYouPageScripts,
        },
      };
      return { detected: true, status: newState };
    }
    return { detected: false, status: defaultThankYouPageState };
  }

  private isSovendusPage(hasOptimizePageScript: boolean): {
    detected: boolean;
    status: IntegrationPageState;
  } {
    const hasPageScripts = this.hasPageScripts();
    if (hasPageScripts || hasOptimizePageScript) {
      const newState: IntegrationPageState = {
        isSovendusPage: true,
        voucherNetwork: {
          hasPageScript: hasPageScripts,
        },
        awin: {
          hasAwinIntegration: false,
        },
        checkoutProducts: {
          hasTokenInUrl: false,
          hasTokenInCookie: false,
        },
        optimize: {
          hasOptimizePageScript: hasOptimizePageScript,
          hasPageScript: hasPageScripts,
        },
      };
      return { detected: true, status: newState };
    }
    return { detected: false, status: defaultPageState };
  }

  private hasOptimizeScript(): {
    hasOptimizePageScript: boolean;
    hasOptimizeConversionScript: boolean;
  } {
    const optimizeScript = document.querySelector(
      `[src^="${scriptAliases.optimizeScript}"]`,
    ) as HTMLScriptElement | undefined;
    if (optimizeScript) {
      const hasOptimizeConversionScript =
        optimizeScript.src.includes("conversion");
      const hasOptimizePageScript = !hasOptimizeConversionScript;
      return { hasOptimizePageScript, hasOptimizeConversionScript };
    }
    return { hasOptimizePageScript: false, hasOptimizeConversionScript: false };
  }

  private hasPageScripts(): boolean {
    return endsWithDomainPath(scriptAliases.domains, scriptAliases.page);
  }

  private hasThankYouPageScripts(): boolean {
    return endsWithDomainPath(
      scriptAliases.domains,
      scriptAliases.thankYouPage,
    );
  }

  private hasCheckoutProductsPixel(): boolean {
    for (const script of scriptAliases.checkoutProductsPixel) {
      if (document.querySelector(`img[src^="${script}"]`)) {
        return true;
      }
    }
    return false;
  }

  private async waitForSovApplicationObject(): Promise<void> {
    let waitedSeconds = 0;
    while (!this.sovApplicationExists() && waitedSeconds < 5) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
  }

  private async waitForBannerToBeLoaded(): Promise<void> {
    let waitedSeconds = 0;
    while (!this.sovInstancesLoaded() && waitedSeconds < 2) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      waitedSeconds += 0.5;
    }
    // wait a bit longer, just in case multiple integrations fire later
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // eslint-disable-next-line no-console
    logger("Sovendus banner loaded");
  }

  private sovConsumerExists(): boolean {
    return !!window.sovConsumer;
  }

  private sovIframesExists(): boolean {
    return !!window.sovIframes;
  }

  private sovApplicationExists(): boolean {
    return !!window.sovApplication?.consumer;
  }

  private sovInstancesLoaded(): boolean {
    return !!window.sovApplication?.instances?.find(
      (instance) =>
        instance.banner?.bannerExists ||
        instance.collapsableOverlayClosingType ||
        instance.stickyBanner?.bannerExists,
    );
  }

  private awinSovendusIntegrationDetected(): boolean {
    return !!window.AWIN?.Tracking?.Sovendus?.trafficMediumNumber;
  }

  private pixelExists(): boolean {
    const isImagePresent =
      document.querySelector(
        'img[src^="https://press-order-api.sovendus.com/ext/"]',
      ) !== null;

    return isImagePresent;
  }
}

export const scriptAliases = {
  domains: [".sovendus.com", "localhost:3000"],
  page: [
    "js/page.js",
    // legacy
    "js/landing.js",
  ],
  thankYouPage: [
    "js/journey-success.js",
    // legacy
    "js/profity.js",
    "js/client.js",
    "js/sovendusloader.js",
    "sovabo/common/js/dynamicIframe.js",

    "sovabo/common/js/flexibleIframe.js",
  ],
  // example thank you script:
  // https://www.sovopt.com/OPTIMIZE_ID/conversion/?
  // example page script:
  // https://www.sovopt.com/OPTIMIZE_ID
  optimizeScript: ["https://www.sovopt.com/"],
  checkoutProductsPixel: ["https://press-order-api.sovendus.com/ext/"],
};

const defaultThankYouPageState: IntegrationThankYouPageState = {
  isSovendusThankYouPage: false,
  voucherNetwork: {
    hasSovConsumer: false,
    hasSovIframes: false,
    hasSovApplication: false,
    hasSovInstances: false,
    hasThankYouPageScript: false,
  },
  awin: {
    hasAwinIntegration: false,
    hasAwinSalesTracking: false,
    hasThankYouPageScript: false,
  },
  checkoutProducts: {
    hasPixel: false,
  },
  optimize: {
    hasConversionScript: false,
    hasThankYouPageScript: false,
  },
};

const defaultPageState: IntegrationPageState = {
  isSovendusPage: false,
  voucherNetwork: {
    hasPageScript: false,
  },
  awin: {
    hasAwinIntegration: false,
  },
  checkoutProducts: {
    hasTokenInUrl: false,
    hasTokenInCookie: false,
  },
  optimize: {
    hasOptimizePageScript: false,
    hasPageScript: false,
  },
};

export const defaultIntegrationState: IntegrationState = {
  detected: false,
  status: {
    detectionState: DetectionState.NOT_DETECTED,
    thankYouPage: defaultThankYouPageState,
    page: defaultPageState,
  },
};

function endsWithDomainPath(domains: string[], scripts: string[]): boolean {
  for (const domain of domains) {
    for (const script of scripts) {
      if (document.querySelector(`script[src$="${domain}/${script}"]`)) {
        return true;
      }
    }
  }
  return false;
}

export function isBlacklistedPage(blacklist: string[] | undefined): boolean {
  const _blacklist: string[] = [...defaultBlacklist, ...(blacklist || [])];
  return _blacklist.includes(window.location.host);
}

declare let window: SovSelfTesterWindow;
