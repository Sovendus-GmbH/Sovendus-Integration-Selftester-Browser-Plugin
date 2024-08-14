import { StatusCodes } from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

executeOverlayTests({
  testName: "sovIFramesAmount",
  tests: [
    ...generateTests({
      elementKey: "sovIFramesAmount",
      testsInfo: [
        {
          testName: "oneIFrame",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: Number(1n),
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "noIFrame",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: 0,
          expectedStatusCode: StatusCodes.Error,
          expectedStatusMessageKey: null,
          disableFlexibleIframeJs: true,
        },
      ],
    }),
  ],
});
