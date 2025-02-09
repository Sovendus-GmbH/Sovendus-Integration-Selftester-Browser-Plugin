"use client";

import type { JSX } from "react";
import React, { useState } from "react";
import type { ConversionsType } from "sovendus-integration-scripts/src/js/thank-you/utils/IntegrationDataCollector";
import type { SovConsumerType } from "sovendus-integration-scripts/src/js/thank-you/utils/thank-you-types";

import NavBar from "../components/NavBar";
import { SovendusBanner } from "../components/thank-you/SovendusThankYou";
import { ThankyouPageForm } from "../components/thank-you/ThankYouPageForm";

export default function ThankYou(): JSX.Element {
  const [config, setConfig] = useState<{
    iframes: ConversionsType;
    consumer: SovConsumerType;
  }>({
    iframes: {
      trafficSourceNumber: 7849,
      trafficMediumNumber: 16,
      sessionId: "asdas",
      timestamp: Math.floor(Date.now() / 1000),
      orderId: "13245",
      orderValue: "1324",
      orderCurrency: "EUR",
      usedCouponCode: "1324",
    },
    consumer: {
      consumerSalutation: "",
      consumerFirstName: "",
      consumerLastName: "",
      consumerEmail: "",
      consumerCountry: "",
      consumerZipcode: "",
      consumerPhone: "",
      consumerYearOfBirth: "",
      consumerDateOfBirth: "",
      consumerStreet: "",
      consumerStreetNumber: "",
      consumerCity: "",
    },
  });
  return (
    <div>
      <main style={{ padding: "40px" }}>
        <NavBar currentPage="/thank-you" />
        <h1>This is a thank you page</h1>
        <ThankyouPageForm config={config} setConfig={setConfig} />
        <SovendusBanner config={config} />
      </main>
    </div>
  );
}
