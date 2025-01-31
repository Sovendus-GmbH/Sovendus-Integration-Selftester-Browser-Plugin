import { Shield, ShieldOff } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import type { StepProps } from "../../types";
import { OverlaySize } from "../../types";

export function ConsentSelectionStep({ overlayState }: StepProps): JSX.Element {
  const isSmall = overlayState.uiState.overlaySize === OverlaySize.SMALL;

  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: "white",
    padding: "0.5rem",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: isSmall ? "0.875rem" : "1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    textAlign: "center",
  };

  const paragraphStyle: React.CSSProperties = {
    fontSize: isSmall ? "0.75rem" : "0.875rem",
    marginBottom: "0.5rem",
    textAlign: "center",
  };

  const optionsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    width: "100%",
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Select Consent Type</h2>
      <p style={paragraphStyle}>Choose which test to start:</p>
      <div style={optionsContainerStyle}>
        <ConsentOption
          title='WITH Consent'
          icon={
            <Shield
              style={{ width: "1rem", height: "1rem", color: "#34D399" }}
            />
          }
          onClick={() => overlayState.handleConsentSelection(true)}
          isSmall={isSmall}
        />
        <ConsentOption
          title='WITHOUT Consent'
          icon={
            <ShieldOff
              style={{ width: "1rem", height: "1rem", color: "#FBBF24" }}
            />
          }
          onClick={() => overlayState.handleConsentSelection(false)}
          isSmall={isSmall}
        />
      </div>
      <p style={{ ...paragraphStyle, marginTop: "0.5rem" }}>
        You'll need to run both tests for complete results
      </p>
    </div>
  );
}

interface ConsentOptionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isSmall: boolean;
}

function ConsentOption({ title, icon, onClick, isSmall }: ConsentOptionProps) {
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s",
    width: "100%",
    color: "white",
    fontSize: isSmall ? "0.75rem" : "0.875rem",
  };

  return (
    <button onClick={onClick} style={buttonStyle}>
      <div style={{ marginRight: "0.5rem" }}>{icon}</div>
      <h3 style={{ fontWeight: "600" }}>{title}</h3>
    </button>
  );
}
