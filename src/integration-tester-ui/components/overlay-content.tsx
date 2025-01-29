import React, { JSX } from "react";
import type { StepProps } from "../types";
import { OverlayState } from "../hooks/useOverlayState";
import { StageName, testingFlowConfig } from "../testing-flow-config";
import { debug } from "../../logger/logger";

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

  const StageComponent = testingFlowConfig.stages[
    overlayState.currentStage as StageName
  ].component as (props: StepProps) => JSX.Element;

  return (
    <div className='flex flex-col h-full'>
      <div className='flex-grow p-2 overflow-y-auto'>
        <StageComponent overlayState={overlayState} />
      </div>
    </div>
  );
}
