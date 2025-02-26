import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
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
