import { AnimatePresence, motion } from "framer-motion";
import type { JSX } from "react";
import React from "react";

import { debugUi } from "../../logger/ui-logger";
import type { OverlayState } from "../hooks/use-overlay-state";
import { testingFlowConfig } from "../testing-flow-config";
import {
  OverlaySize,
  type StageType,
  type StepProps,
} from "../testing-storage";

interface OverlayContentProps {
  overlayState: OverlayState;
}

export function OverlayContent({
  overlayState,
}: OverlayContentProps): JSX.Element {
  const { getCurrentTestRun } = overlayState;
  const currentTestRun = getCurrentTestRun();

  debugUi("OverlayContent", "Rendering", {
    currentStage: currentTestRun.currentStage,
  });
  const stageInfo = testingFlowConfig.stages[
    currentTestRun.currentStage
  ] as StageType;
  const StageComponent = (
    testingFlowConfig.stages[currentTestRun.currentStage] as StageType
  ).component as (props: StepProps) => JSX.Element;

  const contentVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const padding =
    currentTestRun.overlaySize === OverlaySize.LARGE
      ? "1rem"
      : currentTestRun.overlaySize === OverlaySize.MEDIUM
        ? "0.75rem"
        : "0.25rem";
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentTestRun.currentStage}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <div style={{ padding }}>
          <StageComponent overlayState={overlayState} stageInfo={stageInfo} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
