export interface ExtensionSettings {
  transmitTestResult: boolean;
  blacklist: string[];
}

export type ExtensionSettingsEvent = MessageEvent<{
  type?:
    | "GET_SETTINGS"
    | "UPDATE_SETTINGS"
    | "SETTINGS_RESPONSE"
    | "SETTINGS_UPDATE_RESPONSE";
  settings?: ExtensionSettings;
  success?: boolean;
}>;
