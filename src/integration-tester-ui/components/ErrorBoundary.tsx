import React from "react";
import { Component, type ErrorInfo, type ReactNode } from "react";

import { debugUi } from "../../logger/ui-logger";

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
      const containerStyle: React.CSSProperties = {
        padding: "1rem",
        backgroundColor: "#FEE2E2",
        border: "1px solid #F87171",
        color: "#B91C1C",
        borderRadius: "0.375rem",
      };

      const headingStyle: React.CSSProperties = {
        fontSize: "1.5rem",
        fontWeight: "bold",
        marginBottom: "1rem",
      };

      const paragraphStyle: React.CSSProperties = {
        marginBottom: "1rem",
      };

      const detailsStyle: React.CSSProperties = {
        whiteSpace: "pre-wrap",
      };

      const summaryStyle: React.CSSProperties = {
        cursor: "pointer",
        marginBottom: "0.5rem",
      };

      const preStyle: React.CSSProperties = {
        fontSize: "0.75rem",
        overflowX: "auto",
        backgroundColor: "#F3F4F6",
        padding: "0.5rem",
        borderRadius: "0.25rem",
      };

      return (
        <div style={containerStyle}>
          <h1 style={headingStyle}>Something went wrong</h1>
          <p style={paragraphStyle}>
            Please try refreshing the page or contact support if the issue
            persists.
          </p>
          <details style={detailsStyle}>
            <summary style={summaryStyle}>Error Details</summary>
            <p style={paragraphStyle}>
              <strong>Error:</strong>{" "}
              {this.state.error && this.state.error.toString()}
            </p>
            <p style={paragraphStyle}>
              <strong>Stack Trace:</strong>
            </p>
            <pre style={preStyle}>
              {this.state.error && this.state.error.stack}
            </pre>
            <p style={{ ...paragraphStyle, marginTop: "1rem" }}>
              <strong>Component Stack:</strong>
            </p>
            <pre style={preStyle}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
