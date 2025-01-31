import { ArrowRight, CheckCircle, RotateCcw, XCircle } from "lucide-react";
import type { JSX } from "react";
import React from "react";
import { useEffect } from "react";

import type { TestResult } from "../../hooks/useOverlayState";
import type { StepProps } from "../../types";
import { OverlaySize, PageType } from "../../types";
import { AccordionContent } from "./components/accordion-content";
import { StatusItem } from "./components/status-item";

export function TestContent({ overlayState }: StepProps): JSX.Element {
  const {
    testerStorage: { uiState },
    handleTestCompletion,
    getCurrentTestRun,
    handleNavigateToSuccessPage,
  } = overlayState;
  const isSmall = uiState.overlaySize === OverlaySize.SMALL;
  const currentTestRun = getCurrentTestRun();
  const currentSelfTester =
    currentTestRun.currentPageType === PageType.LANDING
      ? currentTestRun.landingPageResult
      : currentTestRun.currentPageType === PageType.SUCCESS
        ? currentTestRun.successPageResult
        : undefined;
  useEffect(() => {
    if (uiState.testingState === TestingState.IN_PROGRESS) {
      const timer = setTimeout(() => {
        const result: TestResult = {
          status: integrationState.integrationState.detected
            ? "success"
            : "error",
          details: integrationState.integrationState.detected
            ? "Integration detected successfully"
            : "Integration not detected",
        };
        handleTestCompletion(result);
      }, 3000);

      return (): void => clearTimeout(timer);
    }
    return;
  }, []);

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

  const renderTestResult = (result: TestResult | null, title: string) => {
    if (!result) {
      return null;
    }
    return (
      <div style={{ marginTop: "0.5rem" }}>
        <h3
          style={{
            fontWeight: "600",
            fontSize: isSmall ? "0.75rem" : "0.875rem",
          }}
        >
          {title} Test Result:
        </h3>
        <StatusItem
          label='Status'
          value={result.status}
          icon={result.status === "success" ? CheckCircle : XCircle}
          color={result.status === "success" ? "#34D399" : "#F87171"}
          small={isSmall}
        />
        {result.details && (
          <p
            style={{
              fontSize: isSmall ? "0.75rem" : "0.875rem",
              marginTop: "0.25rem",
            }}
          >
            {result.details}
          </p>
        )}
      </div>
    );
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>
        {currentTestRun.currentPageType === PageType.LANDING
          ? "Landing Page Test"
          : "Order Success Page Test"}
      </h2>
      <div style={statusContainerStyle}>
        <StatusItem
          label='Status'
          value={
            overlayState.uiState.testingState === TestingState.IN_PROGRESS
              ? "Testing..."
              : "Completed"
          }
          icon={
            overlayState.uiState.testingState === TestingState.IN_PROGRESS
              ? undefined
              : CheckCircle
          }
          color={
            overlayState.uiState.testingState === TestingState.IN_PROGRESS
              ? "#FBBF24"
              : "#34D399"
          }
          small={isSmall}
        />
        <StatusItem
          label='Integration'
          value={
            overlayState.integrationState.integrationState.detected
              ? "Detected"
              : "Not Detected"
          }
          icon={
            overlayState.integrationState.integrationState.detected
              ? CheckCircle
              : XCircle
          }
          color={
            overlayState.integrationState.integrationState.detected
              ? "#34D399"
              : "#F87171"
          }
          small={isSmall}
        />
        {overlayState.integrationState.integrationState.detected && (
          <>
            <StatusItem
              label='Type'
              value={overlayState.uiState.integrationType || "Unknown"}
              small={isSmall}
            />
            <StatusItem
              label='State'
              value={
                overlayState.integrationState.integrationState.status
                  .detectionState
              }
              small={isSmall}
            />
          </>
        )}
      </div>
      {currentTestRun.currentPageType === PageType.LANDING &&
        renderTestResult(overlayState.landingPageResult, "Landing Page")}
      {currentTestRun.currentPageType === PageType.SUCCESS && (
        <>
          {renderTestResult(currentTestRun.landingPageResult, "Landing Page")}
          {renderTestResult(currentTestRun.successPageResult, "Success Page")}
        </>
      )}
      {currentTestRun.currentPageType === PageType.LANDING &&
        uiState.testingState === TestingState.COMPLETED && (
          <button onClick={handleNavigateToSuccessPage} style={buttonStyle}>
            <span style={{ marginRight: "0.5rem" }}>
              I'm on the success page
            </span>
            <ArrowRight size={isSmall ? 16 : 20} />
          </button>
        )}
      {currentPageType === PageType.SUCCESS &&
        uiState.testingState === TestingState.COMPLETED && (
          <button onClick={overlayState.startNewTest} style={buttonStyle}>
            <span style={{ marginRight: "0.5rem" }}>Restart Test</span>
            <RotateCcw size={isSmall ? 16 : 20} />
          </button>
        )}
      {uiState.overlaySize === OverlaySize.LARGE && (
        <AccordionContent
          overlayState={overlayState}
          currentTestRun={currentTestRun}
        />
      )}
    </div>
  );
}
