import {
  StatusCodes,
  StatusMessageKeyTypes,
} from "@src/page-banner/self-tester-data-to-sync-with-dev-hub";
import {
  sovAppDataEverythingIsOkay,
  sovAppDataUndefinedButIsOkay,
} from "@src/tests/testUtils/sovAppData";
import { generateTests } from "@src/tests/testUtils/testCaseGenerator";
import { executeOverlayTests } from "@src/tests/testUtils/testUtils";

// Mit Marcus schauen wie man eine andere Fehlermeldung einbauen könnte die besser passt, wenn das sovendusJs gar nicht ausgeführt wird

// Timeout hinzufügen, damit SovendusJs eine Sekunde nach FlexibleIFrameJS ausgeführt wird

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

          // StatusMessageKeyTypes.flexibleIFrameJsExecutedTooEarly ist falsch

          expectedStatusMessageKey:
            StatusMessageKeyTypes.flexibleIFrameJsExecutedTooEarly,
          disableFlexibleIFrameJs: true,
        },
      ],
    }),
  ],
});
