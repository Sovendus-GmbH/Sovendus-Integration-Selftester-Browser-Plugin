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
  StageKeys,
  StageType,
  TestResult,
  TestRun,
} from "../testing-storage";
import { OverlaySize } from "../testing-storage";
import { PageType } from "../testing-storage";

export interface OverlayState {
  currentHost: string;
  shouldCheck: boolean;
  testerStorage: ExtensionStorage;
  isPromptVisible: boolean;
  isInitialized: boolean;
  _getSettings: () => Promise<ExtensionStorage>;
  _updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
  setPosition: (
    positionCallBack: (position: { x: number; y: number }) => {
      x: number;
      y: number;
    },
  ) => void;
  transition: (nextStage: StageKeys) => void;
  getTestRunHistory: () => TestRun[];
  getCurrentTestRun: () => TestRun;
  setCurrentTestRunData: (
    setCallBack: (testRunData: TestRun) => Partial<TestRun>,
  ) => void;
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
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>,
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

        openBlacklistConfirmation: (): void => {
          get().transition(
            testingFlowConfig.transitions.initialPrompt.DECLINE!,
          );
        },

        transition: (nextStage: StageKeys): void => {
          debugUi("useOverlayState", `Transitioning to ${nextStage}`);
          const stageConfig = testingFlowConfig.stages[nextStage] as StageType;
          const { setCurrentTestRunData } = get();
          setCurrentTestRunData((currentRun) => ({
            lastStage: currentRun.currentStage,
            currentStage: nextStage,
            overlaySize: stageConfig.defaultSize,
          }));
        },

        handleInitialSovendusCheck: (): void => {
          debugUi("useOverlayState", 'Initial prompt response: "accepted"');
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        hideOverlay: (): void => {
          set({ isPromptVisible: false });
        },

        handleConsentSelection: (withConsent): void => {
          debugUi(
            "useOverlayState",
            `Consent selection: ${withConsent ? "with consent" : "without consent"}`,
          );
          const { transition, setCurrentTestRunData } = get();
          setCurrentTestRunData(() => ({
            withConsent,
          }));
          transition(testingFlowConfig.transitions.consentSelection.SELECT!);
        },

        handlePageSelection: (pageType): void => {
          debugUi("useOverlayState", `Page selection: ${pageType}`);
          const { transition, setCurrentTestRunData } = get();
          setCurrentTestRunData(() => ({
            currentPageType: pageType,
          }));
          transition(
            pageType === PageType.LANDING
              ? testingFlowConfig.transitions.pageSelection.SELECT_LANDING!
              : testingFlowConfig.transitions.pageSelection.SELECT_SUCCESS!,
          );
        },

        handleTestCompletion: (result): void => {
          const { getCurrentTestRun, testerStorage } = get();
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
          debugUi("useOverlayState", "Navigating to success page");
          get().setCurrentTestRunData(() => ({
            currentPageType: PageType.SUCCESS,
          }));
          get().transition(
            testingFlowConfig.transitions.landingPageTest.NAVIGATE!,
          );
        },

        startNewTest: (): void => {
          debugUi("useOverlayState", "Starting new test");
          get().setCurrentTestRunData(() => createNewTestRun());
          get().transition(testingFlowConfig.transitions.initialPrompt.ACCEPT!);
        },

        showTestHistory: (): void => {
          debugUi("useOverlayState", "Showing test history");
          get().transition(
            testingFlowConfig.transitions.testHistory.TO_TEST_HISTORY!,
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
          if (!currentTestRun.lastStage) {
            // This should never happen
            error("useOverlayState", "No last stage found to go back to");
            return;
          }
          transition(currentTestRun.lastStage);
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
