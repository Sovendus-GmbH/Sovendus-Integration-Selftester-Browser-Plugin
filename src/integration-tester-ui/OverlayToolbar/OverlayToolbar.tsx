import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { CircleDot, Grip, Minus, Plus } from "lucide-react";
import type { Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { DetectionState } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import { OverlaySize } from "../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";

export function OverlayToolbar({
  overlayDimensions,
  setNodeRef,
  listeners,
  setUiState,
  uiState,
  integrationState,
  toolBarHeight,
}: {
  overlayDimensions: OverlayDimensions;
  setNodeRef: (element: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
  toolBarHeight: number;
}): JSX.Element {
  return (
    <div
      style={{
        height: `${toolBarHeight}px`,
        width: `${overlayDimensions.width}px`,
        display: "flex",
      }}
    >
      <DragHandle
        setNodeRef={setNodeRef}
        listeners={listeners}
        overlayDimensions={overlayDimensions}
        uiState={uiState}
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
  return OverlaySize.LARGE !== uiState.overlaySize ? (
    <div
      style={{
        height: "50px",
        width: "50px",
        display: "block",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      onClick={() =>
        setUiState((prevState) => ({
          ...prevState,
          overlaySize:
            uiState.overlaySize === OverlaySize.MEDIUM
              ? OverlaySize.LARGE
              : OverlaySize.MEDIUM,
        }))
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
  return OverlaySize.SMALL !== uiState.overlaySize ? (
    <div
      style={{
        height: "50px",
        width: "50px",
        display: "block",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        cursor: "pointer",
      }}
      onClick={() =>
        setUiState((prevState) => ({
          ...prevState,
          overlaySize:
            uiState.overlaySize === OverlaySize.MEDIUM
              ? OverlaySize.SMALL
              : OverlaySize.MEDIUM,
        }))
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
  uiState,
}: {
  setNodeRef: (element: HTMLElement | null) => void;
  listeners: SyntheticListenerMap | undefined;
  overlayDimensions: OverlayDimensions;
  uiState: UiState;
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
        display: "flex",
      }}
    >
      <div
        style={{
          height: "24px",
          width: "24px",
          marginBottom: "auto",
          ...(uiState.overlaySize !== OverlaySize.SMALL
            ? { marginLeft: "auto", marginRight: "auto" }
            : { marginLeft: "25px", marginRight: "25px" }),
          marginTop: "auto",
        }}
      >
        <Grip />
      </div>
      {uiState.overlaySize !== OverlaySize.SMALL ? (
        <div style={{ margin: "auto", marginLeft: "0" }}>
          Sovendus Integration Tester
        </div>
      ) : (
        <></>
      )}
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
            integrationState.integrationState.status.detectionState ===
            DetectionState.NOT_DETECTED
              ? "red"
              : "green"
          }
        />
      </div>
    </div>
  );
}
