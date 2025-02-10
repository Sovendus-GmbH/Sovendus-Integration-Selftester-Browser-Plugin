import { X } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import type { StepProps } from "../../../testing-storage";
import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";
import { H2, H3, P } from "../../typography";

export function OptimizeContent({
  currentPageTestResult,
  currentTestRun,
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
    <div>
      <H2 overlaySize={currentTestRun.overlaySize}>Optimize Data:</H2>
      <P overlaySize={currentTestRun.overlaySize}>
        Optimize ID: {selfTester.optimizeId?.elementValue || "Not detected"}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken?.elementValue || "Not detected"}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Checkout Products ID:{" "}
        {selfTester.checkoutProductsId?.elementValue || "Not detected"}
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
        Coupon Code: {selfTester.usedCouponCode?.elementValue}
      </P>
    </div>
  );
}
