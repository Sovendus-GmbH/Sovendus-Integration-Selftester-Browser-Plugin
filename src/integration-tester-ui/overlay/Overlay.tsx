import { useDraggable } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import type { CSSProperties, Dispatch, JSX, SetStateAction } from "react";
import React from "react";

import { maxZIndex } from "../../constants";
import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "./OverlayContainer";
import { OverlayContent } from "./OverlayContent";
import { OverlayToolbar } from "./OverlayToolbar/OverlayToolbar";

export function DraggableOverlay({
  position,
  overlayDimensions,
  uiState,
  setUiState,
  integrationState,
}: {
  position: {
    x: number;
    y: number;
  };
  overlayDimensions: OverlayDimensions;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable",
  });

  const overlayStyle = getOverlayStyle(position, transform, overlayDimensions);
  return (
    <div style={overlayStyle.outerOverlayStyle} {...attributes}>
      <OverlayToolbar
        overlayDimensions={overlayDimensions}
        setNodeRef={setNodeRef}
        listeners={listeners}
        setUiState={setUiState}
        uiState={uiState}
        integrationState={integrationState}
      />
      <OverlayContent />
    </div>
  );
}

interface OverlayStyle {
  outerOverlayStyle: CSSProperties;
}

function getOverlayStyle(
  position: { x: number; y: number },
  transform: Transform | null,
  overlayDimensions: OverlayDimensions,
): OverlayStyle {
  let outerOverlayStyle: CSSProperties = {};
  outerOverlayStyle = {
    transform: `translate3d(${position.x + (transform ? transform.x : 0)}px, ${position.y + (transform ? transform.y : 0)}px, 0)`,
    width: `${overlayDimensions.width}px`,
    height: `${overlayDimensions.height}px`,
    backgroundColor: "lightblue",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: maxZIndex,
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
  };
  return { outerOverlayStyle };
}
