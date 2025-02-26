import { ArrowLeft, RotateCcw } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { Button } from "../components/button";
import { H1, H2, H3, P } from "../components/typography";
import { colors } from "../styles";
import type { TestRun } from "../testing-storage";
import { OverlaySize, type StepProps } from "../testing-storage";

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
    // fontSize: "1.5rem",
    // fontWeight: "bold",
    // marginBottom: "1rem",
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

  return (
    <div style={containerStyle}>
      <H1 overlaySize={OverlaySize.LARGE} style={headingStyle}>
        Test History
      </H1>
      <div style={contentStyle}>
        {completedTests.length === 0 ? (
          <div style={emptyStateStyle}>
            <H2
              overlaySize={OverlaySize.LARGE}
              style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}
            >
              No tests have been completed yet.
            </H2>
            <P
              overlaySize={OverlaySize.LARGE}
              style={{ fontSize: "0.875rem", color: colors.textLight }}
            >
              Complete a full test to see results here.
            </P>
          </div>
        ) : (
          <div style={listStyle}>
            {completedTests.map((test) => (
              <div key={test.id} style={listItemStyle}>
                <P
                  overlaySize={OverlaySize.LARGE}
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: "600",
                    marginBottom: "0.5rem",
                  }}
                >
                  Test Run {test.id}
                </P>
                <P
                  overlaySize={OverlaySize.LARGE}
                  style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}
                >
                  Run at: {new Date(test.startTime).toLocaleString()}
                </P>
                <div style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>
                  Consent:{" "}
                  <P
                    overlaySize={OverlaySize.LARGE}
                    style={{ color: test.withConsent ? "#34D399" : "#FBBF24" }}
                  >
                    {test.withConsent ? "With Consent" : "Without Consent"}
                  </P>
                </div>
                <div style={{ marginTop: "1rem" }}>
                  <TestResultDisplay
                    title="Landing Page"
                    result={test.landingPageResult}
                  />
                  <TestResultDisplay
                    title="Success Page"
                    result={test.successPageResult}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={buttonContainerStyle}>
        <Button onClick={overlayState.transitionBack} variant="secondary">
          <ArrowLeft size={20} style={{ marginRight: "0.5rem" }} />
          <span>Back</span>
        </Button>
        <Button variant="primary" onClick={overlayState.startNewTest}>
          <RotateCcw size={20} style={{ marginRight: "0.5rem" }} />
          <span>Start New Test</span>
        </Button>
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
      <H3 overlaySize={OverlaySize.LARGE}>{title}</H3>
      <div style={statusStyle}>
        Status:{" "}
        <span style={{ marginLeft: "0.5rem", color: getStatusColor() }}>
          {result.status}
        </span>
      </div>
      {result.details && (
        <div
          style={{
            fontSize: "0.875rem",
            marginTop: "0.25rem",
            color: "#D1D5DB",
          }}
        >
          {result.details}
        </div>
      )}
    </div>
  );
}
