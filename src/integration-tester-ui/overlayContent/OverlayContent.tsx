import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";

export function OverlayContent(props: {
  overlayDimensions: OverlayDimensions;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return (
    <div style={{ height: "100%", width: "100%", display: "block" }}>
      blaaaa
    </div>
  );
}
