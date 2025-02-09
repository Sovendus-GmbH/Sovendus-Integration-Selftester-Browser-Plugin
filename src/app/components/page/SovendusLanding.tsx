"use client";

import { urlConfig as developmentConfig } from "integration-scripts-builder/integration-scripts-builder/build-config/cfg.development";
import { urlConfig as previewConfig } from "integration-scripts-builder/integration-scripts-builder/build-config/cfg.preview";
import type { JSX } from "react";
import React, { useEffect } from "react";
import type { SovendusPageWindow } from "sovendus-integration-scripts/src/js/page/page";
import { startSovendusPage } from "sovendus-integration-scripts/src/js/page/page";

export default function SovendusLandingPage(): JSX.Element {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlConfig =
        process.env["NODE_ENV"] === "development"
          ? developmentConfig
          : process.env["NODE_ENV"] === "production"
            ? previewConfig
            : undefined;
      window.sovApplication = {
        ...window.sovApplication,
        urlConfig: {
          ENVIRONMENT: urlConfig.ENVIRONMENT,
          OPTIMIZE_URL: urlConfig.OPTIMIZE_URL,
        },
      };
      startSovendusPage(window);
    }
  }, []);
  return <></>;
}

declare let window: SovendusPageWindow;
