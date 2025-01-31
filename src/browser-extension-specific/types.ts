import type { TestRun } from "../integration-tester-ui/hooks/useOverlayState";
import type { UiState } from "../integration-tester-ui/types";

export interface ExtensionStorage {
  transmitTestResult?: boolean;
  blacklist?: string[];
  uiState?: UiState;
  testHistory?: { [domain: string]: TestRun[] };
  currentTestRuns?: { [domain: string]: TestRun } | null;
}

export interface ExtensionStorageLoaded {
  transmitTestResult: boolean;
  blacklist: string[];
  uiState: UiState;
  testHistory: { [domain: string]: TestRun[] };
  currentTestRuns: { [domain: string]: TestRun } | null;
}

export type ExtensionSettingsEvent = MessageEvent<{
  type?:
    | "GET_SETTINGS"
    | "UPDATE_SETTINGS"
    | "SETTINGS_RESPONSE"
    | "SETTINGS_UPDATE_RESPONSE";
  settings?: ExtensionStorage;
  success?: boolean;
}>;
