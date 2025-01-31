import type { JSX } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../../../integration-detector/integrationDetector";
import { styles } from "../../../styles";
import type { UiState } from "../../../types";

export function CheckoutProductsContent({
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
        <p style={styles["text"]}>No Checkout Products integration detected.</p>
      </div>
    );
  }

  return (
    <div style={styles["contentContainer"]}>
      <h3 style={styles["sectionTitle"]}>Checkout Products Data:</h3>
      <p style={styles["text"]}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken || "Not detected"}
      </p>
      <p style={styles["text"]}>
        Checkout Products ID: {selfTester.checkoutProductsId || "Not detected"}
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
        Used Coupon Code: {selfTester.usedCouponCode.elementValue}
      </p>
    </div>
  );
}
