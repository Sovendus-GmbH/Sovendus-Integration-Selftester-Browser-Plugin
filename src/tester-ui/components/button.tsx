import type { CSSProperties, JSX, ReactNode } from "react";
import React from "react";

import { colors } from "../styles";

const baseButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "0.375rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  display: "flex",
  fontSize: "0.875rem",
  fontWeight: "500",
  alignItems: "center",
  justifyContent: "center",
  color: colors.text,
  outline: "none",
  marginTop: "auto",
  marginBottom: "auto",
};

const variantStyles: { [key: string]: React.CSSProperties } = {
  primary: {
    backgroundColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.secondary,
  },
  danger: {
    backgroundColor: colors.error,
  },
  disabled: {
    backgroundColor: colors.disabled,
    cursor: "not-allowed",
  },
  transparent: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
};

const sizeStyles: { [key: string]: React.CSSProperties } = {
  small: {
    fontSize: "0.75rem",
    padding: "0.4rem 0.5rem",
  },
  medium: {
    fontSize: "0.875rem",
    padding: "0.5rem 1rem",
  },
  large: {
    fontSize: "1rem",
    padding: "0.75rem 1.5rem",
  },
};

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger" | "disabled" | "transparent";
  size?: "small" | "medium" | "large";
  style?: CSSProperties;
};

export function Button({
  onClick,
  variant = "primary",
  size = "medium",
  style,
  children,
}: ButtonProps): JSX.Element {
  const _style = {
    ...baseButtonStyle,
    ...variantStyles[variant],
    ...sizeStyles[size],
  };

  return (
    <div
      style={{ ..._style, ...style }}
      onClick={variant === "disabled" ? undefined : onClick}
    >
      {children}
    </div>
  );
}
