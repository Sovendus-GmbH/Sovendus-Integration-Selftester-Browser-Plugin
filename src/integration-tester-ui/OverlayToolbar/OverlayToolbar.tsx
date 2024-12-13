import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { AlignJustify, CircleDot, Minus, Plus } from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import {
  DetectionState,
  type IntegrationDetectorData,
} from "../../integration-detector/integrationDetector";
import { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";

export function OverlayToolbar({
  overlayDimensions,
  setNodeRef,
  listeners,
  setUiState,
  uiState,
  integrationState,
}: {
  overlayDimensions: OverlayDimensions;
  setNodeRef: (element: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return (
    <div
      style={{
        height: "50px",
        width: `${overlayDimensions.width}px`,
        display: "flex",
      }}
    >
      <DragHandle
        setNodeRef={setNodeRef}
        listeners={listeners}
        overlayDimensions={overlayDimensions}
      />
      <DetectionStatus integrationState={integrationState} />
      <MinimizeOverlay uiState={uiState} setUiState={setUiState} />
      <MaximizeOverlay uiState={uiState} setUiState={setUiState} />
    </div>
  );
}

function MaximizeOverlay({
  uiState,
  setUiState,
}: {
  uiState: UiState;
  setUiState: Dispatch<SetStateAction<UiState>>;
}): JSX.Element {
  return UiState.LARGE !== uiState ? (
    <div
      style={{
        height: "50px",
        width: "50px",
        display: "block",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      onClick={() =>
        setUiState(uiState === UiState.MEDIUM ? UiState.LARGE : UiState.MEDIUM)
      }
    >
      <div
        style={{
          height: "24px",
          width: "24px",
          margin: "auto",
          marginTop: "13px",
        }}
      >
        <Plus />
      </div>
    </div>
  ) : (
    <></>
  );
}

function MinimizeOverlay({
  uiState,
  setUiState,
}: {
  uiState: UiState;
  setUiState: Dispatch<SetStateAction<UiState>>;
}): JSX.Element {
  return UiState.SMALL !== uiState ? (
    <div
      style={{
        height: "50px",
        width: "50px",
        display: "block",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      onClick={() =>
        setUiState(uiState === UiState.MEDIUM ? UiState.SMALL : UiState.MEDIUM)
      }
    >
      <div
        style={{
          height: "24px",
          width: "24px",
          margin: "auto",
          marginTop: "13px",
        }}
      >
        <Minus />
      </div>
    </div>
  ) : (
    <></>
  );
}

function DragHandle({
  setNodeRef,
  listeners,
  overlayDimensions,
}: {
  setNodeRef: (element: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  overlayDimensions: OverlayDimensions;
}): JSX.Element {
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      style={{
        height: "50px",
        width: `${overlayDimensions.width - 50}px`,
        backgroundColor: "rgb(0, 0, 0, 0.1)",
        cursor: "grab",
      }}
    >
      <div
        style={{
          height: "24px",
          width: "24px",
          margin: "auto",
          marginTop: "13px",
        }}
      >
        <AlignJustify />
      </div>
    </div>
  );
}
function DetectionStatus({
  integrationState,
}: {
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  return (
    <div
      style={{
        height: "50px",
        width: "50px",
        display: "block",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
    >
      <div
        style={{
          height: "24px",
          width: "24px",
          margin: "auto",
          marginTop: "13px",
        }}
      >
        <CircleDot
          color={
            integrationState.integrationState.detectionState ===
            DetectionState.NOT_DETECTED
              ? "red"
              : "green"
          }
        />
      </div>
    </div>
  );
}
