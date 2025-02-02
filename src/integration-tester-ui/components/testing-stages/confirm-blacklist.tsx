import type { JSX } from "react";
import React from "react";

import { debugUi } from "../../../logger/ui-logger";
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
    debugUi("ConfirmBlacklist", "Blacklist clicked");
    void addToBlacklist();
  };

  const handleHideOverlay = (): void => {
    debugUi("ConfirmBlacklist", "HideOverlay clicked");
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
    fontSize: "1rem",
    color: "#E0E0E0",
    lineHeight: "1.4",
    backgroundColor: "rgba(30, 118, 181, 0.81)",
    padding: "0.3rem",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    marginBottom: "0.5rem",
    borderRadius: "0.5rem",
    fontFamily: "Arial, sans-serif",
    textAlign: "left",
  };

  return (
    <div style={containerStyle}>
      <div style={infoTextStyle}>
        <div>To re-enable:</div>
        <div>
          Click the parcel icon in your browser's top-right corner, then select
          the Sovendus icon.
        </div>
      </div>
      <div style={buttonContainerStyle}>
        {window.location.host ? (
          <button style={blacklistButtonStyle} onClick={handleBlacklist}>
            Blacklist this Page
          </button>
        ) : (
          <button
            style={{
              ...blacklistButtonStyle,
              backgroundColor: "grey",
              cursor: "not-allowed",
            }}
            onClick={handleBlacklist}
            disabled
          >
            Cant blacklist file urls
          </button>
        )}
        <button style={hideButtonStyle} onClick={handleHideOverlay}>
          Hide Overlay
        </button>
      </div>
    </div>
  );
}
