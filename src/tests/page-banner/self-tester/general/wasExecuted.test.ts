import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { sovAppDataEverythingIsOkay } from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

executeOverlayTests({
  testName: "wasExecuted",
  tests: [
    ...generateTests({
      elementKey: "wasExecuted",
      testsInfo: [
        {
          testName: "Executed",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "notExecuted",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
          disableFlexibleIFrameJs: true,
        },
      ],
    }),
  ],
});
