import { StatusCodes } from "@src/integration-tester/integration-tester-data-to-sync-with-dev-hub";
import { sovAppDataEverythingIsOkay } from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

// Wird nie gesetzt, ist immer undefined und StatusCodes.TestDidNotRun

executeOverlayTests({
  testName: "landingPageDetection",
  tests: [
    ...generateTests({
      elementKey: "landingPageDetection",
      testsInfo: [
        {
          testName: "isLandingPage",
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
        {
          testName: "notLandingPage",
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
      ],
    }),
  ],
});
