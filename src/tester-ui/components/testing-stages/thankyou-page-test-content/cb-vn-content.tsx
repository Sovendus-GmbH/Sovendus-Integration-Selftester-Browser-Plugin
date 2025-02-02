import type { JSX } from "react";
import React from "react";

import { styles } from "../../../styles";
import type { StepProps } from "../../../testing-storage";
import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";

export function CBVNContent({
  overlayState,
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
    <div style={styles["contentContainer"]}>
      <h3 style={styles.sectionTitle}>Sovendus Partner Numbers:</h3>
      <div style={styles.text}>
        Traffic Source Number: {selfTester.trafficSourceNumber?.elementValue}
      </div>
      <div style={styles.text}>
        Traffic Medium Number: {selfTester.trafficMediumNumber?.elementValue}
      </div>

      <h3 style={styles.sectionTitle}>Sovendus Container:</h3>
      <div style={styles.text}>
        iFrame Container ID: {selfTester.iFrameContainerId?.elementValue}
      </div>

      <h3 style={styles.sectionTitle}>Order Data:</h3>
      <div style={styles.text}>
        Currency: {selfTester.orderCurrency?.elementValue}
      </div>
      <div style={styles.text}>
        Order ID: {selfTester.orderId?.elementValue}
      </div>
      <div style={styles.text}>
        Order Value: {selfTester.orderValue?.elementValue}
      </div>
      <div style={styles.text}>
        Session ID: {selfTester.sessionId?.elementValue}
      </div>
      <div style={styles.text}>
        Timestamp: {selfTester.timestamp?.elementValue}
      </div>
      <div style={styles.text}>
        Used Coupon Code: {selfTester.usedCouponCode?.elementValue}
      </div>

      <h3 style={styles.sectionTitle}>Customer Data:</h3>
      <div style={styles.text}>
        Salutation: {selfTester.consumerSalutation?.elementValue}
      </div>
      <div style={styles.text}>
        First Name: {selfTester.consumerFirstName?.elementValue}
      </div>
      <div style={styles.text}>
        Last Name: {selfTester.consumerLastName?.elementValue}
      </div>
      <div style={styles.text}>
        Year of Birth: {selfTester.consumerYearOfBirth?.elementValue}
      </div>
      <div style={styles.text}>
        Date of Birth: {selfTester.consumerDateOfBirth?.elementValue}
      </div>
      <div style={styles.text}>
        Email: {selfTester.consumerEmail?.elementValue}
      </div>
      <div style={styles.text}>
        Email Hash: {selfTester.consumerEmailHash?.elementValue}
      </div>
      <div style={styles.text}>
        Phone: {selfTester.consumerPhone?.elementValue}
      </div>
      <div style={styles.text}>
        Street: {selfTester.consumerStreet?.elementValue}
      </div>
      <div style={styles.text}>
        Street Number: {selfTester.consumerStreetNumber?.elementValue}
      </div>
      <div style={styles.text}>
        Zip Code: {selfTester.consumerZipCode?.elementValue}
      </div>
      <div style={styles.text}>
        City: {selfTester.consumerCity?.elementValue}
      </div>
      <div style={styles.text}>
        Country: {selfTester.consumerCountry?.elementValue}
      </div>
    </div>
  );
}
