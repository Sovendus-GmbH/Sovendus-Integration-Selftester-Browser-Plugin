import { StatusCodes } from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

// Wird nie gesetzt, ist immer undefined und StatusCodes.TestDidNotRun

executeOverlayTests({
  testName: "thankYouPageDetection",
  tests: [
    ...generateTests({
      elementKey: "thankYouPageDetection",
      testsInfo: [
        {
          testName: "isThankYouPage",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              checkoutProductsJsScript: true,
              landingPage: false,
            },
          },
        },
        {
          testName: "notThankYouPage",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          testOptions: {
            regular: {
              checkoutProductsJsScript: true,
              landingPage: true,
            },
          },
        },
      ],
    }),
  ],
});
