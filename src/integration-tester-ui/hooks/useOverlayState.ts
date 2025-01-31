import { useMemo } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

import type {
  ExtensionStorage,
  ExtensionStorageLoaded,
} from "../../browser-extension-specific/types";
import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { defaultIntegrationState } from "../../integration-detector/integrationDetector";
import { isBlacklistedPage } from "../../integration-detector/integrationDetector";
import { debug } from "../../logger/logger";
import type { StageKeys, StageName, StageType } from "../testing-flow-config";
import { testingFlowConfig } from "../testing-flow-config";
import type { UiState } from "../types";
import { OverlaySize, PageType } from "../types";

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
}

export interface OverlayState {
  currentHost: string;
  isPromptVisible: boolean;
  integrationState: IntegrationDetectorData;
  testerStorage: ExtensionStorageLoaded;
  _getSettings: () => Promise<ExtensionStorage>;
  _updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
  setUiState: (state: Partial<UiState>) => void;
  setPosition: (
    positionCallBack: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    },
  ) => void;
  transition: (nextStage: StageKeys) => void;
  getTestRunHistory: () => TestRun[];
  getCurrentTestRun: () => TestRun;
  setCurrentTestRunData: (testRunData: Partial<TestRun>) => void;
  handleInitialSovendusCheck: () => void;
  handleConsentSelection: (withConsent: boolean) => void;
  handlePageSelection: (pageType: PageType) => void;
  handleTestCompletion: (result: TestResult) => void;
  handleNavigateToSuccessPage: () => void;
  startNewTest: () => void;
  showTestHistory: () => void;
  transitionBack: () => void;
  addToBlacklist: () => Promise<void>;
  resizeOverlay: (direction: "increase" | "decrease") => void;
  hideOverlay: () => void;
  openBlacklistConfirmation: () => void;
  saveSettings: () => Promise<void>;
}

export const useOverlayState = (
  settings: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>,
): ReturnType<typeof useMemo<UseBoundStore<StoreApi<OverlayState>>>> => {
  return useMemo(() => {
    return create<OverlayState>((set, get) => {
      const isBlackListedPage: boolean = isBlacklistedPage(settings?.blacklist);
      return {
        currentHost: window.location.host,
        isPromptVisible: !isBlackListedPage,
        _getSettings: getSettings,
        _updateSettings: updateSettings,
        testerStorage: {
          currentPageType: PageType.LANDING,
          testHistory: [],
          currentTestRuns: {
            [window.location.host]: createNewTestRun(),
          },
          ...settings,
          uiState: {
            position: { x: 20, y: 20 },
            overlaySize: OverlaySize.SMALL,
            integrationType: undefined,

            // testingState: TestingState.NOT_STARTED,
            ...settings.uiState,
          },
        },
        integrationState: {
          shouldCheck: true,
          selfTester: undefined,
          integrationState: defaultIntegrationState,
          isBlackListedPage: isBlackListedPage,
        },

        getCurrentTestRun: () => {
          const {
            currentHost,
            testerStorage: { currentTestRuns },
          } = get();
          return currentTestRuns?.[currentHost] as TestRun;
        },

        getTestRunHistory: () => {
          const {
            currentHost,
            testerStorage: { testHistory },
          } = get();
          return testHistory?.[currentHost] as TestRun[];
        },

        setCurrentTestRunData: (testRunData: Partial<TestRun>) => {
          set((state) => {
            const currentRun = state.testerStorage.currentTestRuns?.[
              window.location.host
            ] as TestRun;
            return {
              testerStorage: {
                ...state.testerStorage,
                currentTestRuns: {
                  ...state.testerStorage.currentTestRuns,
                  [window.location.host]: {
                    ...currentRun,
                    ...testRunData,
                  },
                },
              },
            };
          });
        },

        addToBlacklist: async () => {
          debug(
            "useOverlayState",
            `Adding ${window.location.host} to blacklist`,
          );
          const { _updateSettings, testerStorage: settings } = get();
          await _updateSettings({
            ...settings,
            blacklist: [...(settings?.blacklist || []), window.location.host],
          });
          set((state) => ({
            integrationState: {
              ...state.integrationState,
              isBlackListedPage: true,
            },
          }));
        },

        openBlacklistConfirmation: () => {
          get().transition(
            testingFlowConfig.transitions.initialPrompt.DECLINE!,
          );
        },

        setUiState: (partialState) =>
          set((state) => ({
            testerStorage: {
              ...state.testerStorage,
              uiState: {
                ...state.testerStorage.uiState,
                ...partialState,
              },
            },
          })),

        transition: (nextStage: StageKeys) => {
          debug("useOverlayState", `Transitioning to ${nextStage}`);
          const stageConfig = testingFlowConfig.stages[nextStage] as StageType;
          const { getCurrentTestRun, setCurrentTestRunData, setUiState } =
            get();
          const currentRun = getCurrentTestRun();
          setCurrentTestRunData({
            lastStage: currentRun.currentStage,
            currentStage: nextStage,
          });
          setUiState({ overlaySize: stageConfig.defaultSize });
        },

        handleInitialSovendusCheck: () => {
          debug("useOverlayState", 'Initial prompt response: "accepted"');
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        hideOverlay: () => {
          get().setUiState({ isPromptVisible: false });
        },

        handleConsentSelection: (withConsent) => {
          debug(
            "useOverlayState",
            `Consent selection: ${withConsent ? "with consent" : "without consent"}`,
          );
          get().setCurrentTestRunData({ withConsent });
          get().transition(
            testingFlowConfig.transitions.consentSelection.SELECT!,
          );
        },

        handlePageSelection: (pageType) => {
          debug("useOverlayState", `Page selection: ${pageType}`);
          get().setCurrentTestRunData({ currentPageType: pageType });
          get().transition(
            pageType === PageType.LANDING
              ? testingFlowConfig.transitions.pageSelection.SELECT_LANDING!
              : testingFlowConfig.transitions.pageSelection.SELECT_SUCCESS!,
          );
        },

        handleTestCompletion: (result) => {
          const { currentPageType, currentTestRun, testHistory } = get();
          debug(
            "useOverlayState",
            `Test completion: ${currentPageType}`,
            result,
          );
          set((state) => ({
            testingCompleted: {
              ...state.testingCompleted,
              [currentPageType]: true,
            },
          }));
          if (currentPageType === PageType.LANDING) {
            set({ landingPageResult: result });
          } else {
            set({ successPageResult: result });
          }
          if (currentTestRun) {
            const updatedRun = {
              ...currentTestRun,
              [currentPageType === PageType.LANDING
                ? "landingPageResult"
                : "successPageResult"]: result,
              completed: currentPageType === PageType.SUCCESS,
            };
            if (currentPageType === PageType.SUCCESS) {
              set({
                testHistory: [
                  ...testHistory.filter((test) => test.id !== updatedRun.id),
                  updatedRun,
                ],
                currentTestRun: null,
              });
            } else {
              set({ currentTestRun: updatedRun });
            }
          }
          get().setUiState({ testingState: TestingState.COMPLETED });
        },

        handleNavigateToSuccessPage: () => {
          debug("useOverlayState", "Navigating to success page");
          get().setCurrentTestRunData({ currentPageType: PageType.SUCCESS });
          get().transition(
            testingFlowConfig.transitions.landingPageTest.NAVIGATE!,
          );
        },

        startNewTest: () => {
          debug("useOverlayState", "Starting new test");
          get().setCurrentTestRunData(createNewTestRun());
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        showTestHistory: () => {
          debug("useOverlayState", "Showing test history");
          get().transition(
            testingFlowConfig.transitions.testHistory.TO_TEST_HISTORY!,
          );
        },

        resizeOverlay: (direction: "increase" | "decrease") => {
          debug("useOverlayState", "resize Overlay", direction);
          const { uiState, currentStage } = get();
          const stageConfig = testingFlowConfig.stages[currentStage];
          const availableSizes = stageConfig.availableSizes;
          const currentSizeIndex = availableSizes.indexOf(uiState.overlaySize);
          const newSizeIndex =
            direction === "increase"
              ? currentSizeIndex + 1
              : currentSizeIndex - 1;
          if (newSizeIndex >= 0 && newSizeIndex < availableSizes.length) {
            set({
              uiState: {
                ...uiState,
                overlaySize: availableSizes[newSizeIndex] as OverlaySize,
              },
            });
          }
        },

        transitionBack: () => {
          debug("useOverlayState", "Exiting history view");
          const { getCurrentTestRun, transition } = get();
          const currentTestRun = getCurrentTestRun();
          if (!currentTestRun.lastStage) {
            console.error("No last stage found to go back to");
            return;
          }
          transition(currentTestRun.lastStage);
        },

        setPosition: (setPositionCallback) => {
          debug("useOverlayState", "Setting position");
          const {
            testerStorage: {
              uiState: { position },
            },
          } = get();
          const newPosition = setPositionCallback(position);
          set({
            testerStorage: {
              ...get().testerStorage,
              uiState: {
                ...get().testerStorage.uiState,
                position: newPosition,
              },
            },
          });
        },

        saveSettings: async () => {
          debug("useOverlayState", "Saving settings");
          const { testerStorage, _updateSettings } = get();
          await _updateSettings(testerStorage);
        },
      } as OverlayState;
    });
  }, []);
};

function createNewTestRun(): TestRun {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    withConsent: undefined,
    landingPageResult: { status: "not-run", details: "" },
    successPageResult: { status: "not-run", details: "" },
    currentStage: "initialPrompt",
    completed: false,
    lastStage: undefined,
    currentPageType: PageType.LANDING,
  };
}
