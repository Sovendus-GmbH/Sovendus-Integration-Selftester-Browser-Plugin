import { TestContent } from "./components/test-content";
import { ConsentSelectionStep } from "./components/testing-stages/consent-selection";
import { InitialPrompt } from "./components/testing-stages/initial-prompt";
import { PageSelection } from "./components/testing-stages/page-selection";
import { TestHistory } from "./components/testing-stages/test-history";
import { OverlaySize } from "./types";

export const testingFlowConfig = {
  stages: {
    initialPrompt: {
      component: InitialPrompt,
      availableSizes: [OverlaySize.SMALL, OverlaySize.MEDIUM],
      defaultSize: OverlaySize.SMALL,
    },
    consentSelection: {
      component: ConsentSelectionStep,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
    pageSelection: {
      component: PageSelection,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.MEDIUM,
    },
    landingPageTest: {
      component: TestContent,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.MEDIUM,
    },
    successPageTest: {
      component: TestContent,
      availableSizes: [OverlaySize.MEDIUM, OverlaySize.LARGE],
      defaultSize: OverlaySize.MEDIUM,
    },
    testHistory: {
      component: TestHistory,
      availableSizes: [OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
    },
  },
  flow: {
    initial: "initialPrompt",
    transitions: {
      initialPrompt: {
        ACCEPT: "consentSelection",
        DECLINE: "end",
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
    },
  },
};

export type StageName = keyof typeof testingFlowConfig.stages;
