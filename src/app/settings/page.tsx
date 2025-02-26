"use client";

import "sovendus-integration-settings-ui/style.css";

import { type JSX, useState } from "react";
import { SovendusSettings } from "sovendus-integration-settings-ui";
import { type SovendusAppSettings } from "sovendus-integration-types";

import { getSettings } from "./settings-util";

export default function Home(): JSX.Element {
  const [currentSettings, setCurrentSettings] =
    useState<SovendusAppSettings>(getSettings);
  const saveSettings = async (
    newSettings: SovendusAppSettings,
    // eslint-disable-next-line @typescript-eslint/require-await
  ): Promise<SovendusAppSettings> => {
    // eslint-disable-next-line no-console
    console.log("Saving settings:", newSettings);
    localStorage.setItem("sovendus-settings", JSON.stringify(newSettings));
    return newSettings;
  };

  return (
    <SovendusSettings
      currentStoredSettings={currentSettings}
      saveSettings={async (newSettings) => {
        const updated = await saveSettings(newSettings);
        setCurrentSettings(updated);
        return updated;
      }}
    />
  );
}
