import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, useDraggable } from "@dnd-kit/core";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { maxZIndex } from "../../constants";
import { debugUi } from "../../logger/ui-logger";
import type { OverlayDimensions, OverlayState } from "../hooks/useOverlayState";
import { OverlaySize } from "../testing-storage";
import { ErrorBoundary } from "./ErrorBoundary";
import { OverlayContent } from "./overlay-content";
import { OverlayToolbar } from "./overlay-toolbar";

export function DraggableOverlayContainer({
  overlayState,
}: {
  overlayState: OverlayState;
}): JSX.Element {
  debugUi("DraggableOverlayContainer", "Rendering", overlayState);
  const {
    testerStorage: { uiState },
    setPosition,
  } = overlayState;

  const [overlayDimensions, setOverlayDimensions] =
    useState<OverlayDimensions>(smallDimension);

  useEffect(() => {
    try {
      const newDimensions = getOverlayDimensions(uiState.overlaySize);
      setOverlayDimensions(newDimensions);
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - newDimensions.width - 0),
        y: Math.min(prev.y, window.innerHeight - newDimensions.height - 0),
      }));
    } catch (error) {
      debugUi("DraggableOverlayContainer", "Error in useEffect", error);
    }
  }, [uiState.overlaySize]);

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

function DraggableOverlay({
  position,
  overlayDimensions,
  overlayState,
}: {
  position: { x: number; y: number };
  overlayDimensions: OverlayDimensions;
  overlayState: OverlayState;
}): JSX.Element {
  debugUi("DraggableOverlay", "Rendering", {
    position,
    overlayDimensions,
    overlayState,
  });

  try {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: "draggable-overlay",
    });

    const style: React.CSSProperties = {
      position: "fixed",
      width: `${overlayDimensions.width}px`,
      height: `${overlayDimensions.height}px`,
      transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${position.y + (transform?.y ?? 0)}px, 0)`,
      display: "flex",
      flexDirection: "column",
      borderRadius: "0.5rem",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
      overflow: "hidden",
      zIndex: maxZIndex,
    };

    return (
      <ErrorBoundary>
        <div ref={setNodeRef} style={style} {...attributes}>
          <OverlayToolbar listeners={listeners} overlayState={overlayState} />
          <OverlayContent overlayState={overlayState} />
        </div>
      </ErrorBoundary>
    );
  } catch (error) {
    debugUi("DraggableOverlay", "Error in rendering", error);
    return <ErrorComponent error={error} />;
  }
}

function ErrorComponent({ error }: { error: unknown }): JSX.Element {
  const style: React.CSSProperties = {
    padding: "1rem",
    backgroundColor: "#FEE2E2",
    border: "1px solid #F87171",
    color: "#B91C1C",
    borderRadius: "0.375rem",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: "1.125rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  };

  const preStyle: React.CSSProperties = {
    marginTop: "0.5rem",
    fontSize: "0.75rem",
    overflowX: "auto",
  };

  return (
    <div style={style}>
      <h2 style={headingStyle}>Error rendering overlay</h2>
      <p>{error instanceof Error ? error.message : String(error)}</p>
      {error instanceof Error && error.stack && (
        <pre style={preStyle}>{error.stack}</pre>
      )}
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

const smallDimension = { width: 200, height: 100 };
