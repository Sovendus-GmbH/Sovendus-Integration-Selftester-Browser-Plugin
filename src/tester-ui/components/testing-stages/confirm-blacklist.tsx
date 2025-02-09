import type { JSX } from "react";
import React from "react";

import { debugUi } from "../../../logger/ui-logger";
import { colors } from "../../styles";
import type { StepProps } from "../../testing-storage";
import { Button } from "../ui-components/button";

export function ConfirmBlacklist({
  overlayState: { addToBlacklist, hideOverlay },
}: StepProps): JSX.Element {
  const handleBlacklist = (): void => {
    debugUi("ConfirmBlacklist", "Blacklist clicked");
    void addToBlacklist();
  };

  const handleHideOverlay = (): void => {
    debugUi("ConfirmBlacklist", "HideOverlay clicked");
    hideOverlay();
  };

  const containerStyle: React.CSSProperties = {
    marginTop: "0.3rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
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
    color: colors.text,
    lineHeight: "1.4",
    backgroundColor: "rgba(30, 118, 181, 0.81)",
    padding: "0.8rem",
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    marginBottom: "1.5rem",
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
          <Button variant="danger" onClick={handleBlacklist}>
            Blacklist this Page
          </Button>
        ) : (
          <Button variant="disabled">Cant blacklist this type of urls</Button>
        )}
        <Button variant="secondary" onClick={handleHideOverlay}>
          Hide Overlay
        </Button>
      </div>
    </div>
  );
}
