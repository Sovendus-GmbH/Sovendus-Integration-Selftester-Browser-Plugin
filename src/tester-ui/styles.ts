import { type CSSProperties } from "react";

export const colors = {
  primary: "#4F46E5",
  secondary: "#10B981",
  background: "#F3F4F6",
  text: "#1F2937",
  textLight: "#6B7280",
  white: "#FFFFFF",
  error: "#EF4444",
  warning: "#F59E0B",
  success: "#10B981",
  disabled: "#D1D5DB",
};

export const styles: Record<string, CSSProperties> = {
  overlay: {
    position: "fixed",
    backgroundColor: colors.white,
    borderRadius: "0.75rem",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
    backgroundColor: colors.primary,
    color: colors.white,
    borderTopLeftRadius: "0.75rem",
    borderTopRightRadius: "0.75rem",
  },
  content: {
    padding: "1.5rem",
    overflowY: "auto",
  },
  button: {
    padding: "0.5rem 1rem",
    backgroundColor: colors.secondary,
    color: colors.white,
    border: "none",
    borderRadius: "0.375rem",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
};
