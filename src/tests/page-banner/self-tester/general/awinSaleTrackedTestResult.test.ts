import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

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
