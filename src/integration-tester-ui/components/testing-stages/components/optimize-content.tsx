import { X } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import type {
  StepProps,
  TestResult,
  TestRun,
} from "../../../../integration-tester-ui/types";
import { styles } from "../../../styles";

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
        <h1 style={{ margin: 0 }}>Optimize</h1>
        <X size={30} />
      </div>
    );
  }

  return (
    <div style={styles["contentContainer"]}>
      <h3 style={styles["sectionTitle"]}>Optimize Data:</h3>
      <p style={styles["text"]}>
        Optimize ID: {selfTester.optimizeId || "Not detected"}
      </p>
      <p style={styles["text"]}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken || "Not detected"}
      </p>
      <p style={styles["text"]}>
        Checkout Products ID: {selfTester.checkoutProductsId || "Not detected"}
      </p>
      <p style={styles["text"]}>
        Legacy Profity ID: {selfTester.legacyProfityId || "Not detected"}
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
        Coupon Code: {selfTester.usedCouponCode.elementValue}
      </p>
    </div>
  );
}
