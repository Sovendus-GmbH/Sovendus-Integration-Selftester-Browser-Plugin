import { ArrowLeft, Eye, Grip, History, Minus, Plus } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { DetectionState } from "../../integration-detector/integrationDetector";
import type { OverlayState } from "../hooks/useOverlayState";
import type { StageType } from "../testing-flow-config";
import { testingFlowConfig } from "../testing-flow-config";
import { OverlaySize } from "../types";

interface OverlayToolbarProps {
  dragHandleProps?: Record<string, any>;
  overlayState: OverlayState;
}

export function OverlayToolbar({
  dragHandleProps,
  overlayState: {
    openBlacklistConfirmation,
    transitionBack,
    getCurrentTestRun,
    testerStorage: { uiState },
    showTestHistory,
    resizeOverlay,
    integrationState,
  },
}: OverlayToolbarProps): JSX.Element {
  const currentTestRun = getCurrentTestRun();
  const stageConfig = testingFlowConfig.stages[
    currentTestRun.currentStage
  ] as StageType;
  const availableSizes = stageConfig.availableSizes;
  const currentSizeIndex = availableSizes.indexOf(uiState.overlaySize);

  const isSmall = uiState.overlaySize === OverlaySize.SMALL;
  const showMinusButton = currentSizeIndex > 0;
  const showPlusButton = currentSizeIndex < availableSizes.length - 1;
  const showCloseButton = currentTestRun.currentStage !== "confirmBlacklist";

  const toolbarStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.25rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(4px)",
  };

  const dragHandleStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: "move",
    color: "white",
    padding: "0.125rem 0.25rem",
    borderRadius: "0.25rem",
    transition: "background-color 0.2s",
    flexGrow: 1,
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
  };

  const buttonStyle: React.CSSProperties = {
    color: "white",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "0.125rem",
    borderRadius: "0.25rem",
    transition: "color 0.2s",
  };

  return (
    <div style={toolbarStyle}>
      <div {...dragHandleProps} style={dragHandleStyle}>
        <Grip size={16} />
        {!isSmall && (
          <span style={{ fontWeight: "600", fontSize: "0.75rem" }}>
            Sovendus Tester
          </span>
        )}
      </div>
      <div style={buttonContainerStyle}>
        <DetectionStatus integrationState={integrationState} />
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
  integrationState,
}: {
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  const status =
    integrationState?.integrationState?.status?.detectionState ||
    DetectionState.NOT_DETECTED;
  const color = status === DetectionState.NOT_DETECTED ? "#F87171" : "#34D399";

  const statusStyle: React.CSSProperties = {
    width: "0.85rem",
    height: "0.85rem",
    borderRadius: "50%",
    backgroundColor: color,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "0.22rem",
    marginRight: "0.2rem",
  };

  return <div style={statusStyle} title={`Integration ${status}`} />;
}
