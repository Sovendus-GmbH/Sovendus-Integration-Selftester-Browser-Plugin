import type { JSX, ReactNode } from "react";
import React from "react";

import NavBar from "./components/NavBar";
import { IntegrationTester } from "./components/SelfTester";

export const metadata = {
  title: "Preview ENV for sovendus plugin settings ui",
  description: "Using Next.js <3",
};

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
        <main style={{ padding: "40px" }}>
          <NavBar />
          {children}
        </main>
      </body>
    </html>
  );
}
