import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppConsumerAllValidData,
  sovAppIFramesAllValidData,
  sovTestTrafficMediumNumbers,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "overlayAndStickyDetection",
  tests: [
    ...generateTests({
      elementKey: "isOverlayOrStickyBanner",
      testsInfo: [
        {
          testName: "VNSticky",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
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
          testName: "CBOverlay",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
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
          testName: "CBVNOverlay",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
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
          testName: "CBInlineVNSticky",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.CBInlineVNSticky
                  .trafficMediumNumber,
            },
          },
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "CBOverlayVNInline",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.CBOverlayVNInline
                  .trafficMediumNumber,
            },
          },
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "CBOverlayVNSticky",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.CBOverlayVNSticky
                  .trafficMediumNumber,
            },
          },
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "CBInOverlayCollapsed",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
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
            sovConsumer: sovAppConsumerAllValidData,
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
        {
          testName: "VNStickyCloseable",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.VNStickyCloseable
                  .trafficMediumNumber,
            },
          },
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },

        {
          testName: "VNInline",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.VNInline.trafficMediumNumber,
            },
          },
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "CBVNInline",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.CBVNInline.trafficMediumNumber,
            },
          },
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "CBInline",
          sovAppData: {
            sovConsumer: sovAppConsumerAllValidData,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
              trafficMediumNumber:
                sovTestTrafficMediumNumbers.CBInline.trafficMediumNumber,
            },
          },
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
