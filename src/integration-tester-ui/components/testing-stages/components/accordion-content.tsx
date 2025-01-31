import type { JSX } from "react";
import React, { useState } from "react";

import type { TestRun } from "../../../hooks/useOverlayState";
import type { IntegrationType, StepProps } from "../../../types";
import { CBVNContent } from "./cb-vn-content";
import { CheckoutProductsContent } from "./checkout products-content";
import { OptimizeContent } from "./optimize-content";

export function AccordionContent({
  overlayState,
  currentTestRun,
}: StepProps & { currentTestRun: TestRun }): JSX.Element {
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
      />
      <CheckoutProductsContent
        overlayState={overlayState}
        currentTestRun={currentTestRun}
      />
      <OptimizeContent
        overlayState={overlayState}
        currentTestRun={currentTestRun}
      />
    </div>
  );
}
