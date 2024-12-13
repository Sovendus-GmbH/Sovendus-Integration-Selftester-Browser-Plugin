import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { Dispatch, JSX, SetStateAction } from "react";
import React, { useEffect, useState } from "react";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import { OverlaySize } from "../../integration-tester-loader/integrationTesterLoader";
import { DraggableOverlay } from "./Overlay";

export function DraggableOverlayContainer({
  uiState,
  setUiState,
  integrationState,
}: {
  uiState: UiState;
  setUiState: Dispatch<SetStateAction<UiState>>;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  const { overlayDimensions, position, handleDragEnd } = useDragger(uiState);
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        style={{
          position: "fixed",
          zIndex: 0,
          top: "0px",
          left: "0px",
          height: "0",
          width: "0",
        }}
      >
        <DraggableOverlay
          setUiState={setUiState}
          uiState={uiState}
          position={position}
          integrationState={integrationState}
          overlayDimensions={overlayDimensions}
        />
      </div>
    </DndContext>
  );
}

function useDragger(uiState: UiState): {
  overlayDimensions: OverlayDimensions;
  position: {
    x: number;
    y: number;
  };
  handleDragEnd: (event: DragEndEvent) => void;
} {
  const [overlayDimensions, setOverlayDimensions] = useState<OverlayDimensions>(
    { width: 150, height: 100 },
  );
  const [position, setPosition] = useState({
    x: window.innerWidth - 100 - overlayDimensions.width,
    y: window.innerHeight - 100 - overlayDimensions.height,
  });

  useEffect(() => {
    setPosition((prevPosition) =>
      handleBoundaries(prevPosition.x, prevPosition.y),
    );
  }, [overlayDimensions]);

  useEffect(() => {
    if (uiState.overlaySize === OverlaySize.SMALL) {
      setOverlayDimensions({ width: 200, height: 150 });
    } else if (uiState.overlaySize === OverlaySize.MEDIUM) {
      setOverlayDimensions({ width: 400, height: 250 });
    } else {
      setOverlayDimensions({
        width: Math.min(750, window.innerWidth),
        height: Math.min(750, window.innerHeight),
      });
    }
    setPosition((prevPosition) =>
      handleBoundaries(prevPosition.x, prevPosition.y),
    );
  }, [uiState.overlaySize]);

  useEffect(() => {
    const handleResize = (): void => {
      setPosition((prevPosition) =>
        handleBoundaries(prevPosition.x, prevPosition.y),
      );
    };

    window.addEventListener("resize", handleResize);
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBoundaries = (
    newX: number,
    newY: number,
  ): {
    x: number;
    y: number;
  } => {
    const maxX = window.innerWidth - overlayDimensions.width;
    const maxY = window.innerHeight - overlayDimensions.height;
    return {
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    };
  };

  const handleDragEnd = (event: DragEndEvent): void => {
    const newX = position.x + event.delta.x;
    const newY = position.y + event.delta.y;
    const newPosition = handleBoundaries(newX, newY);
    setPosition(newPosition);
  };

  return {
    overlayDimensions,
    position,
    handleDragEnd,
  };
}

export interface OverlayDimensions {
  width: number;
  height: number;
}
