import { ArrowLeft, RotateCcw } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import type { TestRun } from "../../hooks/useOverlayState";
import type { StepProps } from "../../types";

export function TestHistory({ overlayState }: StepProps): JSX.Element {
  const { getTestRunHistory } = overlayState;
  const completedTests = getTestRunHistory().filter((test) => test.completed);

  const containerStyle: React.CSSProperties = {
    color: "white",
    display: "flex",
    flexDirection: "column",
    height: "100%",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const contentStyle: React.CSSProperties = {
    flexGrow: 1,
    overflowY: "auto",
  };

  const emptyStateStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1.5rem",
    borderRadius: "0.5rem",
    textAlign: "center",
  };

  const listStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  };

  const listItemStyle: React.CSSProperties = {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "1rem",
    borderRadius: "0.5rem",
  };

  const buttonContainerStyle: React.CSSProperties = {
    marginTop: "1rem",
    display: "flex",
    justifyContent: "space-between",
  };

  const buttonStyle: React.CSSProperties = {
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
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Test History</h2>
      <div style={contentStyle}>
        {completedTests.length === 0 ? (
          <div style={emptyStateStyle}>
            <p style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
              No tests have been completed yet.
            </p>
            <p style={{ fontSize: "0.875rem", color: "#D1D5DB" }}>
              Complete a full test to see results here.
            </p>
          </div>
        ) : (
          <ul style={listStyle}>
            {completedTests.map((test) => (
              <li key={test.id} style={listItemStyle}>
                <h3
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Test Run {test.id}
                </h3>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Run at: {new Date(test.startTime).toLocaleString()}
                </p>
                <p style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Consent:{" "}
                  <span
                    style={{ color: test.withConsent ? "#34D399" : "#FBBF24" }}
                  >
                    {test.withConsent ? "With Consent" : "Without Consent"}
                  </span>
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <TestResultDisplay
                    title='Landing Page'
                    result={test.landingPageResult}
                  />
                  <TestResultDisplay
                    title='Success Page'
                    result={test.successPageResult}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={buttonContainerStyle}>
        <button
          onClick={overlayState.transitionBack}
          style={{
            ...buttonStyle,
            backgroundColor: "#4B5563",
          }}
        >
          <ArrowLeft size={20} style={{ marginRight: "0.5rem" }} />
          <span>Back</span>
        </button>
        <button onClick={overlayState.startNewTest} style={buttonStyle}>
          <RotateCcw size={20} style={{ marginRight: "0.5rem" }} />
          <span>Start New Test</span>
        </button>
      </div>
    </div>
  );
}

function TestResultDisplay({
  title,
  result,
}: {
  title: string;
  result: TestRun["landingPageResult"];
}): JSX.Element {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    marginBottom: "0.5rem",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "500",
    marginBottom: "0.25rem",
  };

  const statusStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
  };

  const getStatusColor = (): string => {
    switch (result.status) {
      case "success":
        return "#34D399";
      case "error":
        return "#F87171";
      default:
        return "#FBBF24";
    }
  };

  return (
    <div style={containerStyle}>
      <h4 style={titleStyle}>{title}</h4>
      <p style={statusStyle}>
        Status:{" "}
        <span style={{ marginLeft: "0.5rem", color: getStatusColor() }}>
          {result.status}
        </span>
      </p>
      {result.details && (
        <p
          style={{
            fontSize: "0.875rem",
            marginTop: "0.25rem",
            color: "#D1D5DB",
          }}
        >
          {result.details}
        </p>
      )}
    </div>
  );
}
