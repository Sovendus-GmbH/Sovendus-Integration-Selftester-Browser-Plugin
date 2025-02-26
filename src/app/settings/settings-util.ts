import { type SovendusAppSettings, Versions } from "sovendus-integration-types";

const initialSettings: SovendusAppSettings = {
  voucherNetwork: {
    settingType: undefined,
    cookieTracking: false,
  },
  optimize: {
    settingsType: undefined,
  },
  checkoutProducts: false,
  employeeBenefits: {
    isEnabled: false,
    addToSidebar: false,
    showWidgetOnDashboard: false,
  },
  version: Versions.THREE,
};

export function getSettings(): SovendusAppSettings {
  const settings = localStorage.getItem("sovendus-settings");
  if (settings) {
    return JSON.parse(settings) as SovendusAppSettings;
  }
  return initialSettings;
}
