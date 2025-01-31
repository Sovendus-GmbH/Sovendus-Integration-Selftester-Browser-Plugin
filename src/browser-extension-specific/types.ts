import type { TestRun } from "../integration-tester-ui/hooks/useOverlayState";
import type { UiState } from "../integration-tester-ui/types";

export interface ExtensionStorage {
  transmitTestResult: boolean | undefined;
  blacklist: string[];
  uiState: UiState;
  testHistory: { [domain: string]: TestRun[] };
  currentTestRuns: { [domain: string]: TestRun } | null;
}

export interface ExtensionStorageLoaded {
  transmitTestResult: boolean | undefined;
  blacklist: string[];
  uiState: UiState;
  testHistory: { [domain: string]: TestRun[] };
  currentTestRuns: { [domain: string]: TestRun } | null;
}

export type ExtensionSettingsEvent = MessageEvent<{
  type?:
    | "GET_SETTINGS"
    | "UPDATE_SETTINGS"
    | "GET_SETTINGS_RESPONSE"
    | "UPDATE_SETTINGS_RESPONSE";
  settings?: ExtensionStorage;
  success?: boolean;
}>;
