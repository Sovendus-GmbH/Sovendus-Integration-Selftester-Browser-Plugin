import type { JSX } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../../integration-detector/integrationDetector";
import type { UiState } from "../../../integration-tester-loader/integrationTesterLoader";

export function OverlayContent(props: {
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return (
    <div style={{ height: "100%", width: "100%", display: "block" }}>
      blaaaa
    </div>
  );
}
