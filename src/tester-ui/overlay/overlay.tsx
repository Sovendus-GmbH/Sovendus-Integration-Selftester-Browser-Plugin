import { useDraggable } from "@dnd-kit/core";
import type { JSX } from "react";
import React from "react";

import { maxZIndex } from "../../constants";
import { debugUi } from "../../logger/ui-logger";
import { ErrorBoundary } from "../components/error-boundary";
import type {
  OverlayDimensions,
  OverlayState,
} from "../hooks/use-overlay-state";
import { colors } from "../styles";
import { OverlayContent } from "./overlay-content";
import { OverlayToolbar } from "./overlay-toolbar";

export function DraggableOverlay({
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

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: "draggable-overlay",
  });

  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const toolbarHeight = toolbarRef.current?.clientHeight ?? 34;

  const style: React.CSSProperties = {
    position: "fixed",
    width: `${overlayDimensions.width}px`,
    height: `${overlayDimensions.height}px`,
    transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${position.y + (transform?.y ?? 0)}px, 0)`,
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.5rem",
    boxShadow: `0 25px 50px -12px ${colors.overlayShadow}`,
    background: colors.background,
    overflow: "hidden",
    zIndex: maxZIndex,
    color: colors.text,
  };

  return (
    <ErrorBoundary>
      <div ref={setNodeRef} style={style} {...attributes}>
        <div>
          <OverlayToolbar
            listeners={listeners}
            overlayState={overlayState}
            toolbarRef={toolbarRef}
          />
        </div>
        <div
          style={{
            flex: 1,
            height: `calc(100% - ${toolbarHeight}px)`,
          }}
        >
          <div style={{ overflowY: "auto", overflowX: "hidden" }}>
            <OverlayContent overlayState={overlayState} />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
