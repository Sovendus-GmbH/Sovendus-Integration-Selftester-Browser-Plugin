import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "awinIntegrationDetectedTestResult",
  isAwinTest: true,
  tests: [
    ...generateTests({
      elementKey: "awinIntegrationDetectedTestResult",
      testsInfo: [
        {
          testName: "awinIntegrationDetected",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "NoAwinIntegrationDetected",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
          disableAwinMasterTag: true,
        },
      ],
    }),
  ],
});
