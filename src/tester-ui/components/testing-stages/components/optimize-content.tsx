import { X } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { styles } from "../../../styles";
import type { StepProps } from "../../../testing-storage";
import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";

export function OptimizeContent({
  overlayState,
  currentTestRun,
  currentPageTestResult,
}: StepProps & {
  currentTestRun: TestRun;
  currentPageTestResult: TestResult;
}): JSX.Element {
  const selfTester = currentPageTestResult.integrationTester;

  const notFoundHeader: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "30rem",
    backgroundColor: "#FEE2E2",
    margin: "auto",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#DC2626",
    padding: "0.5rem 1rem",
    width: "fit-content",
  };

  if (!selfTester) {
    return (
      <div style={notFoundHeader}>
        <div style={{ margin: 0 }}>Optimize</div>
        <X size={30} />
      </div>
    );
  }

  return (
    <div style={styles["contentContainer"]}>
      <div style={styles["sectionTitle"]}>Optimize Data:</div>
      <div style={styles["text"]}>
        Optimize ID: {selfTester.optimizeId?.elementValue || "Not detected"}
      </div>
      <div style={styles["text"]}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken?.elementValue || "Not detected"}
      </div>
      <div style={styles["text"]}>
        Checkout Products ID:{" "}
        {selfTester.checkoutProductsId?.elementValue || "Not detected"}
      </div>
      <div style={styles["text"]}>
        Legacy Profity ID:{" "}
        {selfTester.legacyProfityId?.elementValue || "Not detected"}
      </div>

      <div style={styles["sectionTitle"]}>Order Data:</div>
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
        Coupon Code: {selfTester.usedCouponCode?.elementValue}
      </div>
    </div>
  );
}
