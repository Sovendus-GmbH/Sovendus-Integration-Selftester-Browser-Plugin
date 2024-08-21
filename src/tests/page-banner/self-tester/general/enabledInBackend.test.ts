import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppIFramesAllValidData,
  sovTestTrafficMediumNumbers,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "isEnabledInBackend",
  tests: generateTests({
    elementKey: "isEnabledInBackend",
    testsInfo: [
      {
        testName: "TestDidNotRun",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.VNInline.trafficMediumNumber,
          },
        },
        expectedElementValue: null,
        expectedStatusCode: StatusCodes.TestDidNotRun,
        expectedStatusMessageKey: null,
        testOptions: {
          regular: {
            disableFlexibleIFrameJs: true,
          },
        },
      },
      {
        testName: "BannerDoesNotExist",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber: 123,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "VNInlineDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.VNInlineDisabled.trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "VNInlineEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.VNInline.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "VNStickyDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.VNStickyDisabled.trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "VNStickyEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.VNSticky.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBOverlayDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlayDisabled.trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBOverlayEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlay.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBVNOverlayDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBVNOverlayDisabled
                .trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBVNOverlayEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBVNOverlay.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBVNInlineDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBVNInlineDisabled
                .trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBVNInlineEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBVNInline.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBInlineDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInlineDisabled.trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBInlineEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInline.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBInlineVNStickyDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInlineVNStickyDisabled
                .trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBInlineVNStickyEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInlineVNSticky.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBOverlayVNInlineDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlayVNInlineDisabled
                .trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBOverlayVNInlineEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlayVNInline.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBOverlayVNStickyDisabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlayVNStickyDisabled
                .trafficMediumNumber,
          },
        },
        expectedElementValue: false,
        expectedStatusCode: StatusCodes.Error,
        expectedStatusMessageKey: StatusMessageKeyTypes.sovendusBannerDisabled,
      },
      {
        testName: "CBOverlayVNStickyEnabled",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBOverlayVNSticky.trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBInOverlayCollapsed",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInOverlayCollapsed
                .trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },

      {
        testName: "CBInOverlayCloseable",
        sovAppData: {
          sovIframes1: {
            ...sovAppIFramesAllValidData,
            trafficMediumNumber:
              sovTestTrafficMediumNumbers.CBInOverlayCloseable
                .trafficMediumNumber,
          },
        },
        expectedElementValue: true,
        expectedStatusCode: StatusCodes.Success,
        expectedStatusMessageKey: null,
      },
    ],
  }),
});
