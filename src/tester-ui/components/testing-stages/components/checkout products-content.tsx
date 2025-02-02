import type { JSX } from "react";
import React from "react";

import { styles } from "../../../styles";
import type { StepProps } from "../../../testing-storage";
import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";

export function CheckoutProductsContent({
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
      <h3 style={styles["sectionTitle"]}>Checkout Products Data:</h3>
      <div style={styles["text"]}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken?.elementValue || "Not detected"}
      </div>
      <div style={styles["text"]}>
        Checkout Products ID:{" "}
        {selfTester.checkoutProductsId?.elementValue || "Not detected"}
      </div>

      <h3 style={styles["sectionTitle"]}>Order Data:</h3>
      <div style={styles["text"]}>
        Currency: {selfTester.orderCurrency?.elementValue}
      </div>
      <div style={styles["text"]}>
        Order ID: {selfTester.orderId?.elementValue}
      </div>
      <div style={styles["text"]}>
        Order Value: {selfTester.orderValue?.elementValue}
      </div>
      <div style={styles["text"]}>
        Used Coupon Code: {selfTester.usedCouponCode?.elementValue}
      </div>
    </div>
  );
}
