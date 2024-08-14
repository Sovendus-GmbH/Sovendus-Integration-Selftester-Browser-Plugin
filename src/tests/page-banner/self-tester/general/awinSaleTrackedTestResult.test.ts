import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
} from "../../../testUtils/sovAppData";
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
          disableAwinSalesTracking: true,
        },
      ],
    }),
  ],
});
