import { useDraggable } from "@dnd-kit/core";
import type { JSX } from "react";
import React from "react";

import { maxZIndex } from "../../constants";
import { debugUi } from "../../logger/ui-logger";
import type {
  OverlayDimensions,
  OverlayState,
} from "../hooks/use-overlay-state";
import { colors, styles } from "../styles";
import { ErrorBoundary } from "./error-boundary";
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
  const toolbarHeight = toolbarRef.current?.clientHeight ?? 0;

  const style: React.CSSProperties = {
    position: "fixed",
    width: `${overlayDimensions.width}px`,
    height: `${overlayDimensions.height}px`,
    transform: `translate3d(${position.x + (transform?.x ?? 0)}px, ${position.y + (transform?.y ?? 0)}px, 0)`,
    display: "flex",
    flexDirection: "column",
    borderRadius: "0.5rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    background: colors.background,
    overflow: "hidden",
    zIndex: maxZIndex,
    ...styles.text,
  };

  return (
    <ErrorBoundary>
      <div ref={setNodeRef} style={style} {...attributes}>
        <OverlayToolbar
          listeners={listeners}
          overlayState={overlayState}
          toolbarRef={toolbarRef}
        />
        <OverlayContent
          overlayState={overlayState}
          toolbarHeight={toolbarHeight}
        />
      </div>
    </ErrorBoundary>
  );
}
