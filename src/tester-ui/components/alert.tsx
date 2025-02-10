import type { LucideProps } from "lucide-react";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import type { CSSProperties, JSX, ReactNode } from "react";
import React from "react";

import { colors } from "../styles";

export type AlertLevel = "info" | "warning" | "error" | "success";

export type AlertProps = {
  children: ReactNode;
  level?: AlertLevel;
  style?: CSSProperties;
};

const baseStyle: CSSProperties = {
  fontSize: "0.8rem",
  marginBottom: "0.5rem",
  textAlign: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "0.25rem 0.5rem",
  borderRadius: "0.25rem",
};

const levelStyles: { [key in AlertLevel]: CSSProperties } = {
  info: {
    backgroundColor: "rgba(0, 123, 255, 0.1)",
    color: colors.text,
  },
  warning: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    color: colors.text,
  },
  error: {
    backgroundColor: "rgba(220, 53, 69, 0.1)",
    color: colors.text,
  },
  success: {
    backgroundColor: "rgba(40, 167, 69, 0.1)",
    color: colors.text,
  },
};

export function Alert({
  children,
  level = "info",
  style,
}: AlertProps): JSX.Element {
  const combinedStyle = { ...baseStyle, ...levelStyles[level], ...style };

  const IconComponent: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > = ((): React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  > => {
    switch (level) {
      case "warning":
        return AlertTriangle;
      case "error":
        return XCircle;
      case "success":
        return CheckCircle;
      case "info":
      default:
        return Info;
    }
  })();

  return (
    <div style={combinedStyle}>
      <IconComponent size={14} style={{ marginRight: "0.25rem" }} />
      {children}
    </div>
  );
}
