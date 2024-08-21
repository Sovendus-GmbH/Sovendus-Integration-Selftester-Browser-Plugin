import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppDataEverythingIsOkay,
  sovAppIFramesAllValidData,
} from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

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
          removeSovIFrame: true,
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
