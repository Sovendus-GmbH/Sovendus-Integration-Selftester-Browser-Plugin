import type { JSX, ReactNode } from "react";
import React from "react";

import { IntegrationTester } from "./components/SelfTester";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body
        style={{
          color: "#ededed",
          background: "#171717",
        }}
      >
        <IntegrationTester />
        {children}
      </body>
    </html>
  );
}
