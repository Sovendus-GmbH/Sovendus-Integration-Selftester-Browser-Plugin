import type { JSX } from "react";
import React, { useState } from "react";

import type { IntegrationType, StepProps } from "../../../testing-storage";
import type { TestRun } from "../../../testing-storage";
import type { TestResult } from "../../../testing-storage";
import { CBVNContent } from "./cb-vn-content";
import { CheckoutProductsContent } from "./checkout products-content";
import { OptimizeContent } from "./optimize-content";

export function AccordionContent({
  overlayState,
  currentTestRun,
  currentPageTestResult,
}: StepProps & {
  currentTestRun: TestRun;
  currentPageTestResult: TestResult;
}): JSX.Element {
  const [activeSection, setActiveSection] = useState<
    IntegrationType | undefined
  >();
  const toggleSection = (section: IntegrationType): void => {
    setActiveSection(activeSection === section ? undefined : section);
  };

  return (
    <div>
      <CBVNContent
        overlayState={overlayState}
        currentTestRun={currentTestRun}
        currentPageTestResult={currentPageTestResult}
      />
      <CheckoutProductsContent
        overlayState={overlayState}
        currentTestRun={currentTestRun}
        currentPageTestResult={currentPageTestResult}
      />
      <OptimizeContent
        overlayState={overlayState}
        currentTestRun={currentTestRun}
        currentPageTestResult={currentPageTestResult}
      />
    </div>
  );
}
