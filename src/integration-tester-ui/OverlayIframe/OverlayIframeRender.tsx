import type { Dispatch, SetStateAction } from "react";
import React, { type JSX, useEffect, useRef, useState } from "react";
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
}): JSX.Element {
  const toolBarHeight = 50;
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe: HTMLIFrameElement | null = iframeRef.current;
    if (!iframe) {
      return;
    }
    const onLoad = (): void => {
      const doc =
        iframe.contentDocument || (iframe.contentWindow?.document as Document);
      // const win = iframe.contentWindow as Window;

      // win.addEventListener(
      //   "resize",
      //   (): void => void updateIFrameHeight(iframe, setIframeDimensions),
      // );

      const mountNode = doc.createElement("div");
      mountNode.id = innerOverlayId;
      doc.body.appendChild(mountNode);
      doc.body.style.margin = "0";
      doc.body.style.padding = "0";
      const root = createRoot(mountNode);
      root.render(<OverlayContent {...props} />);

      // void updateIFrameHeight(iframe, setIframeDimensions);
    };
    iframe.addEventListener("load", onLoad);

    return (): void => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [props]);

  return (
    <iframe
      ref={iframeRef}
      height={props.overlayDimensions.height - toolBarHeight}
      width={props.overlayDimensions.width}
      style={{ border: "unset" }}
    ></iframe>
  );
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
