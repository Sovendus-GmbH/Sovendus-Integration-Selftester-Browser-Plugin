import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";

import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "../../../testUtils/sovAppData";
import { executeOverlayTests } from "../../../testUtils/testUtils";

// Mit Marcus schauen wie man eine andere Fehlermeldung einbauen könnte die besser passt, wenn das sovendusJs gar nicht ausgeführt wird

executeOverlayTests({
  testName: "isSovendusJsOnDom",
  tests: [
    ...generateTests({
      elementKey: "isSovendusJsOnDom",
      testsInfo: [
        {
          testName: "sovendusJsOnDom",
          sovAppData: sovAppDataEverythingIsOkay,
          expectedElementValue: true,
          expectedStatusCode: StatusCodes.Success,
          expectedStatusMessageKey: null,
        },
        {
          testName: "sovendusJsNotOnDom",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: false,
          expectedStatusCode: StatusCodes.Error,

          // StatusMessageKeyTypes.flexibleIframeJsExecutedTooEarly ist falsch

          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIframeJsExecutedTooEarly,
          disableFlexibleIframeJs: true,
        },
      ],
    }),
  ],
});
