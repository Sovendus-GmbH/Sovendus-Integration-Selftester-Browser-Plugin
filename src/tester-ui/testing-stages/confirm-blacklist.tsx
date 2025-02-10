import type { JSX } from "react";
import React from "react";

import { colors } from "../../styles";
import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { Button } from "../button";

export function ConfirmBlacklist({
  overlayState: { transition },
}: StepProps): JSX.Element {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "white",
    padding: ".25rem",
    height: "100%",
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    width: "100%",
  };

  const infoTextStyle: React.CSSProperties = {
    fontSize: "0.9rem",
    color: colors.textLight,
    lineHeight: "1.4",
    backgroundColor: colors.info,
    padding: "0.8rem",
    marginTop: "0.5rem",
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
    marginBottom: ".5rem",
    borderRadius: "0.5rem",
    textAlign: "left",
  };
  return (
    <div style={containerStyle}>
      <div style={infoTextStyle}>
        <p>To re-enable:</p>
        <p>
          Click the parcel icon in your browser's top-right corner, then select
          the Sovendus icon.
        </p>
      </div>
      <div style={buttonContainerStyle}>
        {window.location.host ? (
          <Button
            variant="danger"
            onClick={() =>
              transition(
                testingFlowConfig.stages.blacklistConfirmation.transitions.HIDE,
              )
            }
          >
            {/* <Ban size={16} style={{ marginRight: "0.25rem" }} /> */}
            Blacklist this Page
          </Button>
        ) : (
          <Button variant="disabled">Can't blacklist this type of URL</Button>
        )}
        <Button
          variant="secondary"
          onClick={() =>
            transition(
              testingFlowConfig.stages.blacklistConfirmation.transitions.HIDE,
            )
          }
        >
          {/* <X size={16} style={{ marginRight: "0.25rem" }} /> */}
          Hide Overlay
        </Button>
      </div>
    </div>
  );
}
