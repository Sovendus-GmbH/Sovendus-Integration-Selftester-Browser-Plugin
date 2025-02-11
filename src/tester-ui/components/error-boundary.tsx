import type { JSX } from "react";
import React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { debugUi } from "../../logger/ui-logger";
import { colors } from "../styles";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    debugUi("ErrorBoundary", "Uncaught error:", { error, errorInfo });
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
        />
      );
    }

    return this.props.children;
  }
}

function ErrorComponent({
  error,
  errorInfo,
}: {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}): JSX.Element {
  const containerStyle: React.CSSProperties = {
    color: colors.text,
    padding: "1rem",
    backgroundColor: "#F87171",
    border: "1px solid #F87171",
    borderRadius: "0.375rem",
  };

  const headingStyle: React.CSSProperties = {
    color: colors.text,
    fontSize: "1.5rem",
    fontWeight: "bold",
    marginBottom: "1rem",
  };

  const paragraphStyle: React.CSSProperties = {
    color: colors.text,
    marginBottom: "1rem",
  };

  const detailsStyle: React.CSSProperties = {
    color: colors.text,
    whiteSpace: "pre-wrap",
  };

  const summaryStyle: React.CSSProperties = {
    color: colors.text,
    cursor: "pointer",
    marginBottom: "0.5rem",
  };

  const preStyle: React.CSSProperties = {
    color: colors.text,
    fontSize: "0.75rem",
    overflowX: "auto",
    backgroundColor: "#F3F4F6",
    padding: "0.5rem",
    borderRadius: "0.25rem",
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Something went wrong</h1>
      <div style={paragraphStyle}>
        Please try refreshing the page or contact support if the issue persists.
      </div>
      <details style={detailsStyle}>
        <summary style={summaryStyle}>Error Details</summary>
        <div style={paragraphStyle}>
          <strong>Error:</strong>{" "}
          {error && (error?.toString?.() || JSON.stringify(error))}
        </div>
        {error?.stack ? (
          <>
            <div style={paragraphStyle}>
              <strong>Stack Trace:</strong>
            </div>
            <pre style={preStyle}>{error.stack}</pre>
          </>
        ) : (
          <></>
        )}
        {errorInfo?.componentStack ? (
          <>
            <div style={{ ...paragraphStyle, marginTop: "1rem" }}>
              <strong>Component Stack:</strong>
            </div>
            <pre style={preStyle}>{errorInfo.componentStack}</pre>
          </>
        ) : (
          <></>
        )}
      </details>
    </div>
  );
}
