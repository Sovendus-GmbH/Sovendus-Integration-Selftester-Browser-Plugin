import type { JSX } from "react";
import React from "react";

import { debugUi } from "../../logger/ui-logger";
import type { OverlayState } from "../hooks/use-overlay-state";
import { testingFlowConfig } from "../testing-flow-config";
import type { StageType, StepProps } from "../testing-storage";

interface OverlayContentProps {
  overlayState: OverlayState;
  toolbarHeight: number;
}

export function OverlayContent({
  overlayState,
  toolbarHeight,
}: OverlayContentProps): JSX.Element {
  const { getCurrentTestRun } = overlayState;
  const currentTestRun = getCurrentTestRun();
  debugUi("OverlayContent", "Rendering", {
    currentStage: currentTestRun.currentStage,
  });

  const StageComponent = (
    testingFlowConfig.stages[currentTestRun.currentStage] as StageType
  ).component as (props: StepProps) => JSX.Element;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: `calc(100% - ${toolbarHeight}px)`,
      }}
    >
      <div
        style={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        <StageComponent overlayState={overlayState} />
      </div>
    </div>
  );
}
