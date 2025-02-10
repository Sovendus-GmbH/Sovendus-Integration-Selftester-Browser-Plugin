import type { JSX } from "react";
import React from "react";

import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";
import { type StepProps } from "../../../testing-storage";
import { H2, H3, P } from "../../typography";

export function CBVNContent({
  currentTestRun,
  currentPageTestResult,
}: StepProps & {
  currentTestRun: TestRun;
  currentPageTestResult: TestResult;
}): JSX.Element {
  const selfTester = currentPageTestResult.integrationTester;

  if (!selfTester) {
    return <></>;
  }

  return (
    <div>
      <H2 overlaySize={currentTestRun.overlaySize}>
        Sovendus Partner Numbers:
      </H2>
      <P overlaySize={currentTestRun.overlaySize}>
        Traffic Source Number: {selfTester.trafficSourceNumber?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Traffic Medium Number: {selfTester.trafficMediumNumber?.elementValue}
      </P>

      <H3 overlaySize={currentTestRun.overlaySize}>Sovendus Container:</H3>
      <P overlaySize={currentTestRun.overlaySize}>
        iFrame Container ID: {selfTester.iFrameContainerId?.elementValue}
      </P>

      <H3 overlaySize={currentTestRun.overlaySize}>Order Data:</H3>
      <P overlaySize={currentTestRun.overlaySize}>
        Currency: {selfTester.orderCurrency?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Order ID: {selfTester.orderId?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Order Value: {selfTester.orderValue?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Session ID: {selfTester.sessionId?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Timestamp: {selfTester.timestamp?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Used Coupon Code: {selfTester.usedCouponCode?.elementValue}
      </P>

      <H3 overlaySize={currentTestRun.overlaySize}>Customer Data:</H3>
      <P overlaySize={currentTestRun.overlaySize}>
        Salutation: {selfTester.consumerSalutation?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        First Name: {selfTester.consumerFirstName?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Last Name: {selfTester.consumerLastName?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Year of Birth: {selfTester.consumerYearOfBirth?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Date of Birth: {selfTester.consumerDateOfBirth?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Email: {selfTester.consumerEmail?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Email Hash: {selfTester.consumerEmailHash?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Phone: {selfTester.consumerPhone?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Street: {selfTester.consumerStreet?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Street Number: {selfTester.consumerStreetNumber?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Zip Code: {selfTester.consumerZipCode?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        City: {selfTester.consumerCity?.elementValue}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Country: {selfTester.consumerCountry?.elementValue}
      </P>
    </div>
  );
}
