import type { JSX } from "react";
import React from "react";

import { debug } from "../../logger/logger";
import type { OverlayState } from "../hooks/useOverlayState";
import { testingFlowConfig } from "../testing-flow-config";
import type { StageType, StepProps } from "../testing-storage";

interface OverlayContentProps {
  overlayState: OverlayState;
}

export function OverlayContent({
  overlayState,
}: OverlayContentProps): JSX.Element {
  const { getCurrentTestRun } = overlayState;
  const currentTestRun = getCurrentTestRun();
  debug("OverlayContent", "Rendering", {
    currentStage: currentTestRun.currentStage,
  });

  const StageComponent = (
    testingFlowConfig.stages[currentTestRun.currentStage] as StageType
  ).component as (props: StepProps) => JSX.Element;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow p-2 overflow-y-auto'>
        <StageComponent overlayState={overlayState} />
      </div>
    </div>
  );
}
