"use client";

import type { JSX } from "react";
import { useState } from "react";

export function Test(): JSX.Element {
  const [htmlContent, setHtmlContent] = useState<string>("");

  const sendRequest = async (): Promise<void> => {
    try {
      // Send a POST request to the API endpoint.
      const response = await fetch("/api/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Next.js",
          message: "Hello from Next.js App Router!",
        }),
      });

      const data = await response.json();
      setHtmlContent(data.html);
    } catch (error) {
      console.error("Error fetching API:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Next.js API Example (App Router)</h1>
      <button
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={sendRequest}
      >
        Send Request
      </button>
      {/* Render the returned HTML string safely */}
      <div
        style={{ marginTop: "20px" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}
