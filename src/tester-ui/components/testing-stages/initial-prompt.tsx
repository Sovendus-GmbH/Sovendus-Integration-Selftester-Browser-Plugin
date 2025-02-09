import type { JSX } from "react";
import React from "react";

import { debugUi } from "../../../logger/ui-logger";
import type { StepProps } from "../../testing-storage";
import { Button } from "../ui-components/button";

export function InitialPrompt({
  overlayState: { handleInitialSovendusCheck, openBlacklistConfirmation },
}: StepProps): JSX.Element {
  const handleAccept = (): void => {
    debugUi("InitialPrompt", "Accept clicked");
    handleInitialSovendusCheck();
  };

  const handleDecline = (): void => {
    debugUi("InitialPrompt", "Decline clicked");
    openBlacklistConfirmation();
  };

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    padding: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <Button size="small" onClick={handleAccept}>
          Check Sovendus
        </Button>
        <Button variant="secondary" size="small" onClick={handleDecline}>
          Disable on this Page
        </Button>
      </div>
    </div>
  );
}
