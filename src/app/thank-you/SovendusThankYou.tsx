"use client";

import type { JSX } from "react";
import { useEffect } from "react";
import type {
  SovendusThankyouPageData,
  SovendusThankyouWindow,
} from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyouPage } from "../../thankyou-page/thankyou-page-handler";
import { getSettings } from "../settings/settings-util";

export function SovendusThankyou({
  config,
}: {
  config: {
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  };
}): JSX.Element {
  useEffect(() => {
    window.sovThankyouConfig = {
      settings: getSettings(),
      integrationType: "sovendus-integration-scripts-preview",
      sovDebugLevel: "debug",
      orderData: config.orderData,
      customerData: config.customerData,
    };
    const OnDone = ({
      sovThankyouStatus,
    }: Partial<SovendusThankyouPageData>): void => {
      // used for debugging with the testing app
      if (sovThankyouStatus) {
        window.sovThankyouStatus = sovThankyouStatus;
        // eslint-disable-next-line no-console
        console.log("Page done: ", {
          sovThankyouStatus,
          sovPageConfig: window.sovThankyouConfig,
        });
      }
    };

    const sovendusPage = new SovendusThankyouPage();
    void sovendusPage.main(window.sovThankyouConfig, OnDone);
    return (): void => {
      sovendusPage.unmount();
    };
  }, [config.customerData, config.orderData]);
  return <></>;
}

declare const window: SovendusThankyouWindow;
