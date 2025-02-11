import type { CSSProperties, JSX, ReactNode } from "react";

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
  currentPageType: PageType;
  landingPageResult: TestResult;
  successPageResult: TestResult;
  currentStage: StageKeys;
  lastStage: StageKeys | undefined;
  lastTransition: TransitionTypes | undefined;
  completed: boolean;
  selectedProducts: SovendusProductKey[];
}

export type SovendusProductKey = keyof typeof sovendusProductKeys;

export const sovendusProductKeys = {
  VOUCHER_NETWORK: "VOUCHER_NETWORK",
  CHECKOUT_BENEFITS: "CHECKOUT_BENEFITS",
  OPTIMIZE: "OPTIMIZE",
  CHECKOUT_PRODUCTS: "CHECKOUT_PRODUCTS",
} as const;

export const sovendusProductTitles: Record<
  keyof typeof sovendusProductKeys,
  string
> = {
  VOUCHER_NETWORK: "Voucher Network",
  CHECKOUT_BENEFITS: "Checkout Benefits",
  OPTIMIZE: "Optimize",
  CHECKOUT_PRODUCTS: "Checkout Products",
};

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
  stageInfo: StageType;
}

export type StageType = {
  readonly title?: string;
  readonly instruction?: string;
  readonly applicableProducts?: SovendusProductKey[];
  readonly icon?: ({
    size,
    style,
  }: {
    size: number;
    style?: CSSProperties;
  }) => ReactNode;
  readonly component: ({ overlayState }: StepProps) => JSX.Element;
  readonly availableSizes: readonly OverlaySize[];
  readonly defaultSize: OverlaySize;
  readonly transitions: {
    [transitionType in TransitionTypes]?: Transition;
  };
};

export interface Transition {
  target: StageKeys;
  action?: (args: {
    set: {
      (
        partial:
          | OverlayState
          | Partial<OverlayState>
          | ((state: OverlayState) => OverlayState | Partial<OverlayState>),
        replace?: false,
      ): void;
      (
        state: OverlayState | ((state: OverlayState) => OverlayState),
        replace: true,
      ): void;
    };
    get: () => OverlayState;
  }) => Promise<void> | void;
}

export type StageKeys =
  | "initialPrompt"
  | "blacklistConfirmation"
  | "featureSelection"
  | "consentSelection"
  | "productSelection"
  | "landingPageTestScreenshot"
  | "landingPageTestVoucherCode"
  | "landingPageTestOrderValue"
  | "landingPageTestCurrency"
  | "landingPageTestDummyParams"
  | "landingPageTestOptimizeCheck"
  | "landingPageTestTestPurchase"
  | "successPageTest"
  | "testHistory";

export type TransitionTypes =
  | "ACCEPT"
  | "CHECK"
  | "HIDE"
  | "BACK"
  | "WITHOUT_CONSENT"
  | "WITH_CONSENT"
  | "TO_TEST_HISTORY"
  | "BLACKLIST"
  | "CONTINUE"
  | "COMPLETE"
  | "DECLINE"
  | "RESTART"
  | "SELECT"
  | "TEST_INTEGRATION";

export interface TestResult {
  integrationTester: TestResultDataType | undefined;
  integrationDetector: IntegrationDetectorData;
  screenshotUri: string | undefined;
}
