import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
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
          testName: "multipleIFramesAreSame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "NoMultipleIFramesAreSame",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          disableFlexibleIframeJs: true,
        },
      ],
    }),
  ],
});
