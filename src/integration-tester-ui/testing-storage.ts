import type SelfTester from "../integration-tester/integrationTester";
import type { OverlayState } from "./hooks/useOverlayState";

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
    | "UPDATE_SETTINGS_RESPONSE";
  settings?: ExtensionStorage;
  success?: boolean;
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
    overlaySize: OverlaySize.SMALL,
  },
};

export interface UiState {
  position: { x: number; y: number };
  overlaySize: OverlaySize;
  // integrationType: IntegrationType | undefined;
  // testingState: TestingState;
}

export interface TestRun {
  id: string;
  startTime: number;
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
  status: "success" | "error" | "not-run";
  details: string;
  integrationTester: SelfTester | undefined;
}
