import { useDraggable } from "@dnd-kit/core";
import type { Transform } from "@dnd-kit/utilities";
import type { CSSProperties, Dispatch, JSX, SetStateAction } from "react";
import React, { useRef } from "react";

import { maxZIndex } from "../../constants";
import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import { OverlayContentIframe } from "../overlay-iframe/OverlayIframeRender";
import { OverlayToolbar } from "../overlay-toolbar/OverlayToolbar";
import type { OverlayDimensions } from "./OverlayContainer";

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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "draggable",
    });

  const startTouchPosition = useRef<{ x: number; y: number } | null>(null);
  const currentPos = useRef(position);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>): void => {
    const touch = e.touches[0];
    if (touch) {
      startTouchPosition.current = {
        x: touch.clientX - currentPos.current.x,
        y: touch.clientY - currentPos.current.y,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>): void => {
    if (!startTouchPosition.current) {
      return;
    }

    const touch = e.touches[0];
    if (touch) {
      const newX = touch.clientX - startTouchPosition.current.x;
      const newY = touch.clientY - startTouchPosition.current.y;

      const boundedX = Math.max(
        10,
        Math.min(window.innerWidth - overlayDimensions.width - 10, newX),
      );
      const boundedY = Math.max(
        10,
        Math.min(window.innerHeight - overlayDimensions.height - 10, newY),
      );

      currentPos.current = { x: boundedX, y: boundedY };
    }
  };

  const handleTouchEnd = (): void => {
    startTouchPosition.current = null;
  };

  const overlayStyle = getOverlayStyle(position, transform, overlayDimensions);
  const toolBarHeight = 50;

  return (
    <div
      style={overlayStyle.outerOverlayStyle}
      {...attributes}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <OverlayToolbar
        overlayDimensions={overlayDimensions}
        setNodeRef={setNodeRef}
        listeners={listeners}
        setUiState={setUiState}
        uiState={uiState}
        integrationState={integrationState}
        toolBarHeight={toolBarHeight}
      />
      <OverlayContentIframe
        overlayDimensions={overlayDimensions}
        uiState={uiState}
        integrationState={integrationState}
        setUiState={setUiState}
        isDragging={isDragging}
        toolBarHeight={toolBarHeight}
      />
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
  const xPos = position.x + (transform ? transform.x : 0);
  const yPos = position.y + (transform ? transform.y : 0);

  const outerOverlayStyle: CSSProperties = {
    transform: `translate3d(${Math.max(
      10,
      Math.min(window.innerWidth - overlayDimensions.width - 10, xPos),
    )}px, ${Math.max(
      10,
      Math.min(window.innerHeight - overlayDimensions.height - 10, yPos),
    )}px, 0)`,
    width: `${overlayDimensions.width}px`,
    height: `${overlayDimensions.height}px`,
    backgroundColor: "#439CEF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: maxZIndex,
    flexDirection: "column",
    borderRadius: "10px",
    overflow: "hidden",
    position: "absolute",
    touchAction: "none",
  };
  return { outerOverlayStyle };
}
