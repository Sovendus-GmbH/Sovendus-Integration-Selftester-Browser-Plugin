import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { ArrowLeft, Eye, Grip, History, Minus, Plus } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { DetectionState } from "../../detector/integration-detector";
import type { OverlayState } from "../hooks/use-overlay-state";
import { colors, styles } from "../styles";
import { testingFlowConfig } from "../testing-flow-config";
import type { StageType, TestRun } from "../testing-storage";
import { OverlaySize } from "../testing-storage";

interface OverlayToolbarProps {
  listeners: SyntheticListenerMap | undefined;
  overlayState: OverlayState;
  toolbarRef: React.RefObject<HTMLDivElement | null>;
}

export function OverlayToolbar({
  toolbarRef,
  listeners,
  overlayState: {
    openBlacklistConfirmation,
    transitionBack,
    getCurrentTestRun,
    showTestHistory,
    resizeOverlay,
  },
}: OverlayToolbarProps): JSX.Element {
  const currentTestRun = getCurrentTestRun();
  const stageConfig = testingFlowConfig.stages[
    currentTestRun.currentStage
  ] as StageType;
  const availableSizes = stageConfig.availableSizes;
  const currentSizeIndex = availableSizes.indexOf(currentTestRun.overlaySize);

  const isSmall = currentTestRun.overlaySize === OverlaySize.SMALL;
  const showMinusButton = currentSizeIndex > 0;
  const showPlusButton = currentSizeIndex < availableSizes.length - 1;
  const showCloseButton = currentTestRun.currentStage !== "confirmBlacklist";

  const toolbarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.25rem",
    backgroundColor: colors.backgroundToolBar,
    backdropFilter: "blur(4px)",
    ...styles.text,
  };

  const dragHandleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "move",
    padding: "0.125rem 0.25rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.2s",
    flexGrow: 1,
    ...styles.text,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    ...styles.text,
  };

  const buttonStyle: React.CSSProperties = {
    ...styles.text,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.125rem",
    borderRadius: "0.25rem",
    transition: "color 0.2s",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
  };

  return (
    <div style={toolbarStyle} ref={toolbarRef}>
      <div {...listeners} style={dragHandleStyle}>
        <Grip size={16} />
        {!isSmall && (
          <span
            style={{
              fontWeight: "600",
              fontSize: "1rem",
              display: "flex",
              marginTop: "auto",
              marginBottom: "auto",
            }}
          >
            Sovendus Tester
          </span>
        )}
      </div>
      <div style={buttonContainerStyle}>
        <DetectionStatus currentTestRun={currentTestRun} />
        <button onClick={showTestHistory} style={buttonStyle}>
          <History size={16} />
        </button>
        {showPlusButton && (
          <button onClick={() => resizeOverlay("increase")} style={buttonStyle}>
            <Plus size={16} />
          </button>
        )}
        {showMinusButton && (
          <button onClick={() => resizeOverlay("decrease")} style={buttonStyle}>
            <Minus size={16} />
          </button>
        )}
        {showCloseButton && (
          <button onClick={openBlacklistConfirmation} style={buttonStyle}>
            <Eye size={16} />
          </button>
        )}
        {!showCloseButton && (
          <button onClick={transitionBack} style={buttonStyle}>
            <ArrowLeft size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

function DetectionStatus({
  currentTestRun,
}: {
  currentTestRun: TestRun;
}): JSX.Element {
  const status =
    currentTestRun.successPageResult.integrationDetector?.detectionState ===
    DetectionState.DETECTED
      ? currentTestRun.successPageResult.integrationDetector?.detectionState
      : currentTestRun.landingPageResult.integrationDetector?.detectionState ===
          DetectionState.DETECTED
        ? currentTestRun.landingPageResult.integrationDetector?.detectionState
        : DetectionState.NOT_DETECTED;
  const color =
    status === DetectionState.NOT_DETECTED ? colors.error : colors.success;

  const statusStyle: React.CSSProperties = {
    width: "0.85rem",
    height: "0.85rem",
    borderRadius: "50%",
    backgroundColor: color,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: "auto",
    marginBottom: "auto",
  };

  return <div style={statusStyle} title={`Integration ${status}`} />;
}
