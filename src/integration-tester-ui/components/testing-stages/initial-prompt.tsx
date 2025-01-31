import type { JSX } from "react";
import React from "react";

import { debug } from "../../../logger/logger";
import type { StepProps } from "../../types";
import { OverlaySize } from "../../types";

export function InitialPrompt({ overlayState }: StepProps): JSX.Element {
  const isSmall = overlayState.uiState.overlaySize === OverlaySize.SMALL;

  const handleAccept = (): void => {
    debug("InitialPrompt", "Accept clicked");
    overlayState.handleInitialSovendusCheck();
  };

  const handleDecline = (): void => {
    debug("InitialPrompt", "Decline clicked");
    overlayState.closeOverlay();
  };

  const buttonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    backgroundColor: "#4F46E5",
    color: "white",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s",
    fontSize: isSmall ? "0.75rem" : "0.875rem",
  };

  const declineButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: "#7C3AED",
  };
  const containerStyle: React.CSSProperties = {
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

  return (
    <div style={containerStyle}>
      <div style={buttonContainerStyle}>
        <button style={buttonStyle} onClick={handleAccept}>
          Check Sovendus
        </button>
        <button style={declineButtonStyle} onClick={handleDecline}>
          Disable on this Page
        </button>
      </div>
    </div>
  );
}
