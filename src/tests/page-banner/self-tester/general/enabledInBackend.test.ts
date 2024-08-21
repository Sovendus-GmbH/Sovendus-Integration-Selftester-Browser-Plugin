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
  testName: "enabledInBackend",
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
        disableFlexibleIframeJs: true,
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
    ],
  }),
});
