import { useMemo } from "react";
import { create } from "zustand";

import type { ExtensionSettings } from "../../browser-extension-specific/types";
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
  setUiState: (state: Partial<UiState>) => void;
  transition: (action: string) => void;
  handleInitialPromptResponse: (accepted: boolean) => void;
  handleConsentSelection: (withConsent: boolean) => void;
  handlePageSelection: (pageType: PageType) => void;
  handleTestCompletion: (result: TestResult) => void;
  handleNavigateToSuccessPage: () => void;
  startNewTest: () => void;
  showTestHistory: () => void;
  exitHistoryView: () => void;
  setBlacklist: (blacklist: string[] | undefined) => void;
  addToBlacklist: (domain: string) => void;
  resizeOverlay: (direction: "increase" | "decrease") => void;
  closeOverlay: () => void;
}

export const useOverlayState = (
  getSettings: () => Promise<ExtensionSettings>,
  updateSettings: (newSettings: Partial<ExtensionSettings>) => Promise<boolean>,
) => {
  return useMemo(() => {
    return create<OverlayState>((set, get) => ({
      uiState: {
        overlaySize: OverlaySize.SMALL,
        integrationType: undefined,
        testingState: TestingState.NOT_STARTED,
        isPromptVisible: true,
      },
      currentStage: "initialPrompt",
      currentPageType: PageType.LANDING,
      testingCompleted: { landing: false, success: false },
      testHistory: [],
      currentTestRun: null,
      landingPageResult: null,
      successPageResult: null,
      integrationState: {
        shouldCheck: true,
        selfTester: undefined,
        integrationState: defaultIntegrationState,
        isBlackListedPage: false,
      },

      setBlacklist: (blacklist: string[] | undefined) => {
        if (blacklist) {
          set((state) => ({
            ...state,
            integrationState: {
              ...state.integrationState,
              isBlackListedPage: isBlacklistedPage(blacklist),
            },
          }));
        }
      },

      setUiState: (partialState) =>
        set((state) => ({ uiState: { ...state.uiState, ...partialState } })),

      transition: (action) => {
        const { currentStage } = get();
        const nextStage =
          testingFlowConfig.flow.transitions[currentStage]?.[action];
        if (nextStage) {
          debug(
            "useOverlayState",
            `Transitioning from ${currentStage} to ${nextStage}`,
          );
          const stageConfig = testingFlowConfig.stages[nextStage as StageName];
          set({ currentStage: nextStage as StageName });
          get().setUiState({ overlaySize: stageConfig.defaultSize });
        } else {
          debug(
            "useOverlayState",
            `No transition found for action ${action} in stage ${currentStage}`,
          );
        }
      },

      handleInitialPromptResponse: (accepted) => {
        debug(
          "useOverlayState",
          `Initial prompt response: ${accepted ? "accepted" : "declined"}`,
        );
        if (accepted) {
          set({ currentStage: "consentSelection" });
          get().setUiState({
            overlaySize: testingFlowConfig.stages.consentSelection.defaultSize,
          });
        } else {
          get().setUiState({ isPromptVisible: false });
        }
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
        debug("useOverlayState", `Test completion: ${currentPageType}`, result);
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

      closeOverlay: () => {
        console.log("sdhjfkjdfjdksfhhjk");
        get().setUiState({ isPromptVisible: false });
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

      addToBlacklist: (domain) => {
        debug("useOverlayState", `Adding ${domain} to blacklist`);
        set((state) => ({
          integrationState: {
            ...state.integrationState,
            isBlackListedPage: true,
          },
        }));
      },
    }));
  }, []);
};
