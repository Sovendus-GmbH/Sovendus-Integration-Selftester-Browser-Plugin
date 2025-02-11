import { ArrowLeft, CheckCircle } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { colors } from "../../styles";
import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { OverlaySize } from "../../testing-storage";
import { Alert } from "../alert";
import { Button } from "../button";
import { H1, H3, P } from "../typography";

export function ConsentSelectionStep({
  overlayState: { getCurrentTestRun, transition },
}: StepProps): JSX.Element {
  const currentTestRun = getCurrentTestRun();

  return (
    <div style={{ margin: "auto", maxWidth: "580px" }}>
      <H1 overlaySize={OverlaySize.LARGE}>Complete Two Test Runs</H1>
      <Alert level="warning">
        To ensure comprehensive results, you need to complete two separate test
        runs:
      </Alert>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.5rem",
          marginTop: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <TestRunOption
          title="Test Run 1: WITH Consent"
          description="Simulate a user who has given consent"
          onClick={() =>
            transition(
              testingFlowConfig.stages.consentSelection.transitions
                .WITH_CONSENT,
            )
          }
          isCompleted={currentTestRun.withConsent === true}
        />
        <TestRunOption
          title="Test Run 2: WITHOUT Consent"
          description="Simulate a user who has not given consent"
          onClick={() =>
            transition(
              testingFlowConfig.stages.consentSelection.transitions
                .WITHOUT_CONSENT,
            )
          }
          isCompleted={currentTestRun.withConsent === false}
        />
      </div>

      <Alert level="info">
        After completing both test runs, you'll have a comprehensive view of
        your integration.
      </Alert>
      <Button
        onClick={() =>
          transition(testingFlowConfig.stages.consentSelection.transitions.BACK)
        }
        style={{ marginTop: "2rem" }}
      >
        <ArrowLeft size={16} />
        Back
      </Button>
    </div>
  );
}

interface TestRunOptionProps {
  title: string;
  description: string;
  onClick: () => void;
  isCompleted: boolean;
}

function TestRunOption({
  title,
  description,
  onClick,
  isCompleted,
}: TestRunOptionProps): JSX.Element {
  return (
    <div>
      <Button
        onClick={onClick}
        style={{
          display: "flex",
          alignItems: "center",
          borderRadius: "0.5rem",
          border: `1px solid ${colors.border}`,
          transition: "all 0.2s",
          backgroundColor: isCompleted ? colors.success : "unset",
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "left" }}>
          <H3
            overlaySize={OverlaySize.LARGE}
            style={{ marginBottom: "0.25rem" }}
          >
            {title}
          </H3>
          <P overlaySize={OverlaySize.LARGE}>{description}</P>
        </div>
        {isCompleted && (
          <CheckCircle
            size={24}
            style={{ marginLeft: "0.5rem", color: "white" }}
          />
        )}
      </Button>
    </div>
  );
}

export const ConsentSelection = ConsentSelectionStep;
