import type { JSX } from "react";
import React from "react";

import { debug } from "../../../logger/logger";
import type { StepProps } from "../../testing-storage";
import { OverlaySize } from "../../testing-storage";

export function ConfirmBlacklist({
  overlayState: {
    addToBlacklist,
    hideOverlay,
    testerStorage: { uiState },
  },
}: StepProps): JSX.Element {
  const isSmall = uiState.overlaySize === OverlaySize.SMALL;

  const handleBlacklist = (): void => {
    debug("ConfirmBlacklist", "Blacklist clicked");
    void addToBlacklist();
  };

  const handleHideOverlay = (): void => {
    debug("ConfirmBlacklist", "HideOverlay clicked");
    hideOverlay();
  };

  const blacklistButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "#D30000",
    color: "white",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: isSmall ? "0.75rem" : "0.875rem",
  };

  const hideButtonStyle: React.CSSProperties = {
    ...blacklistButtonStyle,
    backgroundColor: "#7C3AED",
  };
  const containerStyle: React.CSSProperties = {
    marginTop: "0.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
    color: "white",
    padding: "0.25rem",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
  };

  const infoTextStyle: React.CSSProperties = {
    marginTop: "0.5rem",
    fontSize: "0.88rem",
    color: "#E0E0E0",
    textAlign: "center",
    lineHeight: "1.4",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: "0.3rem",
    borderRadius: "0.5rem",
    fontFamily: "Arial, sans-serif",
  };

  return (
    <div style={containerStyle}>
      <div style={buttonContainerStyle}>
        <button style={blacklistButtonStyle} onClick={handleBlacklist}>
          Blacklist this Page
        </button>
        <button style={hideButtonStyle} onClick={handleHideOverlay}>
          Hide Overlay
        </button>
      </div>
      <p style={infoTextStyle}>
        If you hide the tester or blacklist this page, you can re-enable it by
        clicking on the extension icon in the top-right corner of your browser.
        In the menu, select the option to whitelist this page or show the tester
        again.
      </p>
    </div>
  );
}
