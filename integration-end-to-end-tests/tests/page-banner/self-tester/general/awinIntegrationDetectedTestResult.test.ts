import { StatusCodes } from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
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
      ],
    }),
  ],
});

executeOverlayTests({
  testName: "awinIntegrationDetectedTestResult",
  tests: [
    ...generateTests({
      elementKey: "awinIntegrationDetectedTestResult",
      testsInfo: [
        {
          testName: "noAwinIntegrated",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
      ],
    }),
  ],
});
