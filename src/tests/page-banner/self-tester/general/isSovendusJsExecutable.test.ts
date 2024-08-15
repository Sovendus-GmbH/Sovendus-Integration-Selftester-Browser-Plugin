import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "src/tests/testUtils/sovAppData";
import { executeOverlayTests } from "src/tests/testUtils/testUtils";

// Cookie tool abgelehnt

executeOverlayTests({
  testName: "isSovendusJsExecutable",
  tests: [
    ...generateTests({
      elementKey: "isSovendusJsExecutable",
      testsInfo: [
        {
          testName: "sovendusJsIsExecutable",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "sovendusJsNotExecutable",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          disableFlexibleIFrameJs: true,
        },
      ],
    }),
  ],
});
