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
import { DownloadIntegrationTestReport } from "../../../test-report/integration-test-report";
import type { TestResult } from "../../testing-storage";
import { OverlaySize, PageType, type StepProps } from "../../testing-storage";
import { AccordionContent } from "./components/accordion-content";
import { StatusItem } from "./components/status-item";

export function TestContent({ overlayState }: StepProps): JSX.Element {
  const {
    handleTestCompletion,
    getCurrentTestRun,
    handleNavigateToSuccessPage,
    setCurrentTestRunData,
    handlePageSelection,
  } = overlayState;
  const currentTestRun = getCurrentTestRun();
  const isSmall = currentTestRun.overlaySize === OverlaySize.SMALL;
  const currentPageTestResult = (
    currentTestRun.currentPageType === PageType.LANDING
      ? currentTestRun.landingPageResult
      : currentTestRun.currentPageType === PageType.SUCCESS
        ? currentTestRun.successPageResult
        : undefined
  ) as TestResult;
  const currentPageTesterState = currentPageTestResult.integrationTester;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    color: "white",
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
      <h2 style={headingStyle}>
        {currentTestRun.currentPageType === PageType.LANDING
          ? "Landing Page Test"
          : "Order Success Page Test"}
      </h2>
      <div style={statusContainerStyle}>
        <StatusItem
          label="Status"
          value={
            // uiState.testingState === TestingState.IN_PROGRESS
            //   ? "Testing..."
            //   :
            "Completed"
          }
          icon={
            // uiState.testingState === TestingState.IN_PROGRESS
            //   ? undefined
            //   :
            CheckCircle
          }
          color={
            // uiState.testingState === TestingState.IN_PROGRESS
            //   ? "#FBBF24"
            //   :
            "#34D399"
          }
          small={isSmall}
        />
        <StatusItem
          label="Integration"
          value={isDetected ? "Detected" : "Not Detected"}
          icon={isDetected ? CheckCircle : XCircle}
          color={isDetected ? "#34D399" : "#F87171"}
          small={isSmall}
        />
        {isDetected && (
          <>
            <StatusItem
              label="Type"
              value={
                currentPageTesterState?.integrationType.elementValue ||
                "Unknown"
              }
              small={isSmall}
            />
            <StatusItem
              label="State"
              value={currentPageTestResult.integrationDetector.detectionState}
              small={isSmall}
            />
          </>
        )}
      </div>
      {/* {currentTestRun.currentPageType === PageType.LANDING &&
        renderTestResult(overlayState.landingPageResult, "Landing Page")}
      {currentTestRun.currentPageType === PageType.SUCCESS && (
        <>
          {renderTestResult(currentTestRun.landingPageResult, "Landing Page")}
          {renderTestResult(currentTestRun.successPageResult, "Success Page")}
        </>
      )} */}
      {currentTestRun.currentPageType === PageType.SUCCESS ? (
        <div>
          <DownloadIntegrationTestReport
            currentTestRun={currentTestRun}
            overlayState={overlayState}
          />
          <button
            onClick={async () => {
              const screenshotUrl = await overlayState._getScreenshot();
              setScreenshotUrl(screenshotUrl);
            }}
          >
            take screenshot
          </button>
          <h3>Screenshot</h3>
          <img
            src={screenshotUrl}
            alt="Screenshot"
            style={{ maxWidth: "100%" }}
          />
        </div>
      ) : (
        <></>
      )}
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
      {currentTestRun.overlaySize === OverlaySize.LARGE && (
        <AccordionContent
          overlayState={overlayState}
          currentTestRun={currentTestRun}
          currentPageTestResult={currentPageTestResult}
        />
      )}
    </div>
  );
}
