import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { maxZIndex } from "../../constants";
import { debugUi } from "../../logger/ui-logger";
import type {
  OverlayDimensions,
  OverlayState,
} from "../hooks/use-overlay-state";
import { OverlaySize } from "../testing-storage";
import { DraggableOverlay } from "./overlay";

export function DraggableOverlayContainer({
  overlayState,
}: {
  overlayState: OverlayState;
}): JSX.Element {
  debugUi("DraggableOverlayContainer", "Rendering", overlayState);
  const {
    testerStorage: { uiState },
    setPosition,
    getCurrentTestRun,
  } = overlayState;
  const currentTestRun = getCurrentTestRun();
  const [overlayDimensions, setOverlayDimensions] =
    useState<OverlayDimensions>(smallDimension);

  useEffect(() => {
    try {
      const newDimensions = getOverlayDimensions(currentTestRun.overlaySize);
      setOverlayDimensions(newDimensions);
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - newDimensions.width - 0),
        y: Math.min(prev.y, window.innerHeight - newDimensions.height - 0),
      }));
    } catch (error) {
      debugUi("DraggableOverlayContainer", "Error in useEffect", error);
    }
  }, [currentTestRun.overlaySize]);

  useEffect(() => {
    const handleResize = (): void => {
      setPosition((prev) => ({
        x: Math.max(
          Math.min(prev.x, window.innerWidth - overlayDimensions.width - 0),
          0,
        ),
        y: Math.max(
          Math.min(prev.y, window.innerHeight - overlayDimensions.height - 0),
          0,
        ),
      }));
    };

    window.addEventListener("resize", handleResize);

    // Cleanup event listener on component unmount
    return (): void => {
      window.removeEventListener("resize", handleResize);
    };
  }, [overlayDimensions]);

  const handleDragEnd = (event: DragEndEvent): void => {
    try {
      const { delta } = event;
      setPosition((prev) => ({
        x: Math.max(
          0,
          Math.min(
            prev.x + delta.x,
            window.innerWidth - overlayDimensions.width,
          ),
        ),
        y: Math.max(
          0,
          Math.min(
            prev.y + delta.y,
            window.innerHeight - overlayDimensions.height,
          ),
        ),
      }));
    } catch (error) {
      debugUi("DraggableOverlayContainer", "Error in handleDragEnd", error);
    }
  };
  return (
    <div style={{ position: "fixed", top: 0, left: 0, zIndex: maxZIndex }}>
      <DndContext onDragEnd={handleDragEnd}>
        <DraggableOverlay
          position={uiState.position}
          overlayDimensions={overlayDimensions}
          overlayState={overlayState}
        />
      </DndContext>
    </div>
  );
}

function getOverlayDimensions(overlaySize: OverlaySize): OverlayDimensions {
  switch (overlaySize) {
    case OverlaySize.SMALL:
      return smallDimension;
    case OverlaySize.MEDIUM:
      return {
        width: 300,
        height: 250,
      };
    case OverlaySize.LARGE:
      return {
        width: 700,
        height: 550,
      };
  }
}

const smallDimension = { width: 200, height: 85 };
