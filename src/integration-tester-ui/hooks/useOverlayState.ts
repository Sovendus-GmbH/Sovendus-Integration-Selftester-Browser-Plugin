import { useMemo } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { defaultIntegrationState } from "../../integration-detector/integrationDetector";
import { isBlacklistedPage } from "../../integration-detector/integrationDetector";
import type { SovSelfTesterWindow } from "../../integration-tester/integrationTester";
import { debug, error } from "../../logger/logger";
import { testingFlowConfig } from "../testing-flow-config";
import type {
  ExtensionStorage,
  OverlaySize,
  StageKeys,
  StageType,
  TestResult,
  TestRun,
} from "../testing-storage";
import { PageType } from "../testing-storage";

export interface OverlayState {
  currentHost: string;
  integrationState: IntegrationDetectorData;
  testerStorage: ExtensionStorage;
  isPromptVisible: boolean;
  _getSettings: () => Promise<ExtensionStorage>;
  _updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
  // setUiState: (state: Partial<UiState>) => void;
  setPosition: (
    positionCallBack: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    },
  ) => void;
  setIntegrationState: (
    positionCallBack: (
      position: IntegrationDetectorData,
    ) => Partial<IntegrationDetectorData>,
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
  addToBlacklist: () => void;
  resizeOverlay: (direction: "increase" | "decrease") => void;
  hideOverlay: () => void;
  openBlacklistConfirmation: () => void;
  updateTesterStorage: (
    updateCallBack: (
      currentState: ExtensionStorage,
    ) => Partial<ExtensionStorage>,
  ) => void;
  saveSettings: () => Promise<void>;
}

export const useOverlayState = (
  testerStorage: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>,
): ReturnType<typeof useMemo<UseBoundStore<StoreApi<OverlayState>>>> => {
  return useMemo(() => {
    return create<OverlayState>((set, get) => {
      const isBlackListedPage: boolean = isBlacklistedPage(
        testerStorage?.blacklist,
      );
      const currentHost: string = window.location.host;
      const newTesterStorage: ExtensionStorage = {
        ...testerStorage,
        currentTestRuns: {
          ...testerStorage.currentTestRuns,
          [currentHost]:
            testerStorage.currentTestRuns?.[currentHost] || createNewTestRun(),
        },
      };
      return {
        isPromptVisible: !isBlackListedPage,
        currentHost,
        _getSettings: getSettings,
        _updateSettings: updateSettings,
        testerStorage: newTesterStorage,
        integrationState: defaultIntegrationState,

        getCurrentTestRun: (): TestRun => {
          const {
            currentHost,
            testerStorage: { currentTestRuns },
          } = get();
          return currentTestRuns?.[currentHost] as TestRun;
        },

        getTestRunHistory: (): TestRun[] => {
          const {
            currentHost,
            testerStorage: { testHistory },
          } = get();
          return testHistory?.[currentHost] || [];
        },

        setCurrentTestRunData: (testRunData: Partial<TestRun>): void => {
          const { updateTesterStorage } = get();
          updateTesterStorage((testerStorage) => {
            const currentRun = testerStorage.currentTestRuns?.[
              window.location.host
            ] as TestRun;
            return {
              ...testerStorage,
              currentTestRuns: {
                ...testerStorage.currentTestRuns,
                [window.location.host]: {
                  ...currentRun,
                  ...testRunData,
                },
              },
            };
          });
        },

        addToBlacklist: (): void => {
          debug(
            "useOverlayState",
            `Adding ${window.location.host} to blacklist`,
          );
          const { _updateSettings, testerStorage } = get();
          set((state) => {
            const newTesterStorage = {
              ...state.testerStorage,
              blacklist: [...testerStorage.blacklist, window.location.host],
            };
            void _updateSettings(newTesterStorage);
            return {
              testerStorage: newTesterStorage,
              isPromptVisible: false,
            };
          });
        },

        openBlacklistConfirmation: (): void => {
          get().transition(
            testingFlowConfig.transitions.initialPrompt.DECLINE!,
          );
        },

        // setUiState: (partialState) =>
        //   set((state) => ({
        //     testerStorage: {
        //       ...state.testerStorage,
        //       uiState: {
        //         ...state.testerStorage.uiState,
        //         ...partialState,
        //       },
        //     },
        //   })),

        transition: (nextStage: StageKeys): void => {
          debug("useOverlayState", `Transitioning to ${nextStage}`);
          const stageConfig = testingFlowConfig.stages[nextStage] as StageType;
          const {
            getCurrentTestRun,
            setCurrentTestRunData,
            updateTesterStorage,
          } = get();
          const currentRun = getCurrentTestRun();
          // TODO setCurrentTestRunData and updateTesterStorage in one call
          setCurrentTestRunData({
            lastStage: currentRun.currentStage,
            currentStage: nextStage,
          });
          updateTesterStorage((testerStorage) => {
            return {
              ...testerStorage,
              uiState: {
                ...testerStorage.uiState,
                overlaySize: stageConfig.defaultSize,
              },
            };
          });
        },

        handleInitialSovendusCheck: (): void => {
          debug("useOverlayState", 'Initial prompt response: "accepted"');
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        hideOverlay: (): void => {
          set({ isPromptVisible: false });
        },

        handleConsentSelection: (withConsent): void => {
          debug(
            "useOverlayState",
            `Consent selection: ${withConsent ? "with consent" : "without consent"}`,
          );
          const { transition, setCurrentTestRunData } = get();
          setCurrentTestRunData({ withConsent });
          transition(testingFlowConfig.transitions.consentSelection.SELECT!);
        },

        handlePageSelection: (pageType): void => {
          debug("useOverlayState", `Page selection: ${pageType}`);
          const { transition, setCurrentTestRunData } = get();
          setCurrentTestRunData({ currentPageType: pageType });
          transition(
            pageType === PageType.LANDING
              ? testingFlowConfig.transitions.pageSelection.SELECT_LANDING!
              : testingFlowConfig.transitions.pageSelection.SELECT_SUCCESS!,
          );
        },

        handleTestCompletion: (result): void => {
          const { getCurrentTestRun, testerStorage } = get();
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

        handleNavigateToSuccessPage: (): void => {
          debug("useOverlayState", "Navigating to success page");
          get().setCurrentTestRunData({ currentPageType: PageType.SUCCESS });
          get().transition(
            testingFlowConfig.transitions.landingPageTest.NAVIGATE!,
          );
        },

        startNewTest: (): void => {
          debug("useOverlayState", "Starting new test");
          get().setCurrentTestRunData(createNewTestRun());
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        showTestHistory: (): void => {
          debug("useOverlayState", "Showing test history");
          get().transition(
            testingFlowConfig.transitions.testHistory.TO_TEST_HISTORY!,
          );
        },

        resizeOverlay: (direction: "increase" | "decrease"): void => {
          debug("useOverlayState", "resize Overlay", direction);
          const { testerStorage, getCurrentTestRun, updateTesterStorage } =
            get();
          const currentTestRun = getCurrentTestRun();
          const stageConfig = testingFlowConfig.stages[
            currentTestRun.currentStage
          ] as StageType;
          const availableSizes = stageConfig.availableSizes;
          const currentSizeIndex = availableSizes.indexOf(
            testerStorage.uiState.overlaySize,
          );
          const newSizeIndex =
            direction === "increase"
              ? currentSizeIndex + 1
              : currentSizeIndex - 1;
          if (newSizeIndex >= 0 && newSizeIndex < availableSizes.length) {
            updateTesterStorage(() => ({
              ...testerStorage,
              uiState: {
                ...testerStorage.uiState,
                overlaySize: availableSizes[newSizeIndex] as OverlaySize,
              },
            }));
          }
        },

        updateTesterStorage: (
          updateCallBack: (
            currentState: ExtensionStorage,
          ) => Partial<ExtensionStorage>,
        ): void => {
          const { _updateSettings } = get();
          set((state) => {
            const testerStorage = {
              ...state.testerStorage,
              ...updateCallBack(state.testerStorage),
            };
            debug("useOverlayState", "Updating state", testerStorage);
            void _updateSettings(testerStorage);
            return {
              ...state,
              testerStorage,
            };
          });
        },

        transitionBack: (): void => {
          debug("useOverlayState", "Exiting history view");
          const { getCurrentTestRun, transition } = get();
          const currentTestRun = getCurrentTestRun();
          if (!currentTestRun.lastStage) {
            // This should never happen
            error("useOverlayState", "No last stage found to go back to");
            return;
          }
          transition(currentTestRun.lastStage);
        },

        setIntegrationState: (setStateCallback): void => {
          set((state) => {
            const newState = setStateCallback(state.integrationState);
            debug("setIntegrationState", "Setting state", newState);
            return {
              integrationState: { ...state.integrationState, ...newState },
            };
          });
        },

        setPosition: (setPositionCallback): void => {
          debug("useOverlayState", "Setting position");
          const { updateTesterStorage } = get();
          updateTesterStorage((testerStorage) => {
            const newPosition = setPositionCallback(
              testerStorage.uiState.position,
            );
            return {
              ...testerStorage,
              uiState: {
                ...testerStorage.uiState,
                position: newPosition,
              },
            };
          });
        },

        saveSettings: async (): Promise<void> => {
          debug("useOverlayState", "Saving settings");
          const { testerStorage, _updateSettings } = get();
          await _updateSettings(testerStorage);
        },
      } satisfies OverlayState;
    });
  }, []);
};

function createNewTestRun(): TestRun {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    withConsent: undefined,
    landingPageResult: {
      status: "not-run",
      details: "",
      integrationTester: undefined,
    },
    successPageResult: {
      status: "not-run",
      details: "",
      integrationTester: undefined,
    },
    currentStage: "initialPrompt",
    completed: false,
    lastStage: undefined,
    currentPageType: PageType.LANDING,
  };
}

export interface OverlayDimensions {
  width: number;
  height: number;
}

declare let window: SovSelfTesterWindow;
