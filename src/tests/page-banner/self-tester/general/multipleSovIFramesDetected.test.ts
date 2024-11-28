import { StatusCodes } from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
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
          testName: "multipleSovIFramesDetectedNoIFrames",
          sovAppData: sovAppDataEverythingIsOkay,
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
          testName: "multipleSovIFramesDetectedOneIFrame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
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
