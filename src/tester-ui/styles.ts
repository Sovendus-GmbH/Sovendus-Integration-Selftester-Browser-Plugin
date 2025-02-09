import { type CSSProperties } from "react";

export const colors = {
  primary: "#4F46E5",
  secondary: "#7C3AED",
  background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
  overlayShadow: "rgba(0, 0, 0, 0.25)",
  backgroundToolBar: "rgba(255, 255, 255, 0.1)",
  text: "#F3F4F6",
  textLight: "rgba(255, 255, 255, 0.7)",
  white: "#FFFFFF",
  error: "#D30000",
  warning: "#F59E0B",
  success: "#10B981",
  disabled: "#D1D5DB",
};

export const styles: {
  [key in "text"]: CSSProperties; // | "content" // | "toolbar" // | "overlay" // | "textLight"
} = {
  text: {
    color: colors.text,
  },
  textLight: {
    color: colors.textLight,
  },
  overlay: {
    position: "fixed",
    backgroundColor: colors.background,
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
};
