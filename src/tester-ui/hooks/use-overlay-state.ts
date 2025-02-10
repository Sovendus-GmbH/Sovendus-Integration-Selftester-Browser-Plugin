import { useMemo } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

import { defaultIntegrationState } from "../../detector/integration-detector";
import { isBlacklistedPage, removeSubdomain } from "../../helper/config-helper";
import { error } from "../../logger/logger";
import { debugUi } from "../../logger/ui-logger";
import type { SovSelfTesterWindow } from "../../tester/integration-tester";
import { testingFlowConfig } from "../testing-flow-config";
import type {
  ExtensionStorage,
  StageType,
  TestResult,
  TestRun,
  Transition,
} from "../testing-storage";
import { OverlaySize, PageType } from "../testing-storage";

export interface OverlayState {
  currentHost: string;
  shouldCheck: boolean;
  testerStorage: ExtensionStorage;
  isPromptVisible: boolean;
  isInitialized: boolean;
  _getSettings: () => Promise<ExtensionStorage>;
  _updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>;
  setPosition: (
    positionCallBack: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    },
  ) => void;
  transition: (nextStage: Transition) => void;
  _transition: (nextStage: Transition) => Promise<void>;
  getTestRunHistory: () => TestRun[];
  getCurrentTestRun: () => TestRun;
  setCurrentTestRunData: (
    setCallBack: (testRunData: TestRun) => Partial<TestRun>,
  ) => void;
  handleTestCompletion: (result: TestResult) => void;
  handleNavigateToSuccessPage: () => void;
  startNewTest: () => void;
  showTestHistory: () => void;
  transitionBack: () => void;
  addToBlacklist: () => void;
  resizeOverlay: (direction: "increase" | "decrease") => void;
  updateTesterStorage: (
    updateCallBack: (
      currentState: ExtensionStorage,
    ) => Partial<ExtensionStorage>,
    shouldSave?: boolean,
  ) => void;
  saveSettings: () => Promise<void>;
  _getScreenshot: () => Promise<string>;
  takeScreenshot: (
    pageType: PageType.SUCCESS | PageType.LANDING,
  ) => Promise<boolean>;
}

export const useOverlayState = (
  testerStorage: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: ExtensionStorage) => Promise<boolean>,
  takeScreenshot: () => Promise<string>,
): ReturnType<typeof useMemo<UseBoundStore<StoreApi<OverlayState>>>> => {
  return useMemo(() => {
    return create<OverlayState>((set, get) => {
      const isBlackListedPage: boolean = isBlacklistedPage(
        testerStorage?.blacklist,
      );
      const currentHost: string = window.location.host
        ? removeSubdomain(window.location.host)
        : window.location.origin;
      const newTesterStorage: ExtensionStorage = {
        ...testerStorage,
        currentTestRuns: {
          ...testerStorage.currentTestRuns,
          [currentHost]:
            testerStorage.currentTestRuns?.[currentHost] || createNewTestRun(),
        },
      };
      return {
        isInitialized: false,
        isPromptVisible: !isBlackListedPage,
        shouldCheck: !isBlackListedPage,
        currentHost,
        _getSettings: getSettings,
        _updateSettings: updateSettings,
        _getScreenshot: takeScreenshot,
        testerStorage: newTesterStorage,

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

        setCurrentTestRunData: (setCallback): void => {
          const { updateTesterStorage, currentHost } = get();
          updateTesterStorage((testerStorage) => {
            const currentRun = testerStorage.currentTestRuns?.[
              currentHost
            ] as TestRun;
            return {
              ...testerStorage,
              currentTestRuns: {
                ...testerStorage.currentTestRuns,
                [currentHost]: {
                  ...currentRun,
                  ...setCallback(currentRun),
                },
              },
            };
          });
        },

        addToBlacklist: (): void => {
          if (window.location.host) {
            debugUi(
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
                shouldCheck: false,
              };
            });
          } else {
            // TODO handle file urls
          }
        },

        transition: (nextStage: Transition): void => {
          const { _transition } = get();
          void _transition(nextStage);
        },

        _transition: async (nextStage: Transition): Promise<void> => {
          debugUi("useOverlayState", `Transitioning to ${nextStage.target}`);
          const stageConfig = testingFlowConfig.stages[
            nextStage.target
          ] as StageType;
          if (!stageConfig) {
            error("useOverlayState", `Invalid stage: ${nextStage.target}`);
            return;
          }
          await nextStage.action?.({ set, get });
          const { setCurrentTestRunData } = get();
          setCurrentTestRunData((currentRun) => ({
            lastStage: currentRun.currentStage,
            currentStage: nextStage.target,
            overlaySize: stageConfig.defaultSize,
          }));
        },

        handleTestCompletion: (result): void => {
          const { getCurrentTestRun, testerStorage } = get();
          const currentTestRun = getCurrentTestRun();
          const { currentPageType } = currentTestRun;
          debugUi(
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
                  ...testerStorage.testHistory.filter(
                    (test) => test.id !== updatedRun.id,
                  ),
                  updatedRun,
                ],
                currentTestRun: null,
              });
            } else {
              set({ currentTestRun: updatedRun });
            }
          }
        },

        handleNavigateToSuccessPage: (): void => {
          debugUi("useOverlayState", "Navigating to success page");
          get().setCurrentTestRunData(() => ({
            currentPageType: PageType.SUCCESS,
          }));
          get().transition(
            testingFlowConfig.stages.landingPageTestTestPurchase.transitions.COMPLETE,
          );
        },

        startNewTest: (): void => {
          debugUi("useOverlayState", "Starting new test");
          get().setCurrentTestRunData(() => createNewTestRun());
          get().transition(
            testingFlowConfig.stages.initialPrompt.transitions.CHECK,
          );
        },

        showTestHistory: (): void => {
          debugUi("useOverlayState", "Showing test history");
          get().transition(
            testingFlowConfig.stages.testHistory.transitions.TO_TEST_HISTORY,
          );
        },

        resizeOverlay: (direction: "increase" | "decrease"): void => {
          debugUi("useOverlayState", "resize Overlay", direction);
          const { getCurrentTestRun, setCurrentTestRunData } = get();
          const currentTestRun = getCurrentTestRun();
          const stageConfig = testingFlowConfig.stages[
            currentTestRun.currentStage
          ] as StageType;
          const availableSizes = stageConfig.availableSizes;
          const currentSizeIndex = availableSizes.indexOf(
            currentTestRun.overlaySize,
          );
          const newSizeIndex =
            direction === "increase"
              ? currentSizeIndex + 1
              : currentSizeIndex - 1;
          if (newSizeIndex >= 0 && newSizeIndex < availableSizes.length) {
            setCurrentTestRunData(() => ({
              overlaySize: availableSizes[newSizeIndex] as OverlaySize,
            }));
          }
        },

        updateTesterStorage: (
          updateCallBack: (
            currentState: ExtensionStorage,
          ) => Partial<ExtensionStorage>,
          shouldSave?: boolean,
        ): void => {
          const { _updateSettings } = get();
          set((state) => {
            const testerStorage = {
              ...state.testerStorage,
              ...updateCallBack(state.testerStorage),
            };
            debugUi("useOverlayState", "Updating state", testerStorage);
            if (shouldSave) {
              void _updateSettings(testerStorage);
            }
            return {
              ...state,
              testerStorage,
            };
          });
        },

        transitionBack: (): void => {
          debugUi("useOverlayState", "Exiting history view");
          const { getCurrentTestRun, transition } = get();
          const currentTestRun = getCurrentTestRun();
          if (!currentTestRun.lastStage || !currentTestRun.lastTransition) {
            // This should never happen
            error("useOverlayState", "No last stage found to go back to");
            return;
          }
          const prevTransition = (
            testingFlowConfig.stages[currentTestRun.lastStage] as StageType
          ).transitions[currentTestRun.lastTransition] as Transition;
          transition(prevTransition);
        },

        setPosition: (setPositionCallback): void => {
          debugUi("useOverlayState", "Setting position");
          const { updateTesterStorage, isInitialized, testerStorage } = get();
          const newPosition = setPositionCallback(
            testerStorage.uiState.position,
          );
          if (newPosition !== testerStorage.uiState.position) {
            updateTesterStorage(
              () => {
                return {
                  ...testerStorage,
                  uiState: {
                    ...testerStorage.uiState,
                    position: newPosition,
                  },
                };
              },
              isInitialized ? true : false,
            );
          }
          if (!isInitialized) {
            set({ isInitialized: true });
          }
        },
        saveSettings: async (): Promise<void> => {
          debugUi("useOverlayState", "Saving settings");
          const { testerStorage, _updateSettings } = get();
          await _updateSettings(testerStorage);
        },
        takeScreenshot: async (
          pageType: PageType.SUCCESS | PageType.LANDING,
        ): Promise<boolean> => {
          debugUi("useOverlayState", "Taking screenshot");
          const { _getScreenshot } = get();
          const screenshotUri = await _getScreenshot();
          if (screenshotUri) {
            const { setCurrentTestRunData } = get();
            setCurrentTestRunData(() => ({
              [pageType === PageType.LANDING
                ? "landingPageResult"
                : "successPageResult"]: {
                screenshotUri,
              },
            }));
            debugUi("useOverlayState", "Screenshot taken", screenshotUri);
            return true;
          }
          error("useOverlayState", "Screenshot failed");
          return false;
        },
      } satisfies OverlayState;
    });
  }, []);
};

function createNewTestRun(): TestRun {
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    startTime: Date.now(),
    overlaySize: OverlaySize.SMALL,
    withConsent: undefined,
    landingPageResult: {
      integrationTester: undefined,
      integrationDetector: defaultIntegrationState,
      screenshotUri: undefined,
    },
    successPageResult: {
      integrationTester: undefined,
      integrationDetector: defaultIntegrationState,
      screenshotUri: undefined,
    },
    currentStage: "initialPrompt",
    lastTransition: undefined,
    completed: false,
    lastStage: undefined,
    currentPageType: PageType.LANDING,
    selectedProducts: [],
  } satisfies TestRun;
}

export interface OverlayDimensions {
  width: number;
  height: number;
}

declare let window: SovSelfTesterWindow;
