import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

// Immer undefined und StatusCodes.TestDidNotRun

// Was bedeuetet "isFlexibleIframeExecutable"

executeOverlayTests({
  testName: "isFlexibleIframeExecutable",
  tests: [
    ...generateTests({
      elementKey: "isFlexibleIframeExecutable",
      testsInfo: [
        {
          testName: "FlexibleIFrameIsExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "FlexibleIFrameNotExecutable",
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