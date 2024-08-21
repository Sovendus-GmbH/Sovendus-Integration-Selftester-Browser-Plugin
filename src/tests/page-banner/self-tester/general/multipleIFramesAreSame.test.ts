import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
  sovAppIFramesAllValidDataDifferent,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

// Wird nie gesetzt, ist immer undefined und StatusCodes.TestDidNotRun

executeOverlayTests({
  testName: "multipleIFramesAreSame",
  tests: [
    ...generateTests({
      elementKey: "multipleIFramesAreSame",
      testsInfo: [
        {
          testName: "multipleIFramesAreSameOneIFrame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
        },
        {
          testName: "multipleIFramesAreSameNoIFrames",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
          },
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              removeSovIFrame: true,
            },
          },
        },
        {
          testName: "multipleIFramesAreSameTwoIFramesSame",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes2: {
              ...sovAppIFramesAllValidData,
            },
          },
          expectedElementValue: 2,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.multipleSovIframesDetectedAndAreSame,
        },
        {
          testName: "multipleIFramesAreSameThreeIFramesSame",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes2: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes3: {
              ...sovAppIFramesAllValidData,
            },
          },
          expectedElementValue: 3,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.multipleSovIframesDetectedAndAreSame,
        },
        {
          testName: "multipleIFramesAreSameTwoIFramesDifferent",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes2: {
              ...sovAppIFramesAllValidDataDifferent,
            },
          },
          expectedElementValue: 2,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.multipleSovIframesDetected,
        },
        {
          testName: "multipleIFramesAreSameThreeIFramesDifferent",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes2: {
              ...sovAppIFramesAllValidDataDifferent,
            },
            sovIframes3: {
              ...sovAppIFramesAllValidData,
            },
          },
          expectedElementValue: 3,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.multipleSovIframesDetected,
        },
      ],
    }),
  ],
});
