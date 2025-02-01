import { ConfirmBlacklist } from "./components/testing-stages/confirm-blacklist";
import { ConsentSelectionStep } from "./components/testing-stages/consent-selection";
import { InitialPrompt } from "./components/testing-stages/initial-prompt";
import { PageSelection } from "./components/testing-stages/page-selection";
import { TestContent } from "./components/testing-stages/test-content";
import { TestHistory } from "./components/testing-stages/test-history";
import type { TestingFlowConfigType } from "./testing-storage";
import { OverlaySize } from "./testing-storage";

export const testingFlowConfig: TestingFlowConfigType = {
  stages: {
    initialPrompt: {
      component: InitialPrompt,
      availableSizes: [OverlaySize.SMALL, OverlaySize.MEDIUM],
      defaultSize: OverlaySize.SMALL,
    },
    confirmBlacklist: {
      component: ConfirmBlacklist,
      availableSizes: [OverlaySize.MEDIUM],
      defaultSize: OverlaySize.MEDIUM,
    },
    consentSelection: {
      component: ConsentSelectionStep,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
    pageSelection: {
      component: PageSelection,
      availableSizes: [
        // OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.MEDIUM,
    },
    landingPageTest: {
      component: TestContent,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
    successPageTest: {
      component: TestContent,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
    testHistory: {
      component: TestHistory,
      availableSizes: [OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
  },
  initialStage: "initialPrompt",
  transitions: {
    initialPrompt: {
      ACCEPT: "consentSelection",
      DECLINE: "confirmBlacklist",
    },
    confirmBlacklist: {
      BLACKLIST: "confirmBlacklist",
      HIDE_OVERLAY: "declineBlacklist",
    },
    consentSelection: {
      SELECT: "pageSelection",
    },
    pageSelection: {
      SELECT_LANDING: "landingPageTest",
      SELECT_SUCCESS: "successPageTest",
    },
    landingPageTest: {
      COMPLETE: "landingPageTest",
      NAVIGATE: "successPageTest",
    },
    successPageTest: {
      COMPLETE: "successPageTest",
      RESTART: "consentSelection",
    },
    testHistory: {
      TO_TEST_HISTORY: "testHistory",
      RESTART: "consentSelection",
    },
    declineBlacklist: {},
  },
};
