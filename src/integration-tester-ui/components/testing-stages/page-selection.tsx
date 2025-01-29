import React, { JSX } from "react";
import { Home, ShoppingBag } from "lucide-react";
import { PageType, StepProps } from "../../types";
import { OverlaySize } from "../../types";

export function PageSelection({ overlayState }: StepProps): JSX.Element {
  const isBig = overlayState.uiState.overlaySize === OverlaySize.LARGE;
  const isMedium = overlayState.uiState.overlaySize === OverlaySize.MEDIUM;
  const isSmall = overlayState.uiState.overlaySize === OverlaySize.SMALL;
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
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
  console.log("isBig", isBig, "isMedium", isMedium, "isSmall", isSmall);
  return (
    <div style={containerStyle}>
      {!isSmall ? <h2 style={headingStyle}>Select Current Page</h2> : <></>}
      <div style={optionsContainerStyle}>
        <PageOption
          title='Landing Page'
          description={!isBig ? "" : "Product or category page"}
          icon={
            <Home
              style={{
                width: !isBig ? "1rem" : "1.25rem",
                height: !isBig ? "1rem" : "1.25rem",
              }}
            />
          }
          onClick={() => overlayState.handlePageSelection(PageType.LANDING)}
          small={!isBig}
        />
        <PageOption
          title='Order Success'
          description={!isBig ? "" : "After completing an order"}
          icon={
            <ShoppingBag
              style={{
                width: !isBig ? "1rem" : "1.25rem",
                height: !isBig ? "1rem" : "1.25rem",
              }}
            />
          }
          onClick={() => overlayState.handlePageSelection(PageType.SUCCESS)}
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
}: PageOptionProps) {
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
        {!small && <p style={descriptionStyle}>{description}</p>}
      </div>
    </button>
  );
}
