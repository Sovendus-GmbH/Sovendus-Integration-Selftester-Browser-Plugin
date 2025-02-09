"use client";

import { urlConfig as developmentConfig } from "integration-scripts-builder/integration-scripts-builder/build-config/cfg.development";
import { urlConfig as previewConfig } from "integration-scripts-builder/integration-scripts-builder/build-config/cfg.preview";
import type { JSX } from "react";
import React from "react";
import { useEffect } from "react";
import { start as startVoucherNetwork } from "sovendus-integration-scripts/src/js/sovendus/main/sovendus";
import { start as startThankYou } from "sovendus-integration-scripts/src/js/thank-you/thank-you";
import type { ConversionsType } from "sovendus-integration-scripts/src/js/thank-you/utils/IntegrationDataCollector";
import { cleanUp } from "sovendus-integration-scripts/src/js/thank-you/utils/removalObserver";
import type {
  SovConsumerType,
  SovendusPublicConversionWindow,
} from "sovendus-integration-scripts/src/js/thank-you/utils/thank-you-types";

export function SovendusBanner({
  config,
}: {
  config: {
    iframes: ConversionsType;
    consumer: SovConsumerType;
  };
}): JSX.Element {
  const divId = "sovendus-container";
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.sovIframes) {
        cleanUp();
      }
      window.sovIframes = window.sovIframes || [];
      window.sovIframes.push({
        ...config.iframes,
        iframeContainerId: divId,
        integrationType: "integration-preview-1.0.0",
      });

      window.sovConsumer = config.consumer;
      executeSovendus();
    }
  }, [divId, config]);
  return <div id={divId}></div>;
}

function executeSovendus(): void {
  const urlConfig =
    process.env["NODE_ENV"] === "development"
      ? developmentConfig
      : process.env["NODE_ENV"] === "production"
        ? previewConfig
        : undefined;
  window.sovApplication = {
    ...window.sovApplication,
    urlConfig: {
      CACHE_BUSTER: "xxx-xxx-xxx",
      ...urlConfig,
    },
  };

  startThankYou(window, startVoucherNetwork);
}

interface CLientSovendusThankYouWindow extends SovendusPublicConversionWindow {
  sovDivId?: number;
}

declare const window: CLientSovendusThankYouWindow;

export interface SovendusBannerProps {
  // sovendus data
  trafficSourceNumber: number;
  trafficMediumNumber: number;

  // order data
  orderId?: string;
  orderValue?: number;
  orderCurrency?: string;
  sessionId?: string;
  usedCouponCode?: string;

  // customer data
  salutation?: "Mr." | "Mrs." | "";
  firstName?: string;
  lastName?: string;
  email?: string;
  countryCode?: string;
  zipCode?: string;
  phoneNumber?: string;
  yearOfBirth?: number;
  dateOfBirth?: string;
  streetName?: string;
  streetNumber?: string;
  cityName?: string;
}
