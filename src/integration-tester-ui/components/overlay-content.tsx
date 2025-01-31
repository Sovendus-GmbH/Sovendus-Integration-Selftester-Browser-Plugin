import type { JSX } from "react";
import React from "react";

import { debug } from "../../logger/logger";
import type { OverlayState } from "../hooks/useOverlayState";
import { testingFlowConfig } from "../testing-flow-config";
import type { StepProps } from "../types";

interface OverlayContentProps {
  overlayState: OverlayState;
}

export function OverlayContent({
  overlayState,
}: OverlayContentProps): JSX.Element {
  debug("OverlayContent", "Rendering", {
    currentStage: overlayState.currentStage,
  });

  if (!overlayState.uiState.isPromptVisible) {
    return <></>;
  }

  const StageComponent = testingFlowConfig.stages[overlayState.currentStage]
    .component as (props: StepProps) => JSX.Element;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow p-2 overflow-y-auto'>
        <StageComponent overlayState={overlayState} />
      </div>
    </div>
  );
}
