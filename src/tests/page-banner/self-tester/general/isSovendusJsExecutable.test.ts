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

          // Hier sollte StatusCodes.Success kommen

          expectedStatusCode: StatusCodes.Error,

          // Dieser Fehler sollte nicht enstehen StatusMessageKeyTypes.unknownErrorIntegrationScriptFailed

          expectedStatusMessageKey:
            StatusMessageKeyTypes.unknownErrorIntegrationScriptFailed,
        },
        {
          testName: "sovendusJsNotExecutable",
          sovAppData: sovAppDataUndefinedButIsOkay,
          expectedElementValue: null,
          expectedStatusCode: StatusCodes.TestDidNotRun,
          expectedStatusMessageKey: null,
          disableFlexibleIframeJs: true,
        },
      ],
    }),
  ],
});
