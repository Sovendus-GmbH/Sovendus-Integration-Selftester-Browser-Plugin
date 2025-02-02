import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  XCircle,
} from "lucide-react";
import type { JSX } from "react";
import React, { useState } from "react";

import { DetectionState } from "../../../integration-detector/integrationDetector";
import type { StepProps } from "../../testing-storage";
import { OverlaySize } from "../../testing-storage";
import { StatusItem } from "./components/status-item";

export function NavigationPrompt({
  overlayState: {
    getCurrentTestRun,
    handleNavigateToSuccessPage,
    testerStorage: { uiState },
  },
}: StepProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSmall = uiState.overlaySize === OverlaySize.SMALL;
  const currentTestRun = getCurrentTestRun();
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "white",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: isSmall ? "1.125rem" : "1.25rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    textAlign: "center",
  };

  const resultContainerStyle: React.CSSProperties = {
    width: "100%",
    marginBottom: "1rem",
  };

  const resultHeaderStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  };

  const resultDetailsStyle: React.CSSProperties = {
    marginTop: "0.5rem",
    fontSize: isSmall ? "0.75rem" : "0.875rem",
  };

  const paragraphStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "1rem",
    fontSize: isSmall ? "0.75rem" : "0.875rem",
  };

  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "#4F46E5",
    color: "white",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    outline: "none",
    fontSize: isSmall ? "0.875rem" : "1rem",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Navigate to Order Success Page</h2>
      {currentTestRun.landingPageResult && (
        <div style={resultContainerStyle}>
          <div
            style={resultHeaderStyle}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <StatusItem
              label='Landing Page Test'
              value={
                currentTestRun.landingPageResult.integrationDetector
                  .detectionState
              }
              icon={
                currentTestRun.landingPageResult.integrationDetector
                  .detectionState === DetectionState.DETECTED
                  ? CheckCircle
                  : XCircle
              }
              color={
                currentTestRun.landingPageResult.integrationDetector
                  .detectionState === DetectionState.DETECTED
                  ? "#34D399"
                  : "#F87171"
              }
              small={isSmall}
            />
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </div>
          {isExpanded && (
            <div style={resultDetailsStyle}>
              <p>
                {JSON.stringify(
                  currentTestRun.landingPageResult.integrationDetector,
                )}
              </p>
            </div>
          )}
        </div>
      )}
      <p style={paragraphStyle}>
        Please complete an order or navigate to the order success page to
        continue testing.
      </p>
      <button onClick={handleNavigateToSuccessPage} style={buttonStyle}>
        <span style={{ marginRight: "0.5rem" }}>I'm on the success page</span>
        <ArrowRight size={isSmall ? 16 : 20} />
      </button>
    </div>
  );
}
