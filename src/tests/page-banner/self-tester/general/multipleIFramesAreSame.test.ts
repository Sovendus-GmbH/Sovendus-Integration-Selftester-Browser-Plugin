import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
  sovAppIFramesAllValidDataDifferent,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

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
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "multipleIFramesAreSameNoIFrames",
          sovAppData: {
            ...sovAppDataEverythingIsOkay,
          },
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
          removeSovIFrame: true,
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
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
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
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
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
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
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
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
