import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext, useDraggable } from "@dnd-kit/core";
import type { JSX } from "react";
import React, { useEffect, useState } from "react";

import { maxZIndex } from "../../constants";
import { debug } from "../../logger/logger";
import type { OverlayState } from "../hooks/useOverlayState";
import type { OverlayDimensions } from "../types";
import { OverlaySize } from "../types";
import { ErrorBoundary } from "./ErrorBoundary";
import { OverlayContent } from "./overlay-content";
import { OverlayToolbar } from "./overlay-toolbar";

export function DraggableOverlayContainer({
  overlayState,
}: {
  overlayState: OverlayState;
}): JSX.Element {
  debug("DraggableOverlayContainer", "Rendering", overlayState);
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
        x: Math.min(prev.x, window.innerWidth - newDimensions.width - 20),
        y: Math.min(prev.y, window.innerHeight - newDimensions.height - 20),
      }));
    } catch (error) {
      debug("DraggableOverlayContainer", "Error in useEffect", error);
    }
  }, [uiState]);

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
      debug("DraggableOverlayContainer", "Error in handleDragEnd", error);
    }
  };

  return uiState.isPromptVisible ? (
    <div style={{ position: "fixed", top: 0, left: 0, zIndex: maxZIndex }}>
      <ErrorBoundary>
        <DndContext onDragEnd={handleDragEnd}>
          <DraggableOverlay
            position={uiState.position}
            overlayDimensions={overlayDimensions}
            overlayState={overlayState}
          />
        </DndContext>
      </ErrorBoundary>
    </div>
  ) : (
    <></>
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
  debug("DraggableOverlay", "Rendering", {
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
      <div ref={setNodeRef} style={style} {...attributes}>
        <OverlayToolbar
          dragHandleProps={{ ...listeners }}
          overlayState={overlayState}
        />
        <OverlayContent overlayState={overlayState} />
      </div>
    );
  } catch (error) {
    debug("DraggableOverlay", "Error in rendering", error);
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
        width: 400,
        height: 400,
      };
  }
}

const smallDimension = { width: 200, height: 100 };
