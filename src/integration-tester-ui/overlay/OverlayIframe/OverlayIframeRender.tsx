import React, { type JSX, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

import type { IntegrationDetectorData } from "../../../integration-detector/integrationDetector";
import type { UiState } from "../../../integration-tester-loader/integrationTesterLoader";
import type { OverlayDimensions } from "../OverlayContainer/OverlayContainer";
import { OverlayContent } from "../overlayContent/OverlayContent";

export function OverlayContentIframe(props: {
  overlayDimensions: OverlayDimensions;
  uiState: UiState;
  integrationState: IntegrationDetectorData;
}): JSX.Element {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }
    const onLoad = (): void => {
      const doc =
        iframe.contentDocument || (iframe.contentWindow?.document as Document);
      const mountNode = doc.createElement("div");
      doc.body.appendChild(mountNode);
      doc.body.style.margin = "0";
      doc.body.style.padding = "0";
      const root = createRoot(mountNode);
      root.render(<OverlayContent {...props} />);
    };
    iframe.addEventListener("load", onLoad);

    return (): void => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [props]);

  return (
    <iframe
      ref={iframeRef}
      height={props.overlayDimensions.height - 50}
      width={props.overlayDimensions.width}
      style={{ border: "unset" }}
    ></iframe>
  );
}
