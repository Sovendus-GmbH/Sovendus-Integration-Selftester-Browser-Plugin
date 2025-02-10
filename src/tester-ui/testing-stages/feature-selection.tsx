import { ArrowLeft, CheckCircle, HelpCircle } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { Button } from "../button";
import { H1 } from "../typography";

export function FeatureSelection({
  overlayState: { transition, getCurrentTestRun },
}: StepProps): JSX.Element {
  const currentTestRun = getCurrentTestRun();

  return (
    <div>
      <H1 overlaySize={currentTestRun.overlaySize}>
        How can we assist you today?
      </H1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          marginBottom: "0.75rem",
        }}
      >
        <FeatureOption
          title="Test Sovendus Integration"
          icon={<CheckCircle />}
          onClick={() =>
            transition(
              testingFlowConfig.stages.featureSelection.transitions
                .TEST_INTEGRATION,
            )
          }
        />
        <FeatureOption
          title="Integration Help"
          icon={<HelpCircle />}
          onClick={() =>
            transition(
              testingFlowConfig.stages.featureSelection.transitions
                .INTEGRATION_HELP,
            )
          }
        />
      </div>
      <Button
        onClick={() =>
          transition(testingFlowConfig.stages.featureSelection.transitions.BACK)
        }
        variant="secondary"
      >
        <ArrowLeft size={15} style={{ marginRight: "0.25rem" }} />
        Back
      </Button>
    </div>
  );
}

interface FeatureOptionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

function FeatureOption({
  title,
  icon,
  onClick,
}: FeatureOptionProps): JSX.Element {
  return (
    <Button onClick={onClick} variant="transparent">
      <div
        style={{
          marginRight: "0.5rem",
        }}
      >
        {icon}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          flex: 1,
        }}
      >
        <span
          style={{
            fontWeight: "600",
          }}
        >
          {title}
        </span>
      </div>
    </Button>
  );
}
