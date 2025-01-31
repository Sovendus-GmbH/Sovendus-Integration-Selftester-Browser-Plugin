import { useMemo } from "react";
import type { StoreApi, UseBoundStore } from "zustand";
import { create } from "zustand";

import type { ExtensionStorage } from "../../browser-extension-specific/types";
import type { IntegrationDetectorData } from "../../integration-detector/integrationDetector";
import { defaultIntegrationState } from "../../integration-detector/integrationDetector";
import { isBlacklistedPage } from "../../integration-detector/integrationDetector";
import { debug } from "../../logger/logger";
import type { StageName } from "../testing-flow-config";
import { testingFlowConfig } from "../testing-flow-config";
import type { UiState } from "../types";
import { OverlaySize, PageType, TestingState } from "../types";

export interface TestRun {
  id: string;
  timestamp: number;
  withConsent: boolean;
  landingPageResult: TestResult;
  successPageResult: TestResult;
  completed: boolean;
}

export interface TestResult {
  status: "success" | "error" | "not-run";
  details: string;
}

export interface OverlayState {
  uiState: UiState;
  currentStage: StageName;
  currentPageType: PageType;
  testingCompleted: { landing: boolean; success: boolean };
  testHistory: TestRun[];
  currentTestRun: TestRun | null;
  landingPageResult: TestResult | null;
  successPageResult: TestResult | null;
  integrationState: IntegrationDetectorData;
  testerStorage: ExtensionStorage;
  _getSettings: () => Promise<ExtensionStorage>;
  _updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>;
  setUiState: (state: Partial<UiState>) => void;
  transition: (action: string) => void;
  handleInitialSovendusCheck: () => void;
  handleConsentSelection: (withConsent: boolean) => void;
  handlePageSelection: (pageType: PageType) => void;
  handleTestCompletion: (result: TestResult) => void;
  handleNavigateToSuccessPage: () => void;
  startNewTest: () => void;
  showTestHistory: () => void;
  exitHistoryView: () => void;
  addToBlacklist: () => Promise<void>;
  resizeOverlay: (direction: "increase" | "decrease") => void;
  closeOverlay: () => void;
  openBlacklistConfirmation: () => void;
}

export const useOverlayState = (
  settings: ExtensionStorage,
  getSettings: () => Promise<ExtensionStorage>,
  updateSettings: (newSettings: Partial<ExtensionStorage>) => Promise<boolean>,
): ReturnType<typeof useMemo<UseBoundStore<StoreApi<OverlayState>>>> => {
  return useMemo(() => {
    return create<OverlayState>((set, get) => {
      const isBlackListedPage: boolean = isBlacklistedPage(settings.blacklist);
      return {
        uiState: {
          overlaySize: OverlaySize.SMALL,
          integrationType: undefined,
          testingState: TestingState.NOT_STARTED,
          isPromptVisible: !isBlackListedPage,
        },
        currentStage: "initialPrompt",
        currentPageType: PageType.LANDING,
        testingCompleted: { landing: false, success: false },
        testHistory: [],
        currentTestRun: null,
        landingPageResult: null,
        successPageResult: null,
        _getSettings: getSettings,
        _updateSettings: updateSettings,
        testerStorage: settings,
        integrationState: {
          shouldCheck: true,
          selfTester: undefined,
          integrationState: defaultIntegrationState,
          isBlackListedPage: isBlackListedPage,
        },

        addToBlacklist: async () => {
          debug(
            "useOverlayState",
            `Adding ${window.location.host} to blacklist`,
          );
          const { _updateSettings, testerStorage: settings } = get();
          await _updateSettings({
            ...settings,
            blacklist: [...settings.blacklist, window.location.host],
          });
          set((state) => ({
            integrationState: {
              ...state.integrationState,
              isBlackListedPage: true,
            },
          }));
        },

        openBlacklistConfirmation: () => {
          get().transition("CONFIRM_BLACKLIST");
        },

        setUiState: (partialState) =>
          set((state) => ({
            uiState: { ...state.uiState, ...partialState },
          })),

        transition: (action) => {
          const { currentStage } = get();
          const nextStage =
            testingFlowConfig.flow.transitions[currentStage]?.[action];
          if (nextStage) {
            debug(
              "useOverlayState",
              `Transitioning from ${currentStage} to ${nextStage}`,
            );
            const stageConfig =
              testingFlowConfig.stages[nextStage as StageName];
            set({ currentStage: nextStage as StageName });
            get().setUiState({ overlaySize: stageConfig.defaultSize });
          } else {
            debug(
              "useOverlayState",
              `No transition found for action ${action} in stage ${currentStage}`,
            );
          }
        },

        handleInitialSovendusCheck: () => {
          debug("useOverlayState", 'Initial prompt response: "accepted"');
          set({ currentStage: "consentSelection" });
          get().setUiState({
            overlaySize: testingFlowConfig.stages.consentSelection.defaultSize,
          });
        },

        closeOverlay: () => {
          console.log("sdhjfkjdfjdksfhhjk");
          get().setUiState({ isPromptVisible: false });
        },

        handleConsentSelection: (withConsent) => {
          debug(
            "useOverlayState",
            `Consent selection: ${withConsent ? "with consent" : "without consent"}`,
          );
          const newTestRun: TestRun = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            withConsent,
            landingPageResult: { status: "not-run", details: "" },
            successPageResult: { status: "not-run", details: "" },
            completed: false,
          };
          set({ currentTestRun: newTestRun });
          get().transition("SELECT");
        },

        handlePageSelection: (pageType) => {
          debug("useOverlayState", `Page selection: ${pageType}`);
          set({ currentPageType: pageType });
          get().transition(
            pageType === PageType.LANDING ? "SELECT_LANDING" : "SELECT_SUCCESS",
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
          set({ currentPageType: PageType.SUCCESS });
          get().transition("NAVIGATE");
        },

        startNewTest: () => {
          debug("useOverlayState", "Starting new test");
          set({
            testingCompleted: { landing: false, success: false },
            landingPageResult: null,
            successPageResult: null,
            currentPageType: PageType.LANDING,
            currentTestRun: null,
            currentStage: "consentSelection",
          });
          get().setUiState({
            overlaySize: testingFlowConfig.stages.consentSelection.defaultSize,
            testingState: TestingState.NOT_STARTED,
          });
        },

        showTestHistory: () => {
          debug("useOverlayState", "Showing test history");
          const { uiState } = get();
          set({
            uiState: {
              ...uiState,
              overlaySize: testingFlowConfig.stages.testHistory.defaultSize,
              testingState: TestingState.COMPLETED,
            },
            currentStage: "testHistory",
          });
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

        exitHistoryView: () => {
          debug("useOverlayState", "Exiting history view");
          const { uiState } = get();
          set({
            uiState: {
              ...uiState,
              overlaySize: OverlaySize.SMALL,
              testingState: TestingState.NOT_STARTED,
            },
            currentStage: "initialPrompt",
          });
        },
      } as OverlayState;
    });
  }, []);
};
