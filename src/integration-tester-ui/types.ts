import type SelfTester from "../integration-tester/integrationTester";
import type { OverlayState } from "./hooks/useOverlayState";
import type { testingFlowConfig } from "./testing-flow-config";

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
  currentStage: StageName;
  lastStage: StageName | undefined;
  completed: boolean;
}

export interface TestResult {
  status: "success" | "error" | "not-run";
  details: string;
  integrationTester: SelfTester | undefined;
}

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

export interface OverlayDimensions {
  width: number;
  height: number;
}

export interface StepProps {
  overlayState: OverlayState;
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

export type StageName = keyof typeof testingFlowConfig.stages;
