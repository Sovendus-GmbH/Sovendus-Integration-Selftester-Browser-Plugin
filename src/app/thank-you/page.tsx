"use client";

import type { JSX } from "react";
import { useEffect, useState } from "react";
import { CountryCodes } from "sovendus-integration-types";
import type {
  SovendusConsumerData,
  SovendusConversionsData,
} from "sovendus-integration-types/src";

import { SovendusThankyou } from "./SovendusThankYou";
import { ThankyouPageForm } from "./ThankYouPageForm";

const defaultConfig: {
  orderData: SovendusConversionsData;
  customerData: SovendusConsumerData;
} = {
  orderData: {
    sessionId: "asdas",
    orderId: "13245",
    orderValue: "1324",
    orderCurrency: "EUR",
    usedCouponCode: "1324",
  },
  customerData: {
    consumerSalutation: "Mr.",
    consumerFirstName: "John",
    consumerLastName: "Doe",
    consumerEmail: "John.doe@bla.bla",
    consumerCountry: CountryCodes.DE,
    consumerZipcode: "",
    consumerPhone: "0123456789",
    consumerYearOfBirth: "1991",
    consumerDateOfBirth: "01.01.1991",
    consumerStreet: "test street",
    consumerStreetNumber: "1",
    consumerCity: "testCity",
  },
};

export default function ThankYou(): JSX.Element {
  const [config, setConfig] = useState<{
    orderData: SovendusConversionsData;
    customerData: SovendusConsumerData;
  }>(
    (): {
      orderData: SovendusConversionsData;
      customerData: SovendusConsumerData;
    } => {
      if (typeof window !== "undefined") {
        const storedConfig = localStorage.getItem("thankyouConfig");
        return storedConfig
          ? (JSON.parse(storedConfig) as {
              orderData: SovendusConversionsData;
              customerData: SovendusConsumerData;
            })
          : defaultConfig;
      }
      return defaultConfig;
    },
  );

  useEffect(() => {
    localStorage.setItem("thankyouConfig", JSON.stringify(config));
  }, [config]);

  return (
    <div>
      <h1>This is a thank you page</h1>
      <ThankyouPageForm config={config} setConfig={setConfig} />
      <SovendusThankyou config={config} />
    </div>
  );
}
