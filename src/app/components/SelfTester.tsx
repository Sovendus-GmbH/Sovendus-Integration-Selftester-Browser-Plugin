"use client";

import type { JSX } from "react";
// import { startIntegrationTester as start } from "sovendus-integration-tester/src/tester-loader/integration-tester-loader";
// import type { ExtensionStorage } from "sovendus-integration-tester/src/tester-ui/testing-storage";
// import { defaultStorage } from "sovendus-integration-tester/src/tester-ui/testing-storage";
import type { SovendusPageWindow } from "sovendus-integration-types";

export function IntegrationTester(): null {
  // if (typeof window !== "undefined") {
  //   window.transmitTestResult = true;
  //   const initializeExtension = async (): Promise<void> => {
  //     // eslint-disable-next-line @typescript-eslint/require-await
  //     const getSettings = async (): Promise<ExtensionStorage> => {
  //       const jsonSettings = localStorage.getItem("sov_settings");
  //       return (
  //         jsonSettings ? JSON.parse(jsonSettings) : defaultStorage
  //       ) as ExtensionStorage;
  //     };

  //     const updateSettings = async (
  //       settings: ExtensionStorage,
  //       // eslint-disable-next-line @typescript-eslint/require-await
  //     ): Promise<boolean> => {
  //       localStorage.setItem("sov_settings", JSON.stringify(settings));
  //       return true;
  //     };

  //     // eslint-disable-next-line @typescript-eslint/require-await
  //     const takeScreenshot = async (): Promise<string> => {
  //       return screencapMock;
  //     };

  //     const settings = await getSettings();
  //     void start(settings, getSettings, updateSettings, takeScreenshot);
  //   };
  //   void initializeExtension();
  // }
  return null;
}

export function ClearTesterStorageButton(): JSX.Element {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("sov_settings");
        window.location.reload();
      }}
      style={{ padding: "5px", background: "red", color: "white" }}
    >
      clear tester storage
    </button>
  );
}

interface DebugSovendusPageWindow extends SovendusPageWindow {
  transmitTestResult: boolean;
}

declare let window: DebugSovendusPageWindow;

// const screencapMock =
//   "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA" +
//   "AAAFCAYAAACNbyblAAAAHElEQVQI12P4" +
//   "//8/w38GIAXDIBKE0DHxgljNBAAO" +
//   "9TXL0Y4OHwAAAABJRU5ErkJggg==";
