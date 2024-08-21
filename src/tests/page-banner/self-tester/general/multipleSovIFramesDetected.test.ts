import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "multipleSovIFramesDetected",
  tests: [
    ...generateTests({
      elementKey: "multipleSovIFramesDetected",
      testsInfo: [
        {
          testName: "multipleSovIFramesDetectedOneIFrame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "multipleSovIFramesDetectedNoIFrames",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
          },
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
          removeSovIFrame: true,
        },
        {
          testName: "multipleSovIFramesDetectedTwoIFrames",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
            sovIframes1: {
              ...sovAppIFramesAllValidData,
            },
            sovIframes2: {
              ...sovAppIFramesAllValidData,
            },
          },
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
        },
        {
          testName: "multipleSovIFramesDetectedThreeIFrames",
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
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
