import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
        {
          testName: "awinSalesTrackingToLate",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey:
            StatusMessageKeyTypes.awinSaleTrackedAfterScript,
          testOptions: {
            awin: {
              addSaleTrackingDelay: true,
            },
          },
        },
      ],
    }),
  ],
});
