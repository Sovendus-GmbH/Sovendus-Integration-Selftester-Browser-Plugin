import type { JSX } from "react";
import React from "react";

import { H2, P } from "../../components/typography";
import type { StepProps, TestResult, TestRun } from "../../testing-storage";

export function CheckoutProductsContent({
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
      <H2 overlaySize={currentTestRun.overlaySize}>Checkout Products Data:</H2>
      <P overlaySize={currentTestRun.overlaySize}>
        Checkout Products Token:{" "}
        {selfTester.checkoutProductsToken?.elementValue || "Not detected"}
      </P>
      <P overlaySize={currentTestRun.overlaySize}>
        Checkout Products ID:{" "}
        {selfTester.checkoutProductsId?.elementValue || "Not detected"}
      </P>
    </div>
  );
}
