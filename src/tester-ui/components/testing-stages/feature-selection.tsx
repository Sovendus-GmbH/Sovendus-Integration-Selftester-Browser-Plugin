import { Home, ShoppingBag } from "lucide-react";
import type { JSX } from "react";
import React from "react";

import { testingFlowConfig } from "../../testing-flow-config";
import type { StepProps } from "../../testing-storage";
import { OverlaySize } from "../../testing-storage";

export function FeatureSelection({
  overlayState: { transition, getCurrentTestRun },
}: StepProps): JSX.Element {
  const currentTestRun = getCurrentTestRun();
  const isBig = currentTestRun.overlaySize === OverlaySize.LARGE;
  const isMedium = currentTestRun.overlaySize === OverlaySize.MEDIUM;
  const isSmall = currentTestRun.overlaySize === OverlaySize.SMALL;
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
  };

  const headingStyle: React.CSSProperties = {
    fontSize: isSmall ? "0.875rem" : "1rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  };

  const optionsContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: isSmall || isMedium ? "column" : "row",
    gap: isSmall ? "0.25rem" : "0.5rem",
  };
  return (
    <div style={containerStyle}>
      {!isSmall ? (
        <h2 style={headingStyle}>How can I help you today? :)</h2>
      ) : (
        <></>
      )}
      <div style={optionsContainerStyle}>
        <PageOption
          title="Test a Sovendus Integration"
          description={!isBig ? "" : "Make sure everything works as expected"}
          icon={
            <Home
              style={{
                width: !isBig ? "1rem" : "1.25rem",
                height: !isBig ? "1rem" : "1.25rem",
              }}
            />
          }
          onClick={() =>
            transition(
              testingFlowConfig.transitions.featureSelection.TEST_INTEGRATION!,
            )
          }
          small={!isBig}
        />
        <PageOption
          title="Integrate Sovendus on this Page"
          description={!isBig ? "" : "We guide you through the whole process"}
          icon={
            <ShoppingBag
              style={{
                width: !isBig ? "1rem" : "1.25rem",
                height: !isBig ? "1rem" : "1.25rem",
              }}
            />
          }
          onClick={() =>
            transition(
              testingFlowConfig.transitions.featureSelection.INTEGRATION_HELP!,
            )
          }
          small={!isBig}
        />
      </div>
    </div>
  );
}

interface PageOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  small: boolean;
}

function PageOption({
  title,
  description,
  icon,
  onClick,
  small,
}: PageOptionProps): JSX.Element {
  const buttonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    padding: small ? "0.25rem" : "0.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: "0.5rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s",
    color: "white",
    fontSize: small ? "0.75rem" : "0.875rem",
  };

  const iconContainerStyle: React.CSSProperties = {
    marginRight: "0.5rem",
  };

  const contentStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  };

  const titleStyle: React.CSSProperties = {
    fontWeight: "600",
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: "0.75rem",
    color: "rgba(255, 255, 255, 0.7)",
  };

  return (
    <button onClick={onClick} style={buttonStyle}>
      <div style={iconContainerStyle}>{icon}</div>
      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {!small && <div style={descriptionStyle}>{description}</div>}
      </div>
    </button>
  );
}
