import React, { JSX } from "react";
import { Grip, Plus, Minus, X, History } from "lucide-react";
import { OverlaySize } from "../types";
import {
  DetectionState,
  IntegrationDetectorData,
} from "../../integration-detector/integrationDetector";
import { OverlayState } from "../hooks/useOverlayState";
import { StageName, testingFlowConfig } from "../testing-flow-config";

interface OverlayToolbarProps {
  dragHandleProps?: Record<string, any>;
  overlayState: OverlayState;
}

export function OverlayToolbar({
  dragHandleProps,
  overlayState,
}: OverlayToolbarProps): JSX.Element {
  const currentStage = overlayState.currentStage as StageName;
  const stageConfig = testingFlowConfig.stages[currentStage];
  const availableSizes = stageConfig.availableSizes;
  const currentSizeIndex = availableSizes.indexOf(
    overlayState.uiState.overlaySize,
  );

  const isSmall = overlayState.uiState.overlaySize === OverlaySize.SMALL;
  const showMinusButton = currentSizeIndex > 0;
  const showPlusButton = currentSizeIndex < availableSizes.length - 1;

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
        <DetectionStatus
          integrationState={overlayState.integrationState}
          isSmall={isSmall}
        />
        <button onClick={overlayState.showTestHistory} style={buttonStyle}>
          <History size={16} />
        </button>
        {showPlusButton && (
          <button
            onClick={() => overlayState.resizeOverlay("increase")}
            style={buttonStyle}
          >
            <Plus size={16} />
          </button>
        )}
        {showMinusButton && (
          <button
            onClick={() => overlayState.resizeOverlay("decrease")}
            style={buttonStyle}
          >
            <Minus size={16} />
          </button>
        )}
        <button onClick={overlayState.closeOverlay} style={buttonStyle}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

function DetectionStatus({
  integrationState,
  isSmall,
}: {
  integrationState: IntegrationDetectorData;
  isSmall: boolean;
}) {
  const status =
    integrationState?.integrationState?.status?.detectionState ||
    DetectionState.NOT_DETECTED;
  const color = status === DetectionState.NOT_DETECTED ? "#F87171" : "#34D399";

  const statusStyle: React.CSSProperties = {
    width: "0.75rem",
    height: "0.75rem",
    borderRadius: "50%",
    backgroundColor: color,
  };

  return <div style={statusStyle} title={`Integration ${status}`} />;
}
