import React, { JSX, useState } from "react";
import { ChevronRight } from "lucide-react";
import { IntegrationType } from "../types";
import type { UiState } from "../types";
import { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { styles } from "../styles";
import { CBVNContent } from "./cb-vn-content";
import { CheckoutProductsContent } from "./checkout products-content";
import { OptimizeContent } from "./optimize-content";

export function AccordionContent({
  integrationState,
  uiState,
  currentStep,
  withConsent,
}: {
  integrationState: IntegrationDetectorData;
  uiState: UiState;
  currentStep: number;
  withConsent: boolean | null;
}): JSX.Element {
  const [activeSection, setActiveSection] = useState<IntegrationType | null>(
    null,
  );

  const toggleSection = (section: IntegrationType) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const renderSection = (
    title: string,
    content: JSX.Element,
    type: IntegrationType,
  ) => (
    <div style={styles["accordionSection"]}>
      <div
        style={styles["accordionHeader"]}
        onClick={() => toggleSection(type)}
      >
        <h3 style={styles["accordionTitle"]}>{title}</h3>
        <ChevronRight
          style={{
            ...styles["accordionIcon"],
            transform:
              activeSection === type ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
      </div>
      {activeSection === type && (
        <div style={styles["accordionContent"]}>{content}</div>
      )}
    </div>
  );

  return (
    <div>
      {renderSection(
        "Checkout Benefits & Voucher Network",
        <CBVNContent integrationState={integrationState} uiState={uiState} />,
        IntegrationType.CB_VN,
      )}
      {renderSection(
        "Checkout Products",
        <CheckoutProductsContent
          integrationState={integrationState}
          uiState={uiState}
        />,
        IntegrationType.CHECKOUT_PRODUCTS,
      )}
      {renderSection(
        "Optimize",
        <OptimizeContent
          integrationState={integrationState}
          uiState={uiState}
        />,
        IntegrationType.OPTIMIZE,
      )}
    </div>
  );
}
