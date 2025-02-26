import {
  Camera,
  DollarSign,
  Globe,
  Link,
  Search,
  ShoppingCart,
  Ticket,
} from "lucide-react";

import { ConfirmBlacklist } from "./testing-stages/confirm-blacklist";
import { ConsentSelection } from "./testing-stages/consent-selection";
import { FeatureSelection } from "./testing-stages/feature-selection";
import { InitialPrompt } from "./testing-stages/initial-prompt";
import { LandingPageTestContent } from "./testing-stages/landing-page-test/test-content";
import { ProductSelection } from "./testing-stages/product-selection";
import { TestHistory } from "./testing-stages/test-history";
import { ThankyouTestContent } from "./testing-stages/thankyou-page-test-content/test-content";
import type { StageKeys, StageType, Transition } from "./testing-storage";
import { OverlaySize, PageType, sovendusProductKeys } from "./testing-storage";

type TestingFlowConfig = {
  readonly stages: {
    readonly [stageKey in StageKeys]: StageType;
  };
  readonly initialStage: StageKeys;
};

export const testingFlowConfig = {
  stages: {
    initialPrompt: {
      component: InitialPrompt,
      availableSizes: [OverlaySize.SMALL],
      defaultSize: OverlaySize.SMALL,
      transitions: {
        CHECK: {
          target: "featureSelection",
        } as Transition,
        DECLINE: {
          target: "blacklistConfirmation",
        } as Transition,
      },
    },
    blacklistConfirmation: {
      component: ConfirmBlacklist,
      availableSizes: [OverlaySize.MEDIUM],
      defaultSize: OverlaySize.MEDIUM,
      transitions: {
        BLACKLIST: {
          target: "initialPrompt",
          action: ({ get }) => {
            const { addToBlacklist } = get();
            addToBlacklist();
          },
        } as Transition,
        HIDE: {
          target: "featureSelection",
          action: ({ set }) => {
            set({ isPromptVisible: false });
          },
        } as Transition,
      },
    },
    featureSelection: {
      component: FeatureSelection,
      availableSizes: [OverlaySize.MEDIUM],
      defaultSize: OverlaySize.MEDIUM,
      transitions: {
        TEST_INTEGRATION: {
          target: "consentSelection",
        } as Transition,
        BACK: {
          target: "initialPrompt",
        } as Transition,
      },
    },
    consentSelection: {
      component: ConsentSelection,
      availableSizes: [OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        WITH_CONSENT: {
          target: "productSelection",
          action: ({ get }) => {
            const { setCurrentTestRunData } = get();
            setCurrentTestRunData(() => ({
              withConsent: true,
            }));
          },
        } as Transition,
        WITHOUT_CONSENT: {
          target: "productSelection",
          action: ({ get }) => {
            const { setCurrentTestRunData } = get();
            setCurrentTestRunData(() => ({
              withConsent: false,
            }));
          },
        } as Transition,
        BACK: {
          target: "featureSelection",
        } as Transition,
      },
    },
    productSelection: {
      component: ProductSelection,
      availableSizes: [OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        CONTINUE: {
          target: "landingPageTestScreenshot",
        } as Transition,
        BACK: {
          target: "consentSelection",
        } as Transition,
      },
    },

    landingPageTestScreenshot: {
      title: "Take Screenshot",
      instruction: "Capture a screenshot of the current landing page.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestVoucherCode",
          action: async ({ get }) => {
            const { takeScreenshot } = get();
            await takeScreenshot(PageType.LANDING);
          },
        } as Transition,
        BACK: {
          target: "productSelection",
        } as Transition,
      },
      applicableProducts: [
        sovendusProductKeys.CHECKOUT_BENEFITS,
        sovendusProductKeys.VOUCHER_NETWORK,
        sovendusProductKeys.CHECKOUT_PRODUCTS,
        sovendusProductKeys.OPTIMIZE,
      ],
      icon: Camera,
    },
    landingPageTestVoucherCode: {
      title: "Enter Voucher Code",
      instruction: "Enter any voucher code in the test order form.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestOrderValue",
          action: () => {},
        } as Transition,
        BACK: {
          target: "landingPageTestScreenshot",
          action: () => {},
        } as Transition,
      },
      applicableProducts: [
        sovendusProductKeys.VOUCHER_NETWORK,
        sovendusProductKeys.OPTIMIZE,
      ],
      icon: Ticket,
    },
    landingPageTestOrderValue: {
      title: "Enter Order Value",
      instruction:
        "Enter the net order value or total amount with shipping and tax.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestCurrency",
          action: () => {},
        } as Transition,
        BACK: {
          target: "landingPageTestVoucherCode",
          action: () => {},
        } as Transition,
      },
      applicableProducts: [
        sovendusProductKeys.VOUCHER_NETWORK,
        sovendusProductKeys.OPTIMIZE,
      ],
      icon: DollarSign,
    },
    landingPageTestCurrency: {
      title: "Select Currency",
      instruction: "Select the currency for the current test order.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestDummyParams",
          action: () => {},
        } as Transition,
        BACK: {
          target: "landingPageTestOrderValue",
          action: () => {},
        } as Transition,
      },
      applicableProducts: [
        sovendusProductKeys.VOUCHER_NETWORK,
        sovendusProductKeys.OPTIMIZE,
      ],
      icon: Globe,
    },
    landingPageTestDummyParams: {
      title: "Add Dummy Parameters",
      instruction: "Add dummy URL parameters to the landing page.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestOptimizeCheck",
          action: () => {
            window.location.search +=
              "&sovReqProductId=test-product-id&sovReqToken=test-token";
          },
        } as Transition,
        BACK: {
          target: "landingPageTestCurrency",
          action: () => {},
        } as Transition,
      },

      applicableProducts: [sovendusProductKeys.CHECKOUT_PRODUCTS],
      icon: Link,
    },
    landingPageTestOptimizeCheck: {
      title: "Check Optimize Script",
      instruction: "Checking if the Optimize landing script is found.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "landingPageTestTestPurchase",
          action: () => {},
        } as Transition,
        BACK: {
          target: "landingPageTestDummyParams",
          action: () => {},
        } as Transition,
      },
      applicableProducts: [sovendusProductKeys.OPTIMIZE],
      icon: Search,
    },
    landingPageTestTestPurchase: {
      title: "Test Purchase",
      instruction:
        "Complete a test purchase to finalize the landing page test.",
      component: LandingPageTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "successPageTest",
          action: ({ get }) => {
            get().setCurrentTestRunData(() => ({
              currentPageType: PageType.SUCCESS,
            }));
          },
        } as Transition,
        BACK: {
          target: "landingPageTestOptimizeCheck",
          action: () => {},
        } as Transition,
      },
      applicableProducts: [
        sovendusProductKeys.VOUCHER_NETWORK,
        sovendusProductKeys.CHECKOUT_BENEFITS,
        sovendusProductKeys.CHECKOUT_PRODUCTS,
        sovendusProductKeys.OPTIMIZE,
      ],
      icon: ShoppingCart,
    },

    successPageTest: {
      component: ThankyouTestContent,
      availableSizes: [
        OverlaySize.SMALL,
        OverlaySize.MEDIUM,
        OverlaySize.LARGE,
      ],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        COMPLETE: {
          target: "testHistory",
          action: () => {},
        } as Transition,
        BACK: {
          target: "landingPageTestTestPurchase",
        } as Transition,
      },
    },
    testHistory: {
      component: TestHistory,
      availableSizes: [OverlaySize.LARGE],
      defaultSize: OverlaySize.LARGE,
      transitions: {
        RESTART: {
          target: "initialPrompt",
          action: () => {},
        } as Transition,
        TO_TEST_HISTORY: {
          target: "testHistory",
          action: () => {},
        } as Transition,
      },
    },
  },
  initialStage: "initialPrompt",
} as const satisfies TestingFlowConfig;

export type TestingFlowConfigType = typeof testingFlowConfig;
