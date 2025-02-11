import type { CSSProperties, JSX, ReactNode } from "react";
import React from "react";

import { colors } from "../styles";
import { OverlaySize } from "../testing-storage";

type BasicProps = {
  overlaySize: OverlaySize;
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
};

export function P({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "1rem"
        : overlaySize === OverlaySize.MEDIUM
          ? "1rem"
          : "1rem",
    fontWeight: "normal",
    margin: "1em 0",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function H1({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "1.6rem"
        : overlaySize === OverlaySize.MEDIUM
          ? "1.1rem"
          : ".9rem",
    fontWeight: "bold",
    margin:
      overlaySize === OverlaySize.LARGE
        ? ".5rem 0 1.2rem 0"
        : overlaySize === OverlaySize.MEDIUM
          ? ".5rem 0 .8rem 0"
          : ".5rem 0 .8rem 0",
    color: colors.text,
    textAlign: "center",
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function H2({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "1.5rem"
        : overlaySize === OverlaySize.MEDIUM
          ? "1.5rem"
          : "1.5rem",
    fontWeight: "bold",
    margin: "0.75rem 0 1rem 0",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function H3({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "1.17rem"
        : overlaySize === OverlaySize.MEDIUM
          ? "1.17rem"
          : "1.17rem",
    fontWeight: "bold",
    margin: "0.67rem 0 0.85rem 0",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function H4({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "1rem"
        : overlaySize === OverlaySize.MEDIUM
          ? "1rem"
          : "1rem",
    fontWeight: "bold",
    margin: "0.67rem 0 0.85rem 0",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function H5({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    fontSize:
      overlaySize === OverlaySize.LARGE
        ? "0.83em"
        : overlaySize === OverlaySize.MEDIUM
          ? "0.83em"
          : "0.83em",
    fontWeight: "bold",
    margin: "0.67rem 0 0.85rem 0",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

export function A({
  children,
  style,
  onClick,
  overlaySize,
}: BasicProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    textDecoration: "underline",
    cursor: "pointer",
    color: colors.link,
  };

  // When using a div to simulate a link, you might decide to handle navigation in onClick.
  return (
    <div style={{ ...defaultStyle, ...style }} onClick={onClick}>
      {children}
    </div>
  );
}

type ListProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export function UL({ children, style }: ListProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "1rem",
    margin: "0.5rem 0",
    color: colors.text,
  };
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
}

export function LI({ children, style }: ListProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    marginBottom: "0.5rem",
    display: "flex",
    alignItems: "baseline",
    color: colors.text,
  };
  return (
    <div style={{ ...defaultStyle, ...style }}>
      <span style={{ marginRight: "0.5rem" }}>•</span>
      <div>{children}</div>
    </div>
  );
}

export function OL({ children, style }: ListProps): JSX.Element {
  const defaultStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "1rem",
    margin: "0.5rem 0",
    color: colors.text,
  };

  // Wrap each child and add an index number as prefix.
  const modifiedChildren = React.Children.map(children, (child, index) => (
    <div
      style={{
        marginBottom: "0.5rem",
        display: "flex",
        alignItems: "baseline",
        color: colors.text,
      }}
    >
      <span style={{ marginRight: "0.5rem" }}>{index + 1}.</span>
      <div>{child}</div>
    </div>
  ));

  return <div style={{ ...defaultStyle, ...style }}>{modifiedChildren}</div>;
}
