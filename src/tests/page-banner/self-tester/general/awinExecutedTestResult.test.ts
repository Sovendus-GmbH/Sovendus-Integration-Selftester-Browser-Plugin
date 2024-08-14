import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "awinExecutedTestResult",
  isAwinTest: true,
  tests: [
    ...generateTests({
      elementKey: "awinExecutedTestResult",
      testsInfo: [
        {
          testName: "awinExecuted",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },

        // NoAwinExecuted is not required, because Sovendus is not integrated
      ],
    }),
  ],
});
