import { StatusCodes } from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "sovIFramesAmount",
  tests: [
    ...generateTests({
      elementKey: "sovIFramesAmount",
      testsInfo: [
        {
          testName: "oneIFrame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: 1,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "noIFrame",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
          },
          expectedElementValue: 0,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              removeSovIFrame: true,
            },
          },
        },
        {
          testName: "twoIFrames",
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
          expectedStatusMessageKey: null,
        },
        {
          testName: "threeIFrames",
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
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
