import type { CSSProperties, JSX, ReactNode } from "react";
import React from "react";

import { colors } from "../../styles";

const baseButtonStyle: React.CSSProperties = {
  padding: "0.5rem 1rem",
  borderRadius: "0.375rem",
  border: "none",
  cursor: "pointer",
  transition: "background-color 0.2s",
  display: "flex",
  margin: "auto",
  fontSize: "0.875rem",
  fontWeight: "500",
};

const variantStyles: { [key: string]: React.CSSProperties } = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.text,
  },
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.text,
  },
  danger: {
    backgroundColor: colors.error,
    color: colors.text,
  },
  disabled: {
    backgroundColor: colors.disabled,
    color: colors.text,
    cursor: "not-allowed",
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
  variant?: "primary" | "secondary" | "danger" | "disabled";
  size?: "small" | "medium" | "large";
  style?: CSSProperties;
  disabled?: boolean;
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
    <button
      style={{ ..._style, ...style }}
      onClick={variant === "disabled" ? undefined : onClick}
    >
      {children}
    </button>
  );
}
