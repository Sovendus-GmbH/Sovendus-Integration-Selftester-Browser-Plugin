import type { JSX } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../../../integration-detector/integrationDetector";
import { styles } from "../../../styles";
import type { UiState } from "../../../types";

export function CBVNContent({
  integrationState,
  uiState,
}: {
  integrationState: IntegrationDetectorData;
  uiState: UiState;
}): JSX.Element {
  const selfTester = integrationState.selfTester;

  if (!selfTester) {
    return (
      <div style={styles["contentContainer"]}>
        <p style={styles["text"]}>
          No Checkout Benefits & Voucher Network integration detected.
        </p>
      </div>
    );
  }

  return (
    <div style={styles["contentContainer"]}>
      <h3 style={styles["sectionTitle"]}>Sovendus Partner Numbers:</h3>
      <p style={styles["text"]}>
        Traffic Source Number: {selfTester.trafficSourceNumber.elementValue}
      </p>
      <p style={styles["text"]}>
        Traffic Medium Number: {selfTester.trafficMediumNumber.elementValue}
      </p>

      <h3 style={styles["sectionTitle"]}>Sovendus Container:</h3>
      <p style={styles["text"]}>
        iFrame Container ID: {selfTester.iFrameContainerId.elementValue}
      </p>

      <h3 style={styles["sectionTitle"]}>Order Data:</h3>
      <p style={styles["text"]}>
        Currency: {selfTester.orderCurrency.elementValue}
      </p>
      <p style={styles["text"]}>Order ID: {selfTester.orderId.elementValue}</p>
      <p style={styles["text"]}>
        Order Value: {selfTester.orderValue.elementValue}
      </p>
      <p style={styles["text"]}>
        Session ID: {selfTester.sessionId.elementValue}
      </p>
      <p style={styles["text"]}>
        Timestamp: {selfTester.timestamp.elementValue}
      </p>
      <p style={styles["text"]}>
        Used Coupon Code: {selfTester.usedCouponCode.elementValue}
      </p>

      <h3 style={styles["sectionTitle"]}>Customer Data:</h3>
      <p style={styles["text"]}>
        Salutation: {selfTester.consumerSalutation.elementValue}
      </p>
      <p style={styles["text"]}>
        First Name: {selfTester.consumerFirstName.elementValue}
      </p>
      <p style={styles["text"]}>
        Last Name: {selfTester.consumerLastName.elementValue}
      </p>
      <p style={styles["text"]}>
        Year of Birth: {selfTester.consumerYearOfBirth.elementValue}
      </p>
      <p style={styles["text"]}>
        Date of Birth: {selfTester.consumerDateOfBirth.elementValue}
      </p>
      <p style={styles["text"]}>
        Email: {selfTester.consumerEmail.elementValue}
      </p>
      <p style={styles["text"]}>
        Email Hash: {selfTester.consumerEmailHash.elementValue}
      </p>
      <p style={styles["text"]}>
        Phone: {selfTester.consumerPhone.elementValue}
      </p>
      <p style={styles["text"]}>
        Street: {selfTester.consumerStreet.elementValue}
      </p>
      <p style={styles["text"]}>
        Street Number: {selfTester.consumerStreetNumber.elementValue}
      </p>
      <p style={styles["text"]}>
        Zip Code: {selfTester.consumerZipCode.elementValue}
      </p>
      <p style={styles["text"]}>City: {selfTester.consumerCity.elementValue}</p>
      <p style={styles["text"]}>
        Country: {selfTester.consumerCountry.elementValue}
      </p>
    </div>
  );
}
