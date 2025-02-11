import type { JSX } from "react";
import React from "react";

import { colors } from "../../styles";
import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { Button } from "../button";

export function InitialPrompt({
  overlayState: { transition },
}: StepProps): JSX.Element {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: colors.text,
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <Button
          size="small"
          onClick={() =>
            transition(testingFlowConfig.stages.initialPrompt.transitions.CHECK)
          }
        >
          Check Sovendus
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() =>
            transition(
              testingFlowConfig.stages.initialPrompt.transitions.DECLINE,
            )
          }
        >
          Disable on this Page
        </Button>
      </div>
    </div>
  );
}
