import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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

        // NoAwinIntegrationDetected is not required, because Sovendus is not integrated
      ],
    }),
  ],
});
