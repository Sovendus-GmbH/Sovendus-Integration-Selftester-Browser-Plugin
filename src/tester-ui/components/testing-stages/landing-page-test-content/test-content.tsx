import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { DetectionState } from "../../../../detector/integration-detector";
import {
  OverlaySize,
  PageType,
  type StepProps,
} from "../../../testing-storage";
import { StatusItem } from "../components/status-item";

export function LandingPageTestContent({
  overlayState,
}: StepProps): JSX.Element {
  const {
    getCurrentTestRun,
    handleNavigateToSuccessPage,
    setCurrentTestRunData,
    handlePageSelection,
    takeScreenshot,
  } = overlayState;
  const currentTestRun = getCurrentTestRun();
  const isSmall = currentTestRun.overlaySize === OverlaySize.SMALL;
  const currentPageTestResult = currentTestRun.landingPageResult;
  const currentPageTesterState = currentPageTestResult.integrationTester;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    color: "white",
    margin: "10px",
  };

  const headingStyle: React.CSSProperties = {
    fontWeight: "bold",
    fontSize: isSmall ? "0.875rem" : "1rem",
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
  const [screenshotUrl, setScreenshotUrl] = React.useState<string | null>(null);
  return (
    <div style={containerStyle}>
      <div style={headingStyle}>Landing Page Test</div>
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
          color={"#fff"}
          small={isSmall}
        />
      </div>
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={async () => {
          const success = await takeScreenshot(PageType.LANDING);
          // TODO handle error
        }}
        style={buttonStyle}
      >
        <span style={{ marginRight: "0.5rem" }}>take screenshot</span>
        <ArrowRight size={isSmall ? 16 : 20} />
      </button>

      {currentTestRun.currentPageType === PageType.LANDING && (
        <button onClick={handleNavigateToSuccessPage} style={buttonStyle}>
          <span style={{ marginRight: "0.5rem" }}>
            {currentTestRun.successPageResult.integrationDetector.thankYouPage
              .isSovendusThankYouPage
              ? "Go back to the success page result"
              : "I'm on the success page"}
          </span>
          <ArrowRight size={isSmall ? 16 : 20} />
        </button>
      )}
      {currentTestRun.currentPageType === PageType.SUCCESS && (
        <button
          onClick={() => handlePageSelection(PageType.LANDING)}
          style={buttonStyle}
        >
          <span style={{ marginRight: "0.5rem" }}>
            Back to landing page test
          </span>
          <ArrowLeft size={isSmall ? 16 : 20} />
        </button>
      )}
      <button onClick={overlayState.startNewTest} style={buttonStyle}>
        <span style={{ marginRight: "0.5rem" }}>Restart Test</span>
        <RotateCcw size={isSmall ? 16 : 20} />
      </button>
      {/* {currentTestRun.overlaySize === OverlaySize.LARGE && (
        <AccordionContent
          overlayState={overlayState}
          currentTestRun={currentTestRun}
          currentPageTestResult={currentPageTestResult}
        />
      )} */}
    </div>
  );
}
