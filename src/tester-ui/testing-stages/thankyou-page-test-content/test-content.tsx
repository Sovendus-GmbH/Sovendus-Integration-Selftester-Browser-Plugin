import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { DetectionState } from "../../../detector/integration-detector";
import DownloadIntegrationTestReport from "../../../test-report/integration-test-report";
import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { OverlaySize, PageType } from "../../testing-storage";
import { StatusItem } from "../components/status-item";
import { CBVNContent } from "./cb-vn-content";
import { CheckoutProductsContent } from "./checkout products-content";
import { OptimizeContent } from "./optimize-content";

export function ThankyouTestContent({
  overlayState,
  stageInfo,
}: StepProps): JSX.Element {
  const { getCurrentTestRun, takeScreenshot, transition } = overlayState;
  const currentTestRun = getCurrentTestRun();
  const isSmall = currentTestRun.overlaySize === OverlaySize.SMALL;
  const currentPageTestResult = currentTestRun.successPageResult;

  const currentPageTesterState = currentPageTestResult.integrationTester;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    borderRadius: "0.5rem",
    color: "#fff",
    maxWidth: "800px",
    margin: "1rem auto",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  };

  const headingStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: isSmall ? "1.125rem" : "1.5rem",
    marginBottom: "0.5rem",
    color: "#fff",
    textAlign: "center",
  };

  const statusContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  };

  const buttonStyle: React.CSSProperties = {
    marginTop: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.5rem 1rem",
    backgroundColor: "#4F46E5",
    color: "white",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    outline: "none",
    fontSize: isSmall ? "0.875rem" : "1rem",
  };

  const isDetected =
    currentPageTestResult.integrationDetector?.detectionState ===
    DetectionState.DETECTED;
  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Order Success Page Test</div>
      <div style={statusContainerStyle}>
        <StatusItem
          label="Status"
          value="Completed"
          icon={CheckCircle}
          color="#10B981"
          small={isSmall}
        />
        <StatusItem
          label="Integration"
          value={isDetected ? "Detected" : "Not Detected"}
          icon={isDetected ? CheckCircle : XCircle}
          color={isDetected ? "#10B981" : "#EF4444"}
          small={isSmall}
        />
        <StatusItem
          label="Integration Type"
          value={
            currentPageTestResult.integrationTester?.integrationType
              ?.elementValue || "Unknown"
          }
          color={
            currentPageTestResult.integrationTester?.integrationType
              ?.elementValue
              ? "#fff"
              : "#fff"
          }
          small={isSmall}
        />
      </div>
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          const success = await takeScreenshot(PageType.SUCCESS);
          // TODO handle error
        }}
        style={buttonStyle}
      >
        <span style={{ marginRight: "0.5rem" }}>take screenshot</span>
        <ArrowRight size={isSmall ? 16 : 20} />
      </button>

      <DownloadIntegrationTestReport
        currentTestRun={currentTestRun}
        overlayState={overlayState}
      />

      <button
        onClick={() =>
          transition(testingFlowConfig.stages.successPageTest.transitions.BACK)
        }
        style={buttonStyle}
      >
        <span style={{ marginRight: "0.5rem" }}>Back to landing page test</span>
        <ArrowLeft size={isSmall ? 16 : 20} />
      </button>
      <button
        onClick={overlayState.startNewTest}
        style={{
          ...buttonStyle,
          backgroundColor: "#2563EB",
          marginTop: "1rem",
        }}
      >
        <span style={{ marginRight: "0.5rem" }}>Restart Test</span>
        <RotateCcw size={isSmall ? 16 : 20} />
      </button>
      {currentTestRun.overlaySize === OverlaySize.LARGE && (
        <div>
          <CBVNContent
            overlayState={overlayState}
            currentTestRun={currentTestRun}
            currentPageTestResult={currentPageTestResult}
            stageInfo={stageInfo}
          />
          <CheckoutProductsContent
            overlayState={overlayState}
            currentTestRun={currentTestRun}
            currentPageTestResult={currentPageTestResult}
            stageInfo={stageInfo}
          />
          <OptimizeContent
            overlayState={overlayState}
            currentTestRun={currentTestRun}
            currentPageTestResult={currentPageTestResult}
            stageInfo={stageInfo}
          />
        </div>
      )}
    </div>
  );
}
