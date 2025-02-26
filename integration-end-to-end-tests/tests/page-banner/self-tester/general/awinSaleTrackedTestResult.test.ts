import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "sovendus-integration-tester/src/tester/integration-tester-data-to-sync-with-dev-hub";

import { sovAppDataEverythingIsOkay } from "../../../testUtils/sovAppData";
import { generateTests } from "../../../testUtils/testCaseGenerator";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "awinSaleTrackedTestResult",
  isAwinTest: true,
  tests: [
    ...generateTests({
      elementKey: "awinSaleTrackedTestResult",
      testsInfo: [
        {
          testName: "awinSaleTracked",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "NoAwinSaleTracked",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: StatusMessageKeyTypes.awinNoSalesTracked,
          testOptions: {
            awin: {
              disableAwinSalesTracking: true,
            },
          },
        },
      ],
    }),
  ],
});
