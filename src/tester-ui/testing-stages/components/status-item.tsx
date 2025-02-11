import type { CheckCircle } from "lucide-react";
import type { JSX } from "react";
import React from "react";

interface StatusItemProps {
  label: string;
  value: string;
  icon?: typeof CheckCircle | undefined;
  color?: string;
  small?: boolean;
}

export function StatusItem({
  label,
  value,
  icon: Icon,
  color,
  small,
}: StatusItemProps): JSX.Element {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: small ? "0.75rem" : "0.875rem",
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: "500",
  };

  const valueStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    color: color || "white",
  };

  return (
    <div style={containerStyle}>
      <span style={labelStyle}>{label}</span>
      <span style={valueStyle}>
        {Icon && (
          <Icon size={small ? 12 : 16} style={{ marginRight: "0.25rem" }} />
        )}
        {value}
      </span>
    </div>
  );
}
