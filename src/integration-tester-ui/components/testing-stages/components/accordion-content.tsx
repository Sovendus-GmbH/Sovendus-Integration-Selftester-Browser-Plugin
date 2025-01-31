import type { JSX } from "react";
import React, { useState } from "react";

import type { IntegrationDetectorData } from "../../../../integration-detector/integrationDetector";
import type { UiState } from "../../../types";
import { IntegrationType } from "../../../types";
import { CBVNContent } from "./cb-vn-content";
import { CheckoutProductsContent } from "./checkout products-content";
import { OptimizeContent } from "./optimize-content";

export function AccordionContent({
  integrationState,
  uiState,
}: {
  integrationState: IntegrationDetectorData;
  uiState: UiState;
}): JSX.Element {
  const [activeSection, setActiveSection] = useState<IntegrationType | null>(
    null,
  );

  const toggleSection = (section: IntegrationType): void => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <div>
      <CBVNContent integrationState={integrationState} uiState={uiState} />
      <CheckoutProductsContent
        integrationState={integrationState}
        uiState={uiState}
      />
      <OptimizeContent integrationState={integrationState} uiState={uiState} />
    </div>
  );
}
