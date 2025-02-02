import type { IntegrationDetectorData } from "../detector/integration-detector";
import type { TestResultDataType } from "../tester/integration-tester-data-to-sync-with-dev-hub";
import type { OverlayState } from "./hooks/use-overlay-state";

export interface ExtensionStorage {
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
    | "TAKE_SCREENSHOT"
    | "TAKE_SCREENSHOT_RESPONSE"
    | "UPDATE_SETTINGS_RESPONSE";
  settings?: ExtensionStorage;
  success?: boolean;
  screenshotUrl?: string;
  error?: string;
}>;

export enum OverlaySize {
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export enum IntegrationType {
  CB_VN = "Checkout Benefits & Voucher Network",
  CHECKOUT_PRODUCTS = "Checkout Products",
  OPTIMIZE = "Optimize",
}

export enum PageType {
  UNKNOWN = "unknown",
  LANDING = "landing",
  SUCCESS = "success",
  NAVIGATION_PROMPT = "navigation_prompt",
}

export const defaultStorage: ExtensionStorage = {
  transmitTestResult: undefined,
  testHistory: {},
  blacklist: [],
  currentTestRuns: {},
  uiState: {
    position: { x: 20, y: 20 },
  },
};

export interface UiState {
  position: { x: number; y: number };
}

export interface TestRun {
  id: string;
  overlaySize: OverlaySize;
  startTime: number;
  endTime?: number;
  withConsent: boolean | undefined;
  currentPageType: PageType | undefined;
  landingPageResult: TestResult;
  successPageResult: TestResult;
  currentStage: StageKeys;
  lastStage: StageKeys | undefined;
  completed: boolean;
}

export type TestingFlowConfigType = {
  stages: {
    [stageKey in StageKeys]?: StageType;
  };
  initialStage: StageKeys;
  transitions: {
    [stageKey in StageKeys]: TransitionType;
  };
};

export type TransitionType = {
  [transitionType in TransitionTypes]?: StageKeys;
};

export interface StepProps {
  overlayState: OverlayState;
}

export type StageType = {
  component: ({ overlayState }: StepProps) => React.JSX.Element;
  availableSizes: OverlaySize[];
  defaultSize: OverlaySize;
};

export type StageKeys =
  | "initialPrompt"
  | "confirmBlacklist"
  | "consentSelection"
  | "pageSelection"
  | "landingPageTest"
  | "declineBlacklist"
  | "successPageTest"
  | "testHistory";

export type TransitionTypes =
  | "ACCEPT"
  | "DECLINE"
  | "BLACKLIST"
  | "HIDE_OVERLAY"
  | "SELECT"
  | "SELECT_LANDING"
  | "SELECT_SUCCESS"
  | "COMPLETE"
  | "NAVIGATE"
  | "TO_TEST_HISTORY"
  | "RESTART";

export interface TestResult {
  integrationTester: TestResultDataType | undefined;
  integrationDetector: IntegrationDetectorData;
  screenshotUri: string | undefined;
}
