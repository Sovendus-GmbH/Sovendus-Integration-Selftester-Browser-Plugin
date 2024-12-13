import type { Dispatch, SetStateAction } from "react";
import React, { type JSX, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import type { UiState } from "../../integration-tester-loader/integrationTesterLoader";
import { innerOverlayId } from "../integration-test-overlay-css-vars";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";
import { OverlayContent } from "../overlayContent/OverlayContent";

export function OverlayContentIframe(props: {
  overlayDimensions: OverlayDimensions;
  setUiState: Dispatch<SetStateAction<UiState>>;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
  isDragging: boolean;
  toolBarHeight: number;
}): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const iframe: HTMLIFrameElement | null = iframeRef.current;
  const iframeDoc = iframe?.contentDocument || iframe?.contentWindow?.document;
  const hasLoaded = !!iframeDoc?.body;
  useEffect(() => {
    if (!hasLoaded) {
      return;
    }
    renderReactInIframe(iframeDoc, props);
  }, [props, hasLoaded]);

  return (
    <iframe
      ref={iframeRef}
      height={props.overlayDimensions.height - props.toolBarHeight}
      width={props.overlayDimensions.width}
      style={{
        border: "unset",
        pointerEvents: props.isDragging ? "none" : "auto",
      }}
    ></iframe>
  );
}

function renderReactInIframe(
  iframeDoc: Document,
  props: {
    overlayDimensions: OverlayDimensions;
    setUiState: Dispatch<SetStateAction<UiState>>;
    uiState: UiState;
    integrationState: IntegrationDetectorData;
  },
): void {
  // const win = iframe.contentWindow as Window;

  // win.addEventListener(
  //   "resize",
  //   (): void => void updateIFrameHeight(iframe, setIframeDimensions),
  // );
  iframeDoc.getElementById(innerOverlayId)?.remove();
  const mountNode = iframeDoc.createElement("div");
  mountNode.id = innerOverlayId;
  iframeDoc.body.appendChild(mountNode);
  iframeDoc.body.style.margin = "0";
  iframeDoc.body.style.padding = "0";
  const root = createRoot(mountNode);
  root.render(
    <OverlayContent
      setUiState={props.setUiState}
      uiState={props.uiState}
      integrationState={props.integrationState}
    />,
  );

  // void updateIFrameHeight(iframe, setIframeDimensions);
}

// async function updateIFrameHeight(
//   iframe: HTMLIFrameElement,
//   setIframeDimensions: React.Dispatch<
//     React.SetStateAction<{
//       height: number;
//       width: number;
//     }>
//   >,
// ): Promise<void> {
//   const innerOverlay = iframe.contentDocument?.getElementById(innerOverlayId);
//   if (!innerOverlay) {
//     await transmitIntegrationError(
//       "Integration Tester: Could not find inner overlay element",
//       { windowParameter: window },
//     );
//     return;
//   }
//   setIframeDimensions({
//     height: innerOverlay.scrollHeight,
//     width: innerOverlay.scrollWidth,
//   });
// }
